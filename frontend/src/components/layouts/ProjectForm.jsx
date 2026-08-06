import {
  useEffect,
  useState,
} from "react";

import {
  createProject,
  updateProject,
} from "../../api/projectsApi.js";


function ProjectForm({
  project = null,
  onProjectSaved,
  onCancel,
  onUnauthorized,
}) {
  const isEditing =
    project !== null;

  const [formData, setFormData] =
    useState({
      name: project?.name ?? "",
      description:
        project?.description ?? "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    setFormData({
      name: project?.name ?? "",
      description:
        project?.description ?? "",
    });

    setError("");
  }, [project]);


  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData(
      (currentFormData) => ({
        ...currentFormData,
        [name]: value,
      })
    );
  }


  async function handleSubmit(event) {
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
      name: projectName,

      description:
        formData.description.trim() ||
        null,
    };

    setLoading(true);
    setError("");

    try {
      const savedProject =
        isEditing
          ? await updateProject(
              project.id,
              projectData,
              onUnauthorized
            )
          : await createProject(
              projectData,
              onUnauthorized
            );

      setFormData({
        name: "",
        description: "",
      });

      onProjectSaved(
        savedProject
      );
    } catch (requestError) {
      if (requestError.status === 401) {
        return;
      }

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