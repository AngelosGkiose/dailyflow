import { useEffect, useState } from "react";

function ProjectForm({
  project = null,
  onProjectSaved,
  onCancel,
  onUnauthorized,
}) {
  const isEditing = project !== null;

  const [formData, setFormData] = useState({
    name: project?.name ?? "",
    description: project?.description ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      name: project?.name ?? "",
      description: project?.description ?? "",
    });

    setError("");
  }, [project]);

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
      onUnauthorized();
      return;
    }

    const projectName = formData.name.trim();

    if (!projectName) {
      setError("Project name cannot be empty.");
      return;
    }

    const requestData = {
      name: projectName,
      description:
        formData.description.trim() || null,
    };

    const endpoint = isEditing
      ? `http://127.0.0.1:8000/projects/${project.id}`
      : "http://127.0.0.1:8000/projects/";

    const method = isEditing
      ? "PATCH"
      : "POST";

    setLoading(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : isEditing
              ? "Could not update project"
              : "Could not create project"
        );
      }

      setFormData({
        name: "",
        description: "",
      });

      onProjectSaved(data);
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
          ? "Edit project"
          : "Create project"}
      </h2>

      <div>
        <label htmlFor="project-name">
          Project name
        </label>

        <input
          id="project-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          minLength={1}
          maxLength={100}
          placeholder="For example: University"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="project-description">
          Description
        </label>

        <textarea
          id="project-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          placeholder="Optional project description"
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
            ? isEditing
              ? "Saving changes..."
              : "Creating project..."
            : isEditing
              ? "Save changes"
              : "Create project"}
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

export default ProjectForm;