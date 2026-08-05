import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";

import Sidebar from "../components/layouts/Sidebar.jsx";
import TaskForm from "../components/layouts/TaskForm.jsx";
import TaskList from "../components/layouts/TaskList.jsx";

function DashboardPage() {
  const navigate = useNavigate();

  const [activeView, setActiveView] =
    useState("today");

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [projectsError, setProjectsError] =
    useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  function getAccessToken() {
    return localStorage.getItem("access_token");
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

    if (activeView === "inbox") {
      return "http://127.0.0.1:8000/tasks/inbox";
    }

    if (activeView === "upcoming") {
      return "http://127.0.0.1:8000/dashboard/upcoming";
    }

    return "http://127.0.0.1:8000/dashboard/today";
  }, [activeView, selectedProject]);

  const loadTasks = useCallback(async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      handleUnauthorized();
      return;
    }

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

      if (activeView === "project") {
        setTasks(data.items);
      } else {
        setTasks(data);
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

      setProjects(data);
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

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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

      const updatedTask = await response.json();

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

  function handleViewChange(view) {
    setActiveView(view);
    setSelectedProject(null);
    setShowTaskForm(false);
  }

  function handleProjectSelect(project) {
    setActiveView("project");
    setSelectedProject(project);
    setShowTaskForm(false);
  }

  function getPageTitle() {
    if (
      activeView === "project" &&
      selectedProject
    ) {
      return selectedProject.name;
    }

    if (activeView === "inbox") {
      return "Inbox";
    }

    if (activeView === "upcoming") {
      return "Upcoming";
    }

    return "Today";
  }

  return (
    <main>
      <Sidebar
        activeView={activeView}
        selectedProjectId={
          selectedProject?.id ?? null
        }
        projects={projects}
        projectsLoading={projectsLoading}
        onViewChange={handleViewChange}
        onProjectSelect={handleProjectSelect}
        onLogout={handleLogout}
      />

      <section>
        <header>
          <h1>{getPageTitle()}</h1>

          {!showTaskForm && (
            <button
              type="button"
              onClick={() =>
                setShowTaskForm(true)
              }
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

        {showTaskForm && (
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onCancel={() =>
              setShowTaskForm(false)
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
          updatingTaskId={updatingTaskId}
        />
      </section>
    </main>
  );
}

export default DashboardPage;