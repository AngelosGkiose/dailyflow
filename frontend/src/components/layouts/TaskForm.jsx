import { useState } from "react";

function TaskForm({
  onTaskCreated,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const accessToken = localStorage.getItem(
      "access_token"
    );

    if (!accessToken) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);
    setError("");

    const requestData = {
      title: formData.title.trim(),
      description:
        formData.description.trim() || null,
      priority: formData.priority,
      due_date: formData.due_date
        ? new Date(formData.due_date).toISOString()
        : null,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/tasks/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Could not create task"
        );
      }

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
      });

      onTaskCreated(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add task</h2>

      <div>
        <label htmlFor="task-title">
          Title
        </label>

        <input
          id="task-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          minLength={1}
          maxLength={100}
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="task-description">
          Description
        </label>

        <textarea
          id="task-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="task-priority">
          Priority
        </label>

        <select
          id="task-priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="low">
            Low
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="high">
            High
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="task-due-date">
          Due date
        </label>

        <input
          id="task-due-date"
          name="due_date"
          type="datetime-local"
          value={formData.due_date}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      {error && (
        <div role="alert">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating task..."
            : "Add task"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;