import TaskItem from "./TaskItem.jsx";

import "../../styles/tasks.css";


function getEmptyState(
  activeView
) {
  if (
    activeView ===
    "today"
  ) {
    return {
      title:
        "No tasks due today",

      message:
        "You're all caught up for today.",

      icon:
        "✓",
    };
  }


  if (
    activeView ===
    "inbox"
  ) {
    return {
      title:
        "Your inbox is empty",

      message:
        "Tasks without a project will appear here.",

      icon:
        "▣",
    };
  }


  if (
    activeView ===
    "upcoming"
  ) {
    return {
      title:
        "Nothing upcoming",

      message:
        "Tasks with future due dates will appear here.",

      icon:
        "→",
    };
  }


  if (
    activeView ===
    "completed"
  ) {
    return {
      title:
        "No completed tasks yet",

      message:
        "Completed tasks will appear here.",

      icon:
        "✓",
    };
  }


  if (
    activeView ===
    "project"
  ) {
    return {
      title:
        "No tasks in this project",

      message:
        "Add a task to start working on this project.",

      icon:
        "●",
    };
  }


  if (
    activeView ===
    "label"
  ) {
    return {
      title:
        "No tasks with this label",

      message:
        "Tasks assigned to this label will appear here.",

      icon:
        "#",
    };
  }


  if (
    activeView ===
    "search"
  ) {
    return {
      title:
        "No tasks found",

      message:
        "Try searching for another task or keyword.",

      icon:
        "⌕",
    };
  }


  return {
    title:
      "No tasks here",

    message:
      "There are no tasks in this view.",

    icon:
      "✓",
  };
}


function TaskList({
  tasks,
  loading,
  error,
  activeView,
  onRetry,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  updatingTaskId,
  deletingTaskId,
}) {
  if (loading) {
    return (
      <div
        className="task-loading-state"
        role="status"
        aria-live="polite"
      >
        <div
          className="task-loading-spinner"
          aria-hidden="true"
        />

        <div>
          <strong>
            Loading tasks
          </strong>

          <p>
            Getting your tasks ready...
          </p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div
        className="task-error-state"
        role="alert"
      >
        <div
          className="task-error-icon"
          aria-hidden="true"
        >
          !
        </div>

        <h2>
          Could not load tasks
        </h2>

        <p>
          {error}
        </p>

        <button
          type="button"
          className="button button-danger-outline"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    );
  }


  if (
    tasks.length === 0
  ) {
    const emptyState =
      getEmptyState(
        activeView
      );

    return (
      <div className="task-empty-state">
        <div
          className="task-empty-icon"
          aria-hidden="true"
        >
          {emptyState.icon}
        </div>

        <h2>
          {emptyState.title}
        </h2>

        <p>
          {emptyState.message}
        </p>
      </div>
    );
  }


  return (
    <ul className="task-list">
      {tasks.map(
        (task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleStatus={
              onToggleStatus
            }
            onEditTask={
              onEditTask
            }
            onDeleteTask={
              onDeleteTask
            }
            updatingTaskId={
              updatingTaskId
            }
            deletingTaskId={
              deletingTaskId
            }
          />
        )
      )}
    </ul>
  );
}


export default TaskList;