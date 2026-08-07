import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router";

import {
  removeAccessToken,
} from "../api/apiClient.js";

import {
  deleteLabel,
  getLabels,
} from "../api/labelsApi.js";

import {
  deleteProject,
  getProjects,
} from "../api/projectsApi.js";

import {
  completeTask,
  deleteTask,
  getFilteredTasks,
  getInboxTasks,
  getTodayTasks,
  getUpcomingTasks,
  reopenTask,
} from "../api/tasksApi.js";

import LabelForm from "../components/layouts/LabelForm.jsx";
import Modal from "../components/layouts/Modal.jsx";
import PaginationControls from "../components/layouts/PaginationControls.jsx";
import ProjectForm from "../components/layouts/ProjectForm.jsx";
import Sidebar from "../components/layouts/Sidebar.jsx";
import TaskFilters from "../components/layouts/TaskFilters.jsx";
import TaskForm from "../components/layouts/TaskForm.jsx";
import TaskList from "../components/layouts/TaskList.jsx";

import "../styles/dashboard.css";


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

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [total, setTotal] =
    useState(0);

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

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [labels, setLabels] =
    useState([]);

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [showLabelForm, setShowLabelForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [projectsLoading, setProjectsLoading] =
    useState(true);

  const [labelsLoading, setLabelsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [projectsError, setProjectsError] =
    useState("");

  const [labelsError, setLabelsError] =
    useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  const [deletingTaskId, setDeletingTaskId] =
    useState(null);

  const [deletingProjectId, setDeletingProjectId] =
    useState(null);

  const [deletingLabelId, setDeletingLabelId] =
    useState(null);


  const handleUnauthorized = useCallback(() => {
    removeAccessToken();

    navigate("/login", {
      replace: true,
    });
  }, [navigate]);


  function handleLogout() {
    handleUnauthorized();
  }


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
          (firstTask, secondTask) => {
            let firstValue;
            let secondValue;

            if (
              filters.sortBy === "title"
            ) {
              firstValue =
                firstTask.title
                  .toLowerCase();

              secondValue =
                secondTask.title
                  .toLowerCase();
            } else if (
              filters.sortBy === "due_date"
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

            if (firstValue < secondValue) {
              return filters.order === "asc"
                ? -1
                : 1;
            }

            if (firstValue > secondValue) {
              return filters.order === "asc"
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


  const getServerTaskParameters =
    useCallback(() => {
      const parameters = {
        priority:
          filters.priority || undefined,

        due_date:
          filters.dueDate || undefined,

        sort_by:
          filters.sortBy,

        order:
          filters.order,

        page,

        page_size:
          pageSize,
      };

      if (
        activeView === "project" &&
        selectedProject
      ) {
        return {
          ...parameters,
          project_id:
            selectedProject.id,
          status: "pending",
        };
      }

      if (
        activeView === "label" &&
        selectedLabel
      ) {
        return {
          ...parameters,
          label_id:
            selectedLabel.id,
          status: "pending",
        };
      }

      if (
        activeView === "search" &&
        searchQuery
      ) {
        return {
          ...parameters,
          search: searchQuery,
        };
      }

      if (activeView === "completed") {
        return {
          ...parameters,
          status: "completed",
        };
      }

      return parameters;
    }, [
      activeView,
      selectedProject,
      selectedLabel,
      searchQuery,
      filters,
      page,
      pageSize,
    ]);


  const loadTasks =
    useCallback(async () => {
      setTasks([]);
      setLoading(true);
      setError("");

      try {
        const isServerPaginatedView =
          activeView === "project" ||
          activeView === "label" ||
          activeView === "search" ||
          activeView === "completed";

        if (isServerPaginatedView) {
          const data =
            await getFilteredTasks(
              getServerTaskParameters(),
              handleUnauthorized
            );

          const responseTotalPages =
            typeof data?.total_pages ===
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
            Array.isArray(data?.items)
              ? data.items
              : []
          );

          setTotal(
            typeof data?.total ===
            "number"
              ? data.total
              : 0
          );

          setTotalPages(
            responseTotalPages
          );

          return;
        }

        let data;

        if (
          activeView === "inbox"
        ) {
          data =
            await getInboxTasks(
              handleUnauthorized
            );
        } else if (
          activeView === "upcoming"
        ) {
          data =
            await getUpcomingTasks(
              handleUnauthorized
            );
        } else {
          data =
            await getTodayTasks(
              handleUnauthorized
            );
        }

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
      } catch (requestError) {
        if (
          requestError?.status === 401
        ) {
          return;
        }

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
    }, [
      activeView,
      page,
      getServerTaskParameters,
      handleUnauthorized,
      applyLocalFiltersAndSorting,
      paginateLocalTasks,
    ]);


  const loadProjects =
    useCallback(async () => {
      setProjectsLoading(true);
      setProjectsError("");

      try {
        const data =
          await getProjects(
            handleUnauthorized
          );

        setProjects(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (requestError) {
        if (
          requestError?.status === 401
        ) {
          return;
        }

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
      setLabelsLoading(true);
      setLabelsError("");

      try {
        const data =
          await getLabels(
            handleUnauthorized
          );

        setLabels(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (requestError) {
        if (
          requestError?.status === 401
        ) {
          return;
        }

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
    setUpdatingTaskId(
      task.id
    );

    setError("");

    try {
      if (
        task.status === "completed"
      ) {
        await reopenTask(
          task.id,
          handleUnauthorized
        );
      } else {
        await completeTask(
          task.id,
          handleUnauthorized
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
      if (
        requestError?.status === 401
      ) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }


  async function handleDeleteTaskAction(
    task
  ) {
    const shouldDelete =
      window.confirm(
        `Delete task "${task.title}"?`
      );

    if (!shouldDelete) {
      return;
    }

    setDeletingTaskId(
      task.id
    );

    setError("");

    try {
      await deleteTask(
        task.id,
        handleUnauthorized
      );

      if (
        editingTask?.id ===
        task.id
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
      if (
        requestError?.status === 401
      ) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setDeletingTaskId(null);
    }
  }


  async function handleDeleteProjectAction(
    project
  ) {
    const shouldDelete =
      window.confirm(
        `Delete project "${project.name}"?`
      );

    if (!shouldDelete) {
      return;
    }

    setDeletingProjectId(
      project.id
    );

    setProjectsError("");

    try {
      await deleteProject(
        project.id,
        handleUnauthorized
      );

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
      if (
        requestError?.status === 401
      ) {
        return;
      }

      setProjectsError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setDeletingProjectId(null);
    }
  }


  async function handleDeleteLabelAction(
    label
  ) {
    const shouldDelete =
      window.confirm(
        `Delete label "#${label.name}"?`
      );

    if (!shouldDelete) {
      return;
    }

    setDeletingLabelId(
      label.id
    );

    setLabelsError("");

    try {
      await deleteLabel(
        label.id,
        handleUnauthorized
      );

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
      if (
        requestError?.status === 401
      ) {
        return;
      }

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

    if (page !== 1) {
      setPage(1);
      return;
    }

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
    setPageSize(
      nextPageSize
    );

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


  function handleLabelSelect(
    label
  ) {
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


  function handleEditTask(
    task
  ) {
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


  function handleEditLabel(
    label
  ) {
    setEditingTask(null);
    setEditingLabel(label);
    setEditingProject(null);

    setShowLabelForm(true);
    setShowTaskForm(false);
    setShowProjectForm(false);
  }


  function closeTaskModal() {
    setShowTaskForm(false);
    setEditingTask(null);
  }


  function closeProjectModal() {
    setShowProjectForm(false);
    setEditingProject(null);
  }


  function closeLabelModal() {
    setShowLabelForm(false);
    setEditingLabel(null);
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

    if (
      activeView === "search"
    ) {
      return `Search: ${searchQuery}`;
    }

    if (
      activeView === "inbox"
    ) {
      return "Inbox";
    }

    if (
      activeView === "upcoming"
    ) {
      return "Upcoming";
    }

    if (
      activeView === "completed"
    ) {
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
    <main className="dashboard-page">
      <div className="dashboard-layout">

        <Sidebar
          activeView={
            activeView
          }
          selectedProjectId={
            selectedProject?.id ??
            null
          }
          selectedLabelId={
            selectedLabel?.id ??
            null
          }
          searchQuery={
            searchQuery
          }
          projects={
            projects
          }
          labels={
            labels
          }
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
          onSearch={
            handleSearch
          }
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
            handleDeleteProjectAction
          }
          onAddLabel={
            handleAddLabel
          }
          onEditLabel={
            handleEditLabel
          }
          onDeleteLabel={
            handleDeleteLabelAction
          }
          onLogout={
            handleLogout
          }
        />


        <section className="dashboard-main">
          <div className="dashboard-content">

            <header className="dashboard-header">
              <h1 className="dashboard-title">
                {getPageTitle()}
              </h1>

              <div className="dashboard-actions">
                <button
                  type="button"
                  className="dashboard-button"
                  onClick={() =>
                    setShowFilters(
                      (
                        currentValue
                      ) =>
                        !currentValue
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
                    className="dashboard-button dashboard-button-primary"
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
                filters={
                  filters
                }
                onFilterChange={
                  handleFilterChange
                }
                onClearFilters={
                  handleClearFilters
                }
              />
            )}


            {projectsError && (
              <div
                className="dashboard-error"
                role="alert"
              >
                {projectsError}
              </div>
            )}


            {labelsError && (
              <div
                className="dashboard-error"
                role="alert"
              >
                {labelsError}
              </div>
            )}


            <TaskList
              tasks={
                tasks
              }
              loading={
                loading
              }
              error={
                error
              }
              onToggleStatus={
                handleToggleTaskStatus
              }
              onEditTask={
                handleEditTask
              }
              onDeleteTask={
                handleDeleteTaskAction
              }
              updatingTaskId={
                updatingTaskId
              }
              deletingTaskId={
                deletingTaskId
              }
            />


            {!loading &&
              !error && (
                <PaginationControls
                  page={
                    page
                  }
                  pageSize={
                    pageSize
                  }
                  total={
                    total
                  }
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

          </div>
        </section>


        {showTaskForm && (
          <Modal
            onClose={
              closeTaskModal
            }
            ariaLabel={
              editingTask
                ? "Edit task"
                : "Create task"
            }
          >
            <TaskForm
              task={
                editingTask
              }
              projects={
                projects
              }
              labels={
                labels
              }
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
              onCancel={
                closeTaskModal
              }
              onUnauthorized={
                handleUnauthorized
              }
            />
          </Modal>
        )}


        {showProjectForm && (
          <Modal
            onClose={
              closeProjectModal
            }
            ariaLabel={
              editingProject
                ? "Edit project"
                : "Create project"
            }
          >
            <ProjectForm
              project={
                editingProject
              }
              onProjectSaved={
                handleProjectSaved
              }
              onCancel={
                closeProjectModal
              }
              onUnauthorized={
                handleUnauthorized
              }
            />
          </Modal>
        )}


        {showLabelForm && (
          <Modal
            onClose={
              closeLabelModal
            }
            ariaLabel={
              editingLabel
                ? "Edit label"
                : "Create label"
            }
          >
            <LabelForm
              label={
                editingLabel
              }
              onLabelSaved={
                handleLabelSaved
              }
              onCancel={
                closeLabelModal
              }
              onUnauthorized={
                handleUnauthorized
              }
            />
          </Modal>
        )}

      </div>
    </main>
  );
}


export default DashboardPage;