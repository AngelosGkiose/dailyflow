import TaskItem from "./TaskItem.jsx";

import "../../styles/tasks.css";


function TaskList({
  tasks,
  loading,
  error,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  updatingTaskId,
  deletingTaskId,
}) {
  if (loading) {
    return (
      <div className="task-state">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="task-state task-state-error"
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-empty-state">
        <div className="task-empty-icon">
          ✓
        </div>

        <h2>No tasks here</h2>

        <p>
          You&apos;re all caught up.
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
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
      ))}
    </ul>
  );
}


export default TaskList;