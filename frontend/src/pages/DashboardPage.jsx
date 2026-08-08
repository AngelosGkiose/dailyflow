import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  useAuth,
} from "../context/AuthContext.jsx";

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

import ConfirmModal from "../components/layouts/ConfirmModal.jsx";
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
  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  const [activeView, setActiveView] =
    useState("today");

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filters, setFilters] =
    useState({
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

  const [
    totalPages,
    setTotalPages,
  ] = useState(0);

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [
    selectedLabel,
    setSelectedLabel,
  ] = useState(null);

  const [
    editingTask,
    setEditingTask,
  ] = useState(null);

  const [
    editingProject,
    setEditingProject,
  ] = useState(null);

  const [
    editingLabel,
    setEditingLabel,
  ] = useState(null);

  const [tasks, setTasks] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [labels, setLabels] =
    useState([]);

  const [
    showTaskForm,
    setShowTaskForm,
  ] = useState(false);

  const [
    showProjectForm,
    setShowProjectForm,
  ] = useState(false);

  const [
    showLabelForm,
    setShowLabelForm,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [
    projectsLoading,
    setProjectsLoading,
  ] = useState(true);

  const [
    labelsLoading,
    setLabelsLoading,
  ] = useState(true);

  const [error, setError] =
    useState("");

  const [
    projectsError,
    setProjectsError,
  ] = useState("");

  const [
    labelsError,
    setLabelsError,
  ] = useState("");

  const [
    updatingTaskId,
    setUpdatingTaskId,
  ] = useState(null);

  const [
    deletingTaskId,
    setDeletingTaskId,
  ] = useState(null);

  const [
    deletingProjectId,
    setDeletingProjectId,
  ] = useState(null);

  const [
    deletingLabelId,
    setDeletingLabelId,
  ] = useState(null);

  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] = useState(null);


  const handleUnauthorized =
    useCallback(async () => {
      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    }, [
      logout,
      navigate,
    ]);


  async function handleLogout() {
    await handleUnauthorized();
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
                firstTask.title
                  .toLowerCase();

              secondValue =
                secondTask.title
                  .toLowerCase();
            } else if (
              filters.sortBy ===
              "due_date"
            ) {
              firstValue =
                firstTask.due_date
                  ? new Date(
                      firstTask.due_date
                    ).getTime()
                  : Number
                      .POSITIVE_INFINITY;

              secondValue =
                secondTask.due_date
                  ? new Date(
                      secondTask.due_date
                    ).getTime()
                  : Number
                      .POSITIVE_INFINITY;
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
              return (
                filters.order ===
                "asc"
                  ? -1
                  : 1
              );
            }


            if (
              firstValue >
              secondValue
            ) {
              return (
                filters.order ===
                "asc"
                  ? 1
                  : -1
              );
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
                itemTotal /
                pageSize
              );


        if (
          calculatedTotalPages >
            0 &&
          page >
            calculatedTotalPages
        ) {
          setPage(
            calculatedTotalPages
          );

          return null;
        }


        const offset =
          (page - 1) *
          pageSize;


        setTotal(itemTotal);

        setTotalPages(
          calculatedTotalPages
        );


        return taskItems.slice(
          offset,
          offset + pageSize
        );
      },
      [
        page,
        pageSize,
      ]
    );


  const getServerTaskParameters =
    useCallback(() => {
      const parameters = {
        priority:
          filters.priority ||
          undefined,

        due_date:
          filters.dueDate ||
          undefined,

        sort_by:
          filters.sortBy,

        order:
          filters.order,

        page,

        page_size:
          pageSize,
      };


      if (
        activeView ===
          "project" &&
        selectedProject
      ) {
        return {
          ...parameters,

          project_id:
            selectedProject.id,

          status:
            "pending",
        };
      }


      if (
        activeView ===
          "label" &&
        selectedLabel
      ) {
        return {
          ...parameters,

          label_id:
            selectedLabel.id,

          status:
            "pending",
        };
      }


      if (
        activeView ===
          "search" &&
        searchQuery
      ) {
        return {
          ...parameters,

          search:
            searchQuery,
        };
      }


      if (
        activeView ===
        "completed"
      ) {
        return {
          ...parameters,

          status:
            "completed",
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


  const handleRequestError =
    useCallback(
      async (
        requestError,
        setRequestError
      ) => {
        if (
          requestError?.status ===
          401
        ) {
          await handleUnauthorized();

          return;
        }


        setRequestError(
          requestError instanceof
          Error
            ? requestError.message
            : "Something went wrong"
        );
      },
      [
        handleUnauthorized,
      ]
    );


  const loadTasks =
    useCallback(async () => {
      setTasks([]);
      setLoading(true);
      setError("");


      try {
        const isServerPaginatedView =
          activeView ===
            "project" ||
          activeView ===
            "label" ||
          activeView ===
            "search" ||
          activeView ===
            "completed";


        if (
          isServerPaginatedView
        ) {
          const data =
            await getFilteredTasks(
              getServerTaskParameters()
            );


          const responseTotalPages =
            typeof data
              ?.total_pages ===
              "number"
              ? data.total_pages
              : 0;


          if (
            responseTotalPages >
              0 &&
            page >
              responseTotalPages
          ) {
            setPage(
              responseTotalPages
            );

            return;
          }


          setTasks(
            Array.isArray(
              data?.items
            )
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
          activeView ===
          "inbox"
        ) {
          data =
            await getInboxTasks();
        } else if (
          activeView ===
          "upcoming"
        ) {
          data =
            await getUpcomingTasks();
        } else {
          data =
            await getTodayTasks();
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
          paginatedTasks !==
          null
        ) {
          setTasks(
            paginatedTasks
          );
        }
      } catch (
        requestError
      ) {
        await handleRequestError(
          requestError,
          setError
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
      applyLocalFiltersAndSorting,
      paginateLocalTasks,
      handleRequestError,
    ]);


  const loadProjects =
    useCallback(async () => {
      setProjectsLoading(true);
      setProjectsError("");


      try {
        const data =
          await getProjects();

        setProjects(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (
        requestError
      ) {
        await handleRequestError(
          requestError,
          setProjectsError
        );
      } finally {
        setProjectsLoading(false);
      }
    }, [
      handleRequestError,
    ]);


  const loadLabels =
    useCallback(async () => {
      setLabelsLoading(true);
      setLabelsError("");


      try {
        const data =
          await getLabels();

        setLabels(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (
        requestError
      ) {
        await handleRequestError(
          requestError,
          setLabelsError
        );
      } finally {
        setLabelsLoading(false);
      }
    }, [
      handleRequestError,
    ]);


  useEffect(() => {
    loadProjects();
    loadLabels();
  }, [
    loadProjects,
    loadLabels,
  ]);


  useEffect(() => {
    loadTasks();
  }, [
    loadTasks,
  ]);


  useEffect(() => {
    function handleResize() {
      if (
        window.innerWidth >
        900
      ) {
        setIsSidebarOpen(
          false
        );
      }
    }


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);


  async function handleToggleTaskStatus(
    task
  ) {
    setUpdatingTaskId(
      task.id
    );

    setError("");


    try {
      if (
        task.status ===
        "completed"
      ) {
        await reopenTask(
          task.id
        );
      } else {
        await completeTask(
          task.id
        );
      }


      if (
        tasks.length === 1 &&
        page > 1
      ) {
        setPage(
          (
            currentPage
          ) =>
            currentPage - 1
        );
      } else {
        await loadTasks();
      }
    } catch (
      requestError
    ) {
      await handleRequestError(
        requestError,
        setError
      );
    } finally {
      setUpdatingTaskId(
        null
      );
    }
  }


  function requestDeleteTask(
    task
  ) {
    setDeleteConfirmation({
      type: "task",
      item: task,
    });
  }


  function requestDeleteProject(
    project
  ) {
    setDeleteConfirmation({
      type: "project",
      item: project,
    });
  }


  function requestDeleteLabel(
    label
  ) {
    setDeleteConfirmation({
      type: "label",
      item: label,
    });
  }


  function closeDeleteConfirmation() {
    if (
      deletingTaskId ||
      deletingProjectId ||
      deletingLabelId
    ) {
      return;
    }

    setDeleteConfirmation(
      null
    );
  }


  async function deleteTaskConfirmed(
    task
  ) {
    setDeletingTaskId(
      task.id
    );

    setError("");


    try {
      await deleteTask(
        task.id
      );


      if (
        editingTask?.id ===
        task.id
      ) {
        setEditingTask(null);
        setShowTaskForm(
          false
        );
      }


      setDeleteConfirmation(
        null
      );


      if (
        tasks.length === 1 &&
        page > 1
      ) {
        setPage(
          (
            currentPage
          ) =>
            currentPage - 1
        );
      } else {
        await loadTasks();
      }
    } catch (
      requestError
    ) {
      await handleRequestError(
        requestError,
        setError
      );

      setDeleteConfirmation(
        null
      );
    } finally {
      setDeletingTaskId(
        null
      );
    }
  }


  async function deleteProjectConfirmed(
    project
  ) {
    setDeletingProjectId(
      project.id
    );

    setProjectsError("");


    try {
      await deleteProject(
        project.id
      );


      setProjects(
        (
          currentProjects
        ) =>
          currentProjects.filter(
            (
              currentProject
            ) =>
              currentProject.id !==
              project.id
          )
      );


      if (
        selectedProject?.id ===
        project.id
      ) {
        setSelectedProject(
          null
        );

        setActiveView(
          "today"
        );

        setPage(1);
        setTasks([]);
      }


      setDeleteConfirmation(
        null
      );
    } catch (
      requestError
    ) {
      await handleRequestError(
        requestError,
        setProjectsError
      );

      setDeleteConfirmation(
        null
      );
    } finally {
      setDeletingProjectId(
        null
      );
    }
  }


  async function deleteLabelConfirmed(
    label
  ) {
    setDeletingLabelId(
      label.id
    );

    setLabelsError("");


    try {
      await deleteLabel(
        label.id
      );


      setLabels(
        (
          currentLabels
        ) =>
          currentLabels.filter(
            (
              currentLabel
            ) =>
              currentLabel.id !==
              label.id
          )
      );


      if (
        selectedLabel?.id ===
        label.id
      ) {
        setSelectedLabel(
          null
        );

        setActiveView(
          "today"
        );

        setPage(1);
        setTasks([]);
      }


      setDeleteConfirmation(
        null
      );
    } catch (
      requestError
    ) {
      await handleRequestError(
        requestError,
        setLabelsError
      );

      setDeleteConfirmation(
        null
      );
    } finally {
      setDeletingLabelId(
        null
      );
    }
  }


  async function handleConfirmDelete() {
    if (
      !deleteConfirmation
    ) {
      return;
    }


    const {
      type,
      item,
    } = deleteConfirmation;


    if (
      type === "task"
    ) {
      await deleteTaskConfirmed(
        item
      );

      return;
    }


    if (
      type === "project"
    ) {
      await deleteProjectConfirmed(
        item
      );

      return;
    }


    if (
      type === "label"
    ) {
      await deleteLabelConfirmed(
        item
      );
    }
  }


  async function handleTaskSaved() {
    setShowTaskForm(
      false
    );

    setEditingTask(
      null
    );


    if (
      page !== 1
    ) {
      setPage(1);

      return;
    }


    await loadTasks();
  }


  async function handleProjectSaved(
    savedProject
  ) {
    setShowProjectForm(
      false
    );

    setEditingProject(
      null
    );


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
    setShowLabelForm(
      false
    );

    setEditingLabel(
      null
    );


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
      (
        currentFilters
      ) => ({
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
      nextPage >
        totalPages
    ) {
      return;
    }

    setPage(
      nextPage
    );
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


  function handleViewChange(
    view
  ) {
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
    setActiveView(
      "project"
    );

    setSearchQuery("");
    setSelectedProject(
      project
    );
    setSelectedLabel(null);
    setPage(1);

    closeAllForms();
  }


  function handleLabelSelect(
    label
  ) {
    setActiveView(
      "label"
    );

    setSearchQuery("");
    setSelectedLabel(
      label
    );
    setSelectedProject(null);
    setPage(1);

    closeAllForms();
  }


  function handleSearch(
    query
  ) {
    setSearchQuery(
      query
    );

    setActiveView(
      "search"
    );

    setSelectedProject(null);
    setSelectedLabel(null);
    setPage(1);

    closeAllForms();
  }


  function handleClearSearch() {
    setSearchQuery("");
    setActiveView(
      "today"
    );
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
    setEditingTask(
      task
    );

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
    setEditingProject(
      project
    );
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
    setEditingLabel(
      label
    );
    setEditingProject(null);

    setShowLabelForm(true);
    setShowTaskForm(false);
    setShowProjectForm(false);
  }


  function closeTaskModal() {
    setShowTaskForm(
      false
    );

    setEditingTask(
      null
    );
  }


  function closeProjectModal() {
    setShowProjectForm(
      false
    );

    setEditingProject(
      null
    );
  }


  function closeLabelModal() {
    setShowLabelForm(
      false
    );

    setEditingLabel(
      null
    );
  }


  function getPageTitle() {
    if (
      activeView ===
        "project" &&
      selectedProject
    ) {
      return (
        selectedProject.name
      );
    }


    if (
      activeView ===
        "label" &&
      selectedLabel
    ) {
      return (
        `#${selectedLabel.name}`
      );
    }


    if (
      activeView ===
      "search"
    ) {
      return (
        `Search: ${searchQuery}`
      );
    }


    if (
      activeView ===
      "inbox"
    ) {
      return "Inbox";
    }


    if (
      activeView ===
      "upcoming"
    ) {
      return "Upcoming";
    }


    if (
      activeView ===
      "completed"
    ) {
      return "Completed";
    }


    return "Today";
  }


  function getDeleteModalDetails() {
    if (
      !deleteConfirmation
    ) {
      return null;
    }


    const {
      type,
      item,
    } = deleteConfirmation;


    if (
      type === "task"
    ) {
      return {
        title:
          "Delete task?",

        message:
          `"${item.title}" will be permanently deleted.`,

        loading:
          deletingTaskId ===
          item.id,
      };
    }


    if (
      type === "project"
    ) {
      return {
        title:
          "Delete project?",

        message:
          `"${item.name}" and all tasks inside it will be permanently deleted.`,

        loading:
          deletingProjectId ===
          item.id,
      };
    }


    return {
      title:
        "Delete label?",

      message:
        `#${item.name} will be permanently deleted. Tasks using this label will not be deleted.`,

      loading:
        deletingLabelId ===
        item.id,
    };
  }


  const deleteModalDetails =
    getDeleteModalDetails();


  const isAnyFormOpen =
    showTaskForm ||
    showProjectForm ||
    showLabelForm;


  const canCreateTask =
    !isAnyFormOpen &&
    activeView !==
      "completed" &&
    activeView !==
      "search";


  return (
    <main className="dashboard-page">
      <div className="dashboard-layout">

        {isSidebarOpen && (
          <button
            type="button"
            className="dashboard-sidebar-overlay"
            onClick={() =>
              setIsSidebarOpen(
                false
              )
            }
            aria-label="Close sidebar"
          />
        )}


        <Sidebar
          isOpen={
            isSidebarOpen
          }
          onClose={() =>
            setIsSidebarOpen(
              false
            )
          }
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
            requestDeleteProject
          }
          onAddLabel={
            handleAddLabel
          }
          onEditLabel={
            handleEditLabel
          }
          onDeleteLabel={
            requestDeleteLabel
          }
          onLogout={
            handleLogout
          }
        />


        <section className="dashboard-main">
          <div className="dashboard-content">

            <header className="dashboard-header">
              <div className="dashboard-header-left">
                <button
                  type="button"
                  className="dashboard-mobile-menu"
                  onClick={() =>
                    setIsSidebarOpen(
                      true
                    )
                  }
                  aria-label="Open sidebar"
                >
                  ☰
                </button>

                <h1 className="dashboard-title">
                  {getPageTitle()}
                </h1>
              </div>


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
              activeView={
                activeView
              }
              onRetry={
                loadTasks
              }
              onToggleStatus={
                handleToggleTaskStatus
              }
              onEditTask={
                handleEditTask
              }
              onDeleteTask={
                requestDeleteTask
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
                      ?.id ??
                    null
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
            />
          </Modal>
        )}


        {deleteConfirmation &&
          deleteModalDetails && (
            <ConfirmModal
              title={
                deleteModalDetails
                  .title
              }
              message={
                deleteModalDetails
                  .message
              }
              loading={
                deleteModalDetails
                  .loading
              }
              onConfirm={
                handleConfirmDelete
              }
              onCancel={
                closeDeleteConfirmation
              }
            />
          )}

      </div>
    </main>
  );
}


export default DashboardPage;