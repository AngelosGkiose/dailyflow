import TaskItem from "./TaskItem.jsx";

function TaskList({
  tasks,
  loading,
  error,
  onToggleStatus,
  updatingTaskId,
}) {
  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          updatingTaskId={updatingTaskId}
        />
      ))}
    </ul>
  );
}

export default TaskList;