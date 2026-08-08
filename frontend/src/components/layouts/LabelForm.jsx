import {
  useEffect,
  useState,
} from "react";

import {
  createLabel,
  updateLabel,
} from "../../api/labelsApi.js";

import "../../styles/entity-form.css";


function LabelForm({
  label = null,
  onLabelSaved,
  onCancel,
}) {
  const isEditing =
    label !== null;


  const [
    name,
    setName,
  ] = useState(
    label?.name ?? ""
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    setName(
      label?.name ?? ""
    );

    setError("");
  }, [
    label,
  ]);


  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    const normalizedName =
      name
        .trim()
        .toLowerCase();


    if (!normalizedName) {
      setError(
        "Label name cannot be empty."
      );

      return;
    }


    const labelData = {
      name:
        normalizedName,
    };


    setLoading(true);
    setError("");


    try {
      const savedLabel =
        isEditing
          ? await updateLabel(
              label.id,
              labelData
            )
          : await createLabel(
              labelData
            );


      onLabelSaved(
        savedLabel
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
      onSubmit={
        handleSubmit
      }
    >
      <div className="entity-form-header">
        <div>
          <h2>
            {isEditing
              ? "Edit label"
              : "Create label"}
          </h2>

          <p>
            {isEditing
              ? "Rename this label."
              : "Use labels to group related tasks."}
          </p>
        </div>


        <button
          type="button"
          className="entity-form-close"
          onClick={
            onCancel
          }
          disabled={
            loading
          }
          aria-label="Close label form"
        >
          ×
        </button>
      </div>


      <div className="entity-form-body">
        <div className="entity-form-field">
          <label htmlFor="label-name">
            Label name
          </label>

          <div className="entity-label-input">
            <span>
              #
            </span>

            <input
              id="label-name"
              name="name"
              type="text"
              value={
                name
              }
              onChange={(
                event
              ) =>
                setName(
                  event
                    .target
                    .value
                )
              }
              placeholder="important"
              minLength={1}
              maxLength={50}
              disabled={
                loading
              }
              autoFocus
              required
            />
          </div>
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
          className="entity-form-button entity-form-button-secondary"
          onClick={
            onCancel
          }
          disabled={
            loading
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className="entity-form-button entity-form-button-primary"
          disabled={
            loading
          }
        >
          {loading
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save changes"
              : "Create label"}
        </button>
      </div>
    </form>
  );
}


export default LabelForm;