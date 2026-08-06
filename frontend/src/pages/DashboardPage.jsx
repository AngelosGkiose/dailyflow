import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router";

import LabelForm from "../components/layouts/LabelForm.jsx";
import ProjectForm from "../components/layouts/ProjectForm.jsx";
import Sidebar from "../components/layouts/Sidebar.jsx";
import TaskForm from "../components/layouts/TaskForm.jsx";
import TaskList from "../components/layouts/TaskList.jsx";

function DashboardPage() {
  const navigate = useNavigate();

  const [activeView, setActiveView] =
    useState("today");

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [selectedLabel, setSelectedLabel] =
    useState(null);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [labels, setLabels] = useState([]);

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [showLabelForm, setShowLabelForm] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [projectsLoading, setProjectsLoading] =
    useState(true);

  const [labelsLoading, setLabelsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [projectsError, setProjectsError] =
    useState("");

  const [labelsError, setLabelsError] =
    useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  function getAccessToken() {
    return localStorage.getItem(
      "access_token"
    );
  }

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("access_token");

    navigate("/login", {
      replace: true,
    });
  }, [navigate]);

  function handleLogout() {
    handleUnauthorized();
  }

  const getTasksEndpoint = useCallback(() => {
    if (
      activeView === "project" &&
      selectedProject
    ) {
      return (
        "http://127.0.0.1:8000/tasks/" +
        `?project_id=${selectedProject.id}`
      );
    }

    if (
      activeView === "label" &&
      selectedLabel
    ) {
      return (
        "http://127.0.0.1:8000/tasks/" +
        `?label_id=${selectedLabel.id}`
      );
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
  ]);

  const loadTasks = useCallback(async () => {
    const accessToken = getAccessToken();

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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Could not load tasks"
        );
      }

      if (
        activeView === "project" ||
        activeView === "label"
      ) {
        setTasks(
          Array.isArray(data.items)
            ? data.items
            : []
        );
      } else {
        setTasks(
          Array.isArray(data)
            ? data
            : []
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [
    activeView,
    getTasksEndpoint,
    handleUnauthorized,
  ]);

  const loadProjects = useCallback(async () => {
    const accessToken = getAccessToken();

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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
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

  const loadLabels = useCallback(async () => {
    const accessToken = getAccessToken();

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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
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

  async function handleToggleTaskStatus(task) {
    const accessToken = getAccessToken();

    if (!accessToken) {
      handleUnauthorized();
      return;
    }

    const action =
      task.status === "completed"
        ? "reopen"
        : "complete";

    const endpoint =
      `http://127.0.0.1:8000/tasks/${task.id}/${action}`;

    setUpdatingTaskId(task.id);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const updatedTask =
        await response.json();

      if (!response.ok) {
        throw new Error(
          typeof updatedTask.detail === "string"
            ? updatedTask.detail
            : "Could not update task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks
          .map((currentTask) =>
            currentTask.id === updatedTask.id
              ? updatedTask
              : currentTask
          )
          .filter(
            (currentTask) =>
              currentTask.status === "pending"
          )
      );
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

  async function handleTaskCreated() {
    setShowTaskForm(false);

    await loadTasks();
  }

  async function handleProjectCreated() {
    setShowProjectForm(false);

    await loadProjects();
  }

  async function handleLabelCreated() {
    setShowLabelForm(false);

    await loadLabels();
  }

  function closeAllForms() {
    setShowTaskForm(false);
    setShowProjectForm(false);
    setShowLabelForm(false);
  }

  function handleViewChange(view) {
    setActiveView(view);
    setSelectedProject(null);
    setSelectedLabel(null);

    closeAllForms();
  }

  function handleProjectSelect(project) {
    setActiveView("project");
    setSelectedProject(project);
    setSelectedLabel(null);

    closeAllForms();
  }

  function handleLabelSelect(label) {
    setActiveView("label");
    setSelectedLabel(label);
    setSelectedProject(null);

    closeAllForms();
  }

  function handleAddTask() {
    setShowTaskForm(true);
    setShowProjectForm(false);
    setShowLabelForm(false);
  }

  function handleAddProject() {
    setShowProjectForm(true);
    setShowTaskForm(false);
    setShowLabelForm(false);
  }

  function handleAddLabel() {
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

    if (activeView === "inbox") {
      return "Inbox";
    }

    if (activeView === "upcoming") {
      return "Upcoming";
    }

    return "Today";
  }

  const isAnyFormOpen =
    showTaskForm ||
    showProjectForm ||
    showLabelForm;

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
        projects={projects}
        labels={labels}
        projectsLoading={projectsLoading}
        labelsLoading={labelsLoading}
        onViewChange={handleViewChange}
        onProjectSelect={handleProjectSelect}
        onLabelSelect={handleLabelSelect}
        onAddProject={handleAddProject}
        onAddLabel={handleAddLabel}
        onLogout={handleLogout}
      />

      <section>
        <header>
          <h1>{getPageTitle()}</h1>

          {!isAnyFormOpen && (
            <button
              type="button"
              onClick={handleAddTask}
            >
              + Add task
            </button>
          )}
        </header>

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
            onProjectCreated={
              handleProjectCreated
            }
            onCancel={() =>
              setShowProjectForm(false)
            }
            onUnauthorized={
              handleUnauthorized
            }
          />
        )}

        {showLabelForm && (
          <LabelForm
            onLabelCreated={
              handleLabelCreated
            }
            onCancel={() =>
              setShowLabelForm(false)
            }
            onUnauthorized={
              handleUnauthorized
            }
          />
        )}

        {showTaskForm && (
          <TaskForm
            projects={projects}
            labels={labels}
            defaultProjectId={
              activeView === "project"
                ? selectedProject?.id ?? null
                : null
            }
            defaultToToday={
              activeView === "today"
            }
            onTaskCreated={
              handleTaskCreated
            }
            onCancel={() =>
              setShowTaskForm(false)
            }
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
          updatingTaskId={
            updatingTaskId
          }
        />
      </section>
    </main>
  );
}

export default DashboardPage;