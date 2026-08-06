import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router";

import LabelForm from "../components/layouts/LabelForm.jsx";
import PaginationControls from "../components/layouts/PaginationControls.jsx";
import ProjectForm from "../components/layouts/ProjectForm.jsx";
import Sidebar from "../components/layouts/Sidebar.jsx";
import TaskFilters from "../components/layouts/TaskFilters.jsx";
import TaskForm from "../components/layouts/TaskForm.jsx";
import TaskList from "../components/layouts/TaskList.jsx";

function DashboardPage() {
  const navigate = useNavigate();

  const [activeView, setActiveView] =
    useState("today");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filters, setFilters] = useState({
    priority: "",
    dueDate: "",
    sortBy: "created_at",
    order: "desc",
  });

  const [showFilters, setShowFilters] =
    useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] =
    useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] =
    useState(0);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [selectedLabel, setSelectedLabel] =
    useState(null);

  const [editingTask, setEditingTask] =
    useState(null);

  const [editingProject, setEditingProject] =
    useState(null);

  const [editingLabel, setEditingLabel] =
    useState(null);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] =
    useState([]);
  const [labels, setLabels] = useState([]);

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [showLabelForm, setShowLabelForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [
    projectsLoading,
    setProjectsLoading,
  ] = useState(true);

  const [labelsLoading, setLabelsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [projectsError, setProjectsError] =
    useState("");

  const [labelsError, setLabelsError] =
    useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  const [deletingTaskId, setDeletingTaskId] =
    useState(null);

  const [
    deletingProjectId,
    setDeletingProjectId,
  ] = useState(null);

  const [
    deletingLabelId,
    setDeletingLabelId,
  ] = useState(null);

  function getAccessToken() {
    return localStorage.getItem(
      "access_token"
    );
  }

  const handleUnauthorized =
    useCallback(() => {
      localStorage.removeItem(
        "access_token"
      );

      navigate("/login", {
        replace: true,
      });
    }, [navigate]);

  function handleLogout() {
    handleUnauthorized();
  }

  function isServerPaginatedView() {
    return (
      activeView === "project" ||
      activeView === "label" ||
      activeView === "completed" ||
      activeView === "search"
    );
  }

  const buildTaskQuery = useCallback(
    (baseParameters = {}) => {
      const queryParameters =
        new URLSearchParams();

      for (
        const [name, value] of
        Object.entries(baseParameters)
      ) {
        if (
          value !== null &&
          value !== undefined &&
          value !== ""
        ) {
          queryParameters.set(
            name,
            String(value)
          );
        }
      }

      if (filters.priority) {
        queryParameters.set(
          "priority",
          filters.priority
        );
      }

      if (filters.dueDate) {
        queryParameters.set(
          "due_date",
          filters.dueDate
        );
      }

      queryParameters.set(
        "sort_by",
        filters.sortBy
      );

      queryParameters.set(
        "order",
        filters.order
      );

      queryParameters.set(
        "page",
        String(page)
      );

      queryParameters.set(
        "page_size",
        String(pageSize)
      );

      return queryParameters.toString();
    },
    [filters, page, pageSize]
  );

  const getTasksEndpoint = useCallback(() => {
    const tasksUrl =
      "http://127.0.0.1:8000/tasks/";

    if (
      activeView === "project" &&
      selectedProject
    ) {
      const query = buildTaskQuery({
        project_id: selectedProject.id,
        status: "pending",
      });

      return `${tasksUrl}?${query}`;
    }

    if (
      activeView === "label" &&
      selectedLabel
    ) {
      const query = buildTaskQuery({
        label_id: selectedLabel.id,
        status: "pending",
      });

      return `${tasksUrl}?${query}`;
    }

    if (
      activeView === "search" &&
      searchQuery
    ) {
      const query = buildTaskQuery({
        search: searchQuery,
      });

      return `${tasksUrl}?${query}`;
    }

    if (activeView === "completed") {
      const query = buildTaskQuery({
        status: "completed",
      });

      return `${tasksUrl}?${query}`;
    }

    if (activeView === "inbox") {
      return "http://127.0.0.1:8000/tasks/inbox";
    }

    if (activeView === "upcoming") {
      return "http://127.0.0.1:8000/dashboard/upcoming";
    }

    return "http://127.0.0.1:8000/dashboard/today";
  }, [
    activeView,
    selectedProject,
    selectedLabel,
    searchQuery,
    buildTaskQuery,
  ]);

  const applyLocalFiltersAndSorting =
    useCallback(
      (taskItems) => {
        let filteredTasks = [
          ...taskItems,
        ];

        if (filters.priority) {
          filteredTasks =
            filteredTasks.filter(
              (task) =>
                task.priority ===
                filters.priority
            );
        }

        if (filters.dueDate) {
          filteredTasks =
            filteredTasks.filter(
              (task) => {
                if (!task.due_date) {
                  return false;
                }

                const taskDate =
                  new Date(
                    task.due_date
                  ).toLocaleDateString(
                    "en-CA"
                  );

                return (
                  taskDate ===
                  filters.dueDate
                );
              }
            );
        }

        filteredTasks.sort(
          (
            firstTask,
            secondTask
          ) => {
            let firstValue;
            let secondValue;

            if (
              filters.sortBy ===
              "title"
            ) {
              firstValue =
                firstTask.title.toLowerCase();

              secondValue =
                secondTask.title.toLowerCase();
            } else if (
              filters.sortBy ===
              "due_date"
            ) {
              firstValue =
                firstTask.due_date
                  ? new Date(
                      firstTask.due_date
                    ).getTime()
                  : Number.POSITIVE_INFINITY;

              secondValue =
                secondTask.due_date
                  ? new Date(
                      secondTask.due_date
                    ).getTime()
                  : Number.POSITIVE_INFINITY;
            } else {
              firstValue =
                firstTask[
                  filters.sortBy
                ]
                  ? new Date(
                      firstTask[
                        filters.sortBy
                      ]
                    ).getTime()
                  : 0;

              secondValue =
                secondTask[
                  filters.sortBy
                ]
                  ? new Date(
                      secondTask[
                        filters.sortBy
                      ]
                    ).getTime()
                  : 0;
            }

            if (
              firstValue <
              secondValue
            ) {
              return filters.order ===
                "asc"
                ? -1
                : 1;
            }

            if (
              firstValue >
              secondValue
            ) {
              return filters.order ===
                "asc"
                ? 1
                : -1;
            }

            return (
              firstTask.id -
              secondTask.id
            );
          }
        );

        return filteredTasks;
      },
      [filters]
    );

  const paginateLocalTasks =
    useCallback(
      (taskItems) => {
        const itemTotal =
          taskItems.length;

        const calculatedTotalPages =
          itemTotal === 0
            ? 0
            : Math.ceil(
                itemTotal / pageSize
              );

        if (
          calculatedTotalPages > 0 &&
          page > calculatedTotalPages
        ) {
          setPage(
            calculatedTotalPages
          );

          return null;
        }

        const offset =
          (page - 1) * pageSize;

        setTotal(itemTotal);
        setTotalPages(
          calculatedTotalPages
        );

        return taskItems.slice(
          offset,
          offset + pageSize
        );
      },
      [page, pageSize]
    );

  const loadTasks = useCallback(
    async () => {
      const accessToken =
        getAccessToken();

      if (!accessToken) {
        handleUnauthorized();
        return;
      }

      setTasks([]);
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          getTasksEndpoint(),
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data.detail ===
              "string"
              ? data.detail
              : "Could not load tasks"
          );
        }

        if (
          activeView === "project" ||
          activeView === "label" ||
          activeView === "completed" ||
          activeView === "search"
        ) {
          const responseTotalPages =
            typeof data.total_pages ===
            "number"
              ? data.total_pages
              : 0;

          if (
            responseTotalPages > 0 &&
            page > responseTotalPages
          ) {
            setPage(
              responseTotalPages
            );

            return;
          }

          setTasks(
            Array.isArray(data.items)
              ? data.items
              : []
          );

          setTotal(
            typeof data.total ===
              "number"
              ? data.total
              : 0
          );

          setTotalPages(
            responseTotalPages
          );
        } else {
          const taskItems =
            Array.isArray(data)
              ? data
              : [];

          const filteredTasks =
            applyLocalFiltersAndSorting(
              taskItems
            );

          const paginatedTasks =
            paginateLocalTasks(
              filteredTasks
            );

          if (
            paginatedTasks !== null
          ) {
            setTasks(
              paginatedTasks
            );
          }
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong"
        );

        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [
      activeView,
      page,
      getTasksEndpoint,
      handleUnauthorized,
      applyLocalFiltersAndSorting,
      paginateLocalTasks,
    ]
  );

  const loadProjects =
    useCallback(async () => {
      const accessToken =
        getAccessToken();

      if (!accessToken) {
        handleUnauthorized();
        return;
      }

      setProjectsLoading(true);
      setProjectsError("");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/projects/",
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data.detail ===
              "string"
              ? data.detail
              : "Could not load projects"
          );
        }

        setProjects(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (requestError) {
        setProjectsError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong"
        );
      } finally {
        setProjectsLoading(false);
      }
    }, [handleUnauthorized]);

  const loadLabels =
    useCallback(async () => {
      const accessToken =
        getAccessToken();

      if (!accessToken) {
        handleUnauthorized();
        return;
      }

      setLabelsLoading(true);
      setLabelsError("");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/labels/",
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data.detail ===
              "string"
              ? data.detail
              : "Could not load labels"
          );
        }

        setLabels(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (requestError) {
        setLabelsError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong"
        );
      } finally {
        setLabelsLoading(false);
      }
    }, [handleUnauthorized]);

  useEffect(() => {
    loadProjects();
    loadLabels();
  }, [
    loadProjects,
    loadLabels,
  ]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleToggleTaskStatus(
    task
  ) {
    const accessToken =
      getAccessToken();

    if (!accessToken) {
      handleUnauthorized();
      return;
    }

    const action =
      task.status === "completed"
        ? "reopen"
        : "complete";

    const endpoint =
      `http://127.0.0.1:8000/tasks/` +
      `${task.id}/${action}`;

    setUpdatingTaskId(task.id);
    setError("");

    try {
      const response = await fetch(
        endpoint,
        {
          method: "PATCH",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const updatedTask =
        await response.json();

      if (!response.ok) {
        throw new Error(
          typeof updatedTask.detail ===
            "string"
            ? updatedTask.detail
            : "Could not update task"
        );
      }

      if (
        tasks.length === 1 &&
        page > 1
      ) {
        setPage(
          (currentPage) =>
            currentPage - 1
        );
      } else {
        await loadTasks();
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(
    task
  ) {
    const shouldDelete =
      window.confirm(
        `Delete task "${task.title}"?`
      );

    if (!shouldDelete) {
      return;
    }

    const accessToken =
      getAccessToken();

    if (!accessToken) {
      handleUnauthorized();
      return;
    }

    setDeletingTaskId(task.id);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let errorMessage =
          "Could not delete task";

        try {
          const data =
            await response.json();

          if (
            typeof data.detail ===
            "string"
          ) {
            errorMessage =
              data.detail;
          }
        } catch {
          // Το 204 response δεν έχει body.
        }

        throw new Error(errorMessage);
      }

      if (
        editingTask?.id === task.id
      ) {
        setEditingTask(null);
        setShowTaskForm(false);
      }

      if (
        tasks.length === 1 &&
        page > 1
      ) {
        setPage(
          (currentPage) =>
            currentPage - 1
        );
      } else {
        await loadTasks();
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  async function handleDeleteProject(
    project
  ) {
    const shouldDelete =
      window.confirm(
        `Delete project "${project.name}"?`
      );

    if (!shouldDelete) {
      return;
    }

    const accessToken =
      getAccessToken();

    if (!accessToken) {
      handleUnauthorized();
      return;
    }

    setDeletingProjectId(project.id);
    setProjectsError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/projects/${project.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let errorMessage =
          "Could not delete project";

        try {
          const data =
            await response.json();

          if (
            typeof data.detail ===
            "string"
          ) {
            errorMessage =
              data.detail;
          }
        } catch {
          // Το 204 response δεν έχει body.
        }

        throw new Error(errorMessage);
      }

      setProjects(
        (currentProjects) =>
          currentProjects.filter(
            (currentProject) =>
              currentProject.id !==
              project.id
          )
      );

      if (
        selectedProject?.id ===
        project.id
      ) {
        setSelectedProject(null);
        setActiveView("today");
        setPage(1);
        setTasks([]);
      }

      if (
        editingProject?.id ===
        project.id
      ) {
        setEditingProject(null);
        setShowProjectForm(false);
      }
    } catch (requestError) {
      setProjectsError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setDeletingProjectId(null);
    }
  }

  async function handleDeleteLabel(
    label
  ) {
    const shouldDelete =
      window.confirm(
        `Delete label "#${label.name}"?`
      );

    if (!shouldDelete) {
      return;
    }

    const accessToken =
      getAccessToken();

    if (!accessToken) {
      handleUnauthorized();
      return;
    }

    setDeletingLabelId(label.id);
    setLabelsError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/labels/${label.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let errorMessage =
          "Could not delete label";

        try {
          const data =
            await response.json();

          if (
            typeof data.detail ===
            "string"
          ) {
            errorMessage =
              data.detail;
          }
        } catch {
          // Το 204 response δεν έχει body.
        }

        throw new Error(errorMessage);
      }

      setLabels(
        (currentLabels) =>
          currentLabels.filter(
            (currentLabel) =>
              currentLabel.id !==
              label.id
          )
      );

      if (
        selectedLabel?.id ===
        label.id
      ) {
        setSelectedLabel(null);
        setActiveView("today");
        setPage(1);
        setTasks([]);
      }

      if (
        editingLabel?.id ===
        label.id
      ) {
        setEditingLabel(null);
        setShowLabelForm(false);
      }
    } catch (requestError) {
      setLabelsError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setDeletingLabelId(null);
    }
  }

  async function handleTaskSaved() {
    setShowTaskForm(false);
    setEditingTask(null);
    setPage(1);

    await loadTasks();
  }

  async function handleProjectSaved(
    savedProject
  ) {
    setShowProjectForm(false);
    setEditingProject(null);

    await loadProjects();

    if (
      selectedProject?.id ===
      savedProject.id
    ) {
      setSelectedProject(
        savedProject
      );
    }
  }

  async function handleLabelSaved(
    savedLabel
  ) {
    setShowLabelForm(false);
    setEditingLabel(null);

    await loadLabels();

    if (
      selectedLabel?.id ===
      savedLabel.id
    ) {
      setSelectedLabel(
        savedLabel
      );
    }
  }

  function handleFilterChange(
    name,
    value
  ) {
    setFilters(
      (currentFilters) => ({
        ...currentFilters,
        [name]: value,
      })
    );

    setPage(1);
  }

  function handleClearFilters() {
    setFilters({
      priority: "",
      dueDate: "",
      sortBy: "created_at",
      order: "desc",
    });

    setPage(1);
  }

  function handlePageChange(
    nextPage
  ) {
    if (
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    setPage(nextPage);
  }

  function handlePageSizeChange(
    nextPageSize
  ) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  function closeAllForms() {
    setShowTaskForm(false);
    setShowProjectForm(false);
    setShowLabelForm(false);

    setEditingTask(null);
    setEditingProject(null);
    setEditingLabel(null);
  }

  function handleViewChange(view) {
    setActiveView(view);
    setSearchQuery("");
    setSelectedProject(null);
    setSelectedLabel(null);
    setPage(1);

    closeAllForms();
  }

  function handleProjectSelect(
    project
  ) {
    setActiveView("project");
    setSearchQuery("");
    setSelectedProject(project);
    setSelectedLabel(null);
    setPage(1);

    closeAllForms();
  }

  function handleLabelSelect(label) {
    setActiveView("label");
    setSearchQuery("");
    setSelectedLabel(label);
    setSelectedProject(null);
    setPage(1);

    closeAllForms();
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setActiveView("search");

    setSelectedProject(null);
    setSelectedLabel(null);
    setPage(1);

    closeAllForms();
  }

  function handleClearSearch() {
    setSearchQuery("");
    setActiveView("today");

    setSelectedProject(null);
    setSelectedLabel(null);
    setPage(1);

    closeAllForms();
  }

  function handleAddTask() {
    setEditingTask(null);
    setEditingProject(null);
    setEditingLabel(null);

    setShowTaskForm(true);
    setShowProjectForm(false);
    setShowLabelForm(false);
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setEditingProject(null);
    setEditingLabel(null);

    setShowTaskForm(true);
    setShowProjectForm(false);
    setShowLabelForm(false);
  }

  function handleAddProject() {
    setEditingTask(null);
    setEditingProject(null);
    setEditingLabel(null);

    setShowProjectForm(true);
    setShowTaskForm(false);
    setShowLabelForm(false);
  }

  function handleEditProject(
    project
  ) {
    setEditingTask(null);
    setEditingProject(project);
    setEditingLabel(null);

    setShowProjectForm(true);
    setShowTaskForm(false);
    setShowLabelForm(false);
  }

  function handleAddLabel() {
    setEditingTask(null);
    setEditingProject(null);
    setEditingLabel(null);

    setShowLabelForm(true);
    setShowTaskForm(false);
    setShowProjectForm(false);
  }

  function handleEditLabel(label) {
    setEditingTask(null);
    setEditingLabel(label);
    setEditingProject(null);

    setShowLabelForm(true);
    setShowTaskForm(false);
    setShowProjectForm(false);
  }

  function getPageTitle() {
    if (
      activeView === "project" &&
      selectedProject
    ) {
      return selectedProject.name;
    }

    if (
      activeView === "label" &&
      selectedLabel
    ) {
      return `#${selectedLabel.name}`;
    }

    if (activeView === "search") {
      return `Search: ${searchQuery}`;
    }

    if (activeView === "inbox") {
      return "Inbox";
    }

    if (activeView === "upcoming") {
      return "Upcoming";
    }

    if (activeView === "completed") {
      return "Completed";
    }

    return "Today";
  }

  const isAnyFormOpen =
    showTaskForm ||
    showProjectForm ||
    showLabelForm;

  const canCreateTask =
    !isAnyFormOpen &&
    activeView !== "completed" &&
    activeView !== "search";

  return (
    <main>
      <Sidebar
        activeView={activeView}
        selectedProjectId={
          selectedProject?.id ?? null
        }
        selectedLabelId={
          selectedLabel?.id ?? null
        }
        searchQuery={searchQuery}
        projects={projects}
        labels={labels}
        projectsLoading={
          projectsLoading
        }
        labelsLoading={
          labelsLoading
        }
        deletingProjectId={
          deletingProjectId
        }
        deletingLabelId={
          deletingLabelId
        }
        onViewChange={
          handleViewChange
        }
        onProjectSelect={
          handleProjectSelect
        }
        onLabelSelect={
          handleLabelSelect
        }
        onSearch={handleSearch}
        onClearSearch={
          handleClearSearch
        }
        onAddProject={
          handleAddProject
        }
        onEditProject={
          handleEditProject
        }
        onDeleteProject={
          handleDeleteProject
        }
        onAddLabel={
          handleAddLabel
        }
        onEditLabel={
          handleEditLabel
        }
        onDeleteLabel={
          handleDeleteLabel
        }
        onLogout={handleLogout}
      />

      <section>
        <header>
          <h1>{getPageTitle()}</h1>

          <div>
            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (
                    currentValue
                  ) => !currentValue
                )
              }
            >
              {showFilters
                ? "Hide view options"
                : "View options"}
            </button>

            {canCreateTask && (
              <button
                type="button"
                onClick={
                  handleAddTask
                }
              >
                + Add task
              </button>
            )}
          </div>
        </header>

        {showFilters && (
          <TaskFilters
            filters={filters}
            onFilterChange={
              handleFilterChange
            }
            onClearFilters={
              handleClearFilters
            }
          />
        )}

        {projectsError && (
          <div role="alert">
            {projectsError}
          </div>
        )}

        {labelsError && (
          <div role="alert">
            {labelsError}
          </div>
        )}

        {showProjectForm && (
          <ProjectForm
            project={editingProject}
            onProjectSaved={
              handleProjectSaved
            }
            onCancel={() => {
              setShowProjectForm(
                false
              );

              setEditingProject(
                null
              );
            }}
            onUnauthorized={
              handleUnauthorized
            }
          />
        )}

        {showLabelForm && (
          <LabelForm
            label={editingLabel}
            onLabelSaved={
              handleLabelSaved
            }
            onCancel={() => {
              setShowLabelForm(
                false
              );

              setEditingLabel(
                null
              );
            }}
            onUnauthorized={
              handleUnauthorized
            }
          />
        )}

        {showTaskForm && (
          <TaskForm
            task={editingTask}
            projects={projects}
            labels={labels}
            defaultProjectId={
              activeView ===
              "project"
                ? selectedProject
                    ?.id ?? null
                : null
            }
            defaultToToday={
              activeView ===
              "today"
            }
            onTaskSaved={
              handleTaskSaved
            }
            onCancel={() => {
              setShowTaskForm(
                false
              );

              setEditingTask(null);
            }}
            onUnauthorized={
              handleUnauthorized
            }
          />
        )}

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggleStatus={
            handleToggleTaskStatus
          }
          onEditTask={
            handleEditTask
          }
          onDeleteTask={
            handleDeleteTask
          }
          updatingTaskId={
            updatingTaskId
          }
          deletingTaskId={
            deletingTaskId
          }
        />

        {!loading && !error && (
          <PaginationControls
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={
              totalPages
            }
            onPageChange={
              handlePageChange
            }
            onPageSizeChange={
              handlePageSizeChange
            }
          />
        )}
      </section>
    </main>
  );
}

export default DashboardPage;