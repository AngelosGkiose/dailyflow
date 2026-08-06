import {
  useEffect,
  useState,
} from "react";

import {
  createLabel,
  updateLabel,
} from "../../api/labelsApi.js";


function LabelForm({
  label = null,
  onLabelSaved,
  onCancel,
  onUnauthorized,
}) {
  const isEditing =
    label !== null;

  const [name, setName] =
    useState(
      label?.name ?? ""
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    setName(
      label?.name ?? ""
    );

    setError("");
  }, [label]);


  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedName =
      name.trim().toLowerCase();

    if (!normalizedName) {
      setError(
        "Label name cannot be empty."
      );

      return;
    }

    const labelData = {
      name: normalizedName,
    };

    setLoading(true);
    setError("");

    try {
      const savedLabel =
        isEditing
          ? await updateLabel(
              label.id,
              labelData,
              onUnauthorized
            )
          : await createLabel(
              labelData,
              onUnauthorized
            );

      setName("");

      onLabelSaved(savedLabel);
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
          ? "Edit label"
          : "Create label"}
      </h2>

      <div>
        <label htmlFor="label-name">
          Label name
        </label>

        <input
          id="label-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          minLength={1}
          maxLength={50}
          placeholder="For example: urgent"
          disabled={loading}
          required
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
              : "Creating label..."
            : isEditing
              ? "Save changes"
              : "Create label"}
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


export default LabelForm;