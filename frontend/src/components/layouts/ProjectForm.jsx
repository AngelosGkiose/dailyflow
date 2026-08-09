import {
  useEffect,
  useState,
} from "react";

import {
  createProject,
  updateProject,
} from "../../api/projectsApi.js";

import "../../styles/entity-form.css";

function ProjectForm({
  project = null,
  onProjectSaved,
  onCancel,
}) {
  const isEditing =
    project !== null;

  const [
    formData,
    setFormData,
  ] = useState({
    name:
      project?.name ?? "",

    description:
      project?.description ?? "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    setFormData({
      name:
        project?.name ?? "",

      description:
        project?.description ?? "",
    });

    setError("");
  }, [
    project,
  ]);

  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (
        currentFormData
      ) => ({
        ...currentFormData,
        [name]: value,
      })
    );
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    const projectName =
      formData.name.trim();

    if (!projectName) {
      setError(
        "Project name cannot be empty."
      );

      return;
    }

    const projectData = {
      name:
        projectName,

      description:
        formData.description
          .trim() ||
        null,
    };

    setLoading(true);
    setError("");

    try {
      const savedProject =
        isEditing
          ? await updateProject(
              project.id,
              projectData
            )
          : await createProject(
              projectData
            );

      onProjectSaved(
        savedProject
      );
    } catch (
      requestError
    ) {
      setError(
        requestError instanceof
        Error
          ? requestError.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="entity-form"
      onSubmit={handleSubmit}
    >
      <div className="entity-form-header">
        <div>
          <h2>
            {isEditing
              ? "Edit project"
              : "Create project"}
          </h2>

          <p>
            {isEditing
              ? "Update your project details."
              : "Create a space for related tasks."}
          </p>
        </div>

        <button
          type="button"
          className="entity-form-close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close project form"
        >
          ×
        </button>
      </div>

      <div className="entity-form-body">
        <div className="entity-form-field">
          <label htmlFor="project-name">
            Project name
          </label>

          <input
            id="project-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. University"
            minLength={1}
            maxLength={100}
            disabled={loading}
            autoFocus
            required
          />
        </div>

        <div className="entity-form-field">
          <label htmlFor="project-description">
            Description
          </label>

          <textarea
            id="project-description"
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            placeholder="Optional description..."
            maxLength={500}
            rows={4}
            disabled={loading}
          />
        </div>

        {error && (
          <div
            className="entity-form-error"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      <div className="entity-form-footer">
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="button button-primary"
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save changes"
              : "Create project"}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;