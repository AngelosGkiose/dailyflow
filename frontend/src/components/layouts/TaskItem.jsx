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

  return (
    <li>
      <div>
        <button
          type="button"
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
              : "○"}
        </button>

        <div>
          <h3>{task.title}</h3>

          {task.description && (
            <p>{task.description}</p>
          )}

          <div>
            <span>
              Status: {task.status}
            </span>

            <span>
              {" "}
              Priority: {task.priority}
            </span>

            {task.due_date && (
              <span>
                {" "}
                Due:{" "}
                {new Date(
                  task.due_date
                ).toLocaleString()}
              </span>
            )}
          </div>

          {task.labels?.length > 0 && (
            <div>
              {task.labels.map((label) => (
                <span key={label.id}>
                  #{label.name}{" "}
                </span>
              ))}
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={() =>
                onEditTask(task)
              }
              disabled={isBusy}
            >
              Edit
            </button>

            <button
              type="button"
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
      </div>
    </li>
  );
}

export default TaskItem;