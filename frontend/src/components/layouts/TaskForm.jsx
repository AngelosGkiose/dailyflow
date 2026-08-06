import { useEffect, useState } from "react";

function getCurrentLocalDateTime() {
  const now = new Date();

  const timezoneOffset =
    now.getTimezoneOffset() * 60 * 1000;

  return new Date(
    now.getTime() - timezoneOffset
  )
    .toISOString()
    .slice(0, 16);
}

function formatDateTimeLocal(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  const timezoneOffset =
    date.getTimezoneOffset() * 60 * 1000;

  return new Date(
    date.getTime() - timezoneOffset
  )
    .toISOString()
    .slice(0, 16);
}

function TaskForm({
  task = null,
  projects,
  labels,
  defaultProjectId,
  defaultToToday,
  onTaskSaved,
  onCancel,
  onUnauthorized,
}) {
  const isEditing = task !== null;

  const [formData, setFormData] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "medium",

    due_date: task
      ? formatDateTimeLocal(task.due_date)
      : defaultToToday
        ? getCurrentLocalDateTime()
        : "",

    project_id:
      task?.project_id !== null &&
      task?.project_id !== undefined
        ? String(task.project_id)
        : defaultProjectId !== null &&
            defaultProjectId !== undefined
          ? String(defaultProjectId)
          : "",

    label_ids:
      task?.labels?.map((label) => label.id) ?? [],
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    setFormData({
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",

      due_date: task
        ? formatDateTimeLocal(task.due_date)
        : defaultToToday
          ? getCurrentLocalDateTime()
          : "",

      project_id:
        task?.project_id !== null &&
        task?.project_id !== undefined
          ? String(task.project_id)
          : defaultProjectId !== null &&
              defaultProjectId !== undefined
            ? String(defaultProjectId)
            : "",

      label_ids:
        task?.labels?.map((label) => label.id) ?? [],
    });

    setError("");
  }, [
    task,
    defaultProjectId,
    defaultToToday,
  ]);

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
        ? [
            ...currentFormData.label_ids,
            labelId,
          ]
        : currentFormData.label_ids.filter(
            (currentLabelId) =>
              currentLabelId !== labelId
          ),
    }));
  }

  async function updateTaskLabels(
    accessToken,
    taskId,
    originalLabelIds,
    selectedLabelIds
  ) {
    const labelsToAdd = selectedLabelIds.filter(
      (labelId) =>
        !originalLabelIds.includes(labelId)
    );

    const labelsToRemove =
      originalLabelIds.filter(
        (labelId) =>
          !selectedLabelIds.includes(labelId)
      );

    for (const labelId of labelsToAdd) {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${taskId}/labels/${labelId}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        onUnauthorized();
        throw new Error(
          "Authentication required"
        );
      }

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Could not add label to task"
        );
      }
    }

    for (const labelId of labelsToRemove) {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${taskId}/labels/${labelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        onUnauthorized();
        throw new Error(
          "Authentication required"
        );
      }

      if (!response.ok) {
        let errorMessage =
          "Could not remove label from task";

        try {
          const data = await response.json();

          if (
            typeof data.detail === "string"
          ) {
            errorMessage = data.detail;
          }
        } catch {
          // Το 204 response δεν έχει body.
        }

        throw new Error(errorMessage);
      }
    }
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
      setError(
        "Task title cannot be empty."
      );
      return;
    }

    const requestData = {
      title,

      description:
        formData.description.trim() || null,

      priority: formData.priority,

      due_date: formData.due_date
        ? new Date(
            formData.due_date
          ).toISOString()
        : null,

      project_id: formData.project_id
        ? Number(formData.project_id)
        : null,
    };

    const endpoint = isEditing
      ? `http://127.0.0.1:8000/tasks/${task.id}`
      : "http://127.0.0.1:8000/tasks/";

    const method = isEditing
      ? "PATCH"
      : "POST";

    setLoading(true);
    setError("");

    try {
      const taskResponse = await fetch(
        endpoint,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${accessToken}`,
          },

          body: JSON.stringify(requestData),
        }
      );

      if (taskResponse.status === 401) {
        onUnauthorized();
        return;
      }

      const savedTask =
        await taskResponse.json();

      if (!taskResponse.ok) {
        throw new Error(
          typeof savedTask.detail === "string"
            ? savedTask.detail
            : isEditing
              ? "Could not update task"
              : "Could not create task"
        );
      }

      const originalLabelIds = isEditing
        ? task.labels?.map(
            (label) => label.id
          ) ?? []
        : [];

      await updateTaskLabels(
        accessToken,
        savedTask.id,
        originalLabelIds,
        formData.label_ids
      );

      setFormData({
        title: "",
        description: "",
        priority: "medium",

        due_date: defaultToToday
          ? getCurrentLocalDateTime()
          : "",

        project_id:
          defaultProjectId !== null &&
          defaultProjectId !== undefined
            ? String(defaultProjectId)
            : "",

        label_ids: [],
      });

      onTaskSaved(savedTask);
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
      <h2>
        {isEditing
          ? "Edit task"
          : "Add task"}
      </h2>

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
            ? isEditing
              ? "Saving changes..."
              : "Creating task..."
            : isEditing
              ? "Save changes"
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