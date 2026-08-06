import { useEffect, useState } from "react";

function LabelForm({
  label = null,
  onLabelSaved,
  onCancel,
  onUnauthorized,
}) {
  const isEditing = label !== null;

  const [name, setName] = useState(
    label?.name ?? ""
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    setName(label?.name ?? "");
    setError("");
  }, [label]);

  async function handleSubmit(event) {
    event.preventDefault();

    const accessToken =
      localStorage.getItem("access_token");

    if (!accessToken) {
      onUnauthorized();
      return;
    }

    const normalizedName =
      name.trim().toLowerCase();

    if (!normalizedName) {
      setError(
        "Label name cannot be empty."
      );
      return;
    }

    const endpoint = isEditing
      ? `http://127.0.0.1:8000/labels/${label.id}`
      : "http://127.0.0.1:8000/labels/";

    const method = isEditing
      ? "PATCH"
      : "POST";

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        endpoint,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: normalizedName,
          }),
        }
      );

      if (response.status === 401) {
        onUnauthorized();
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : isEditing
              ? "Could not update label"
              : "Could not create label"
        );
      }

      setName("");
      onLabelSaved(data);
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