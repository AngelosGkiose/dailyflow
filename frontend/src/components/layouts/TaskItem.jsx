function formatDueDate(dueDate) {
  if (!dueDate) {
    return null;
  }

  const date = new Date(dueDate);

  return date.toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function TaskItem({
  task,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  updatingTaskId,
  deletingTaskId,
}) {
  const isCompleted =
    task.status === "completed";

  const isUpdating =
    updatingTaskId === task.id;

  const isDeleting =
    deletingTaskId === task.id;

  const isBusy =
    isUpdating || isDeleting;

  const formattedDueDate =
    formatDueDate(task.due_date);

  return (
    <li
      className={
        isCompleted
          ? "task-row task-row-completed"
          : "task-row"
      }
    >
      <button
        type="button"
        className={
          `task-complete-button ` +
          `task-priority-${task.priority}`
        }
        onClick={() =>
          onToggleStatus(task)
        }
        disabled={isBusy}
        aria-label={
          isCompleted
            ? `Reopen ${task.title}`
            : `Complete ${task.title}`
        }
      >
        {isUpdating
          ? "..."
          : isCompleted
            ? "✓"
            : ""}
      </button>

      <div className="task-content">
        <div className="task-main-row">
          <div className="task-text">
            <h3 className="task-title">
              {task.title}
            </h3>

            {task.description && (
              <p className="task-description">
                {task.description}
              </p>
            )}
          </div>

          <div className="task-actions">
            <button
              type="button"
              className="task-action-button"
              onClick={() =>
                onEditTask(task)
              }
              disabled={isBusy}
            >
              Edit
            </button>

            <button
              type="button"
              className="task-action-button task-delete-button"
              onClick={() =>
                onDeleteTask(task)
              }
              disabled={isBusy}
            >
              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>

        <div className="task-meta">
          {formattedDueDate && (
            <span className="task-due-date">
              {formattedDueDate}
            </span>
          )}

          <span
            className={
              `task-priority-badge ` +
              `priority-${task.priority}`
            }
          >
            {task.priority}
          </span>

          {task.labels?.map((label) => (
            <span
              key={label.id}
              className="task-label-badge"
            >
              #{label.name}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}


export default TaskItem;