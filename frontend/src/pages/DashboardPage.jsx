import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Sidebar from "../components/layouts/Sidebar.jsx";
import TaskForm from "../components/layouts/TaskForm.jsx";
import TaskList from "../components/layouts/TaskList.jsx";

function DashboardPage() {
  const navigate = useNavigate();

  const [activeView, setActiveView] =
    useState("today");

  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  function handleLogout() {
    localStorage.removeItem("access_token");

    navigate("/login", {
      replace: true,
    });
  }

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

  const getTasksEndpoint = useCallback(() => {
    if (activeView === "inbox") {
      return "http://127.0.0.1:8000/tasks/inbox";
    }

    if (activeView === "upcoming") {
      return "http://127.0.0.1:8000/dashboard/upcoming";
    }

    return "http://127.0.0.1:8000/dashboard/today";
  }, [activeView]);

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

      setTasks(data);
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
    getTasksEndpoint,
    handleUnauthorized,
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

  function handleViewChange(view) {
    setActiveView(view);
    setShowTaskForm(false);
  }

  function getPageTitle() {
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
        onViewChange={handleViewChange}
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

        {showTaskForm && (
          <TaskForm
            onTaskCreated={
              handleTaskCreated
            }
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
          updatingTaskId={
            updatingTaskId
          }
        />
      </section>
    </main>
  );
}

export default DashboardPage;