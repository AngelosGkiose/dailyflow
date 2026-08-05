import { useEffect, useState } from "react";

function TaskForm({
  projects,
  labels,
  defaultProjectId,
  onTaskCreated,
  onCancel,
  onUnauthorized,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    project_id:
      defaultProjectId !== null &&
      defaultProjectId !== undefined
        ? String(defaultProjectId)
        : "",
    label_ids: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      project_id:
        defaultProjectId !== null &&
        defaultProjectId !== undefined
          ? String(defaultProjectId)
          : "",
    }));
  }, [defaultProjectId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleLabelChange(event) {
    const labelId = Number(event.target.value);
    const isChecked = event.target.checked;

    setFormData((currentFormData) => ({
      ...currentFormData,
      label_ids: isChecked
        ? [...currentFormData.label_ids, labelId]
        : currentFormData.label_ids.filter(
            (currentLabelId) =>
              currentLabelId !== labelId
          ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const accessToken =
      localStorage.getItem("access_token");

    if (!accessToken) {
      onUnauthorized();
      return;
    }

    const title = formData.title.trim();

    if (!title) {
      setError("Task title cannot be empty.");
      return;
    }

    const requestData = {
      title,
      description:
        formData.description.trim() || null,
      priority: formData.priority,
      due_date: formData.due_date
        ? new Date(formData.due_date).toISOString()
        : null,
      project_id: formData.project_id
        ? Number(formData.project_id)
        : null,
    };

    setLoading(true);
    setError("");

    try {
      const taskResponse = await fetch(
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

      if (taskResponse.status === 401) {
        onUnauthorized();
        return;
      }

      const createdTask =
        await taskResponse.json();

      if (!taskResponse.ok) {
        throw new Error(
          typeof createdTask.detail === "string"
            ? createdTask.detail
            : "Could not create task"
        );
      }

      for (const labelId of formData.label_ids) {
        const labelResponse = await fetch(
          `http://127.0.0.1:8000/tasks/${createdTask.id}/labels/${labelId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (labelResponse.status === 401) {
          onUnauthorized();
          return;
        }

        if (!labelResponse.ok) {
          const labelError =
            await labelResponse.json();

          throw new Error(
            typeof labelError.detail === "string"
              ? labelError.detail
              : "Task was created, but a label could not be assigned"
          );
        }
      }

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        project_id:
          defaultProjectId !== null &&
          defaultProjectId !== undefined
            ? String(defaultProjectId)
            : "",
        label_ids: [],
      });

      onTaskCreated();
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
          <option value="low">Low</option>
          <option value="medium">
            Medium
          </option>
          <option value="high">High</option>
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

      <div>
        <label htmlFor="task-project">
          Project
        </label>

        <select
          id="task-project"
          name="project_id"
          value={formData.project_id}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">
            No project — Inbox
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={String(project.id)}
            >
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend>Labels</legend>

        {labels.length === 0 ? (
          <p>No labels available.</p>
        ) : (
          labels.map((label) => (
            <label key={label.id}>
              <input
                type="checkbox"
                value={label.id}
                checked={formData.label_ids.includes(
                  label.id
                )}
                onChange={handleLabelChange}
                disabled={loading}
              />

              #{label.name}
            </label>
          ))
        )}
      </fieldset>

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