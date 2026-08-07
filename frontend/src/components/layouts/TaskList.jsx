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
      <div className="task-loading-state">
        <div className="task-loading-spinner" />

        <p>
          Loading tasks...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div
        className="task-state task-state-error"
        role="alert"
      >
        <strong>
          Could not load tasks
        </strong>

        <p>
          {error}
        </p>
      </div>
    );
  }


  if (tasks.length === 0) {
    return (
      <div className="task-empty-state">
        <div className="task-empty-icon">
          ✓
        </div>

        <h2>
          Nothing here
        </h2>

        <p>
          There are no tasks in this view.
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