import { useState } from "react";

function LabelForm({
  onLabelCreated,
  onCancel,
  onUnauthorized,
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const accessToken = localStorage.getItem(
      "access_token"
    );

    if (!accessToken) {
      onUnauthorized();
      return;
    }

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("Label name cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/labels/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Could not create label"
        );
      }

      setName("");
      onLabelCreated(data);
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
      <h2>Create label</h2>

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
          disabled={loading}
          placeholder="For example: urgent"
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
            ? "Creating label..."
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