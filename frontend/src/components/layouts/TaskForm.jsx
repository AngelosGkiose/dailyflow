import {
  useEffect,
  useState,
} from "react";

import {
  addLabelToTask,
  createTask,
  removeLabelFromTask,
  updateTask,
} from "../../api/tasksApi.js";

import "../../styles/task-form.css";


function getCurrentLocalDateTime() {
  const now =
    new Date();

  const timezoneOffset =
    now.getTimezoneOffset() *
    60 *
    1000;

  return new Date(
    now.getTime() -
    timezoneOffset
  )
    .toISOString()
    .slice(0, 16);
}


function formatDateTimeLocal(
  dateValue
) {
  if (!dateValue) {
    return "";
  }

  const date =
    new Date(dateValue);

  const timezoneOffset =
    date.getTimezoneOffset() *
    60 *
    1000;

  return new Date(
    date.getTime() -
    timezoneOffset
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
}) {
  const isEditing =
    task !== null;


  const [
    formData,
    setFormData,
  ] = useState({
    title:
      task?.title ?? "",

    description:
      task?.description ?? "",

    priority:
      task?.priority ??
      "medium",

    due_date: task
      ? formatDateTimeLocal(
          task.due_date
        )
      : defaultToToday
        ? getCurrentLocalDateTime()
        : "",

    project_id:
      task?.project_id !==
        null &&
      task?.project_id !==
        undefined
        ? String(
            task.project_id
          )
        : defaultProjectId !==
              null &&
            defaultProjectId !==
              undefined
          ? String(
              defaultProjectId
            )
          : "",

    label_ids:
      task?.labels?.map(
        (label) =>
          label.id
      ) ?? [],
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
      title:
        task?.title ?? "",

      description:
        task?.description ??
        "",

      priority:
        task?.priority ??
        "medium",

      due_date: task
        ? formatDateTimeLocal(
            task.due_date
          )
        : defaultToToday
          ? getCurrentLocalDateTime()
          : "",

      project_id:
        task?.project_id !==
          null &&
        task?.project_id !==
          undefined
          ? String(
              task.project_id
            )
          : defaultProjectId !==
                null &&
              defaultProjectId !==
                undefined
            ? String(
                defaultProjectId
              )
            : "",

      label_ids:
        task?.labels?.map(
          (label) =>
            label.id
        ) ?? [],
    });

    setError("");
  }, [
    task,
    defaultProjectId,
    defaultToToday,
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


  function handleLabelChange(
    event
  ) {
    const labelId =
      Number(
        event.target.value
      );

    const isChecked =
      event.target.checked;


    setFormData(
      (
        currentFormData
      ) => ({
        ...currentFormData,

        label_ids:
          isChecked
            ? [
                ...currentFormData
                  .label_ids,
                labelId,
              ]
            : currentFormData
                .label_ids
                .filter(
                  (
                    currentLabelId
                  ) =>
                    currentLabelId !==
                    labelId
                ),
      })
    );
  }


  async function synchronizeTaskLabels(
    taskId,
    originalLabelIds,
    selectedLabelIds
  ) {
    const labelsToAdd =
      selectedLabelIds.filter(
        (labelId) =>
          !originalLabelIds.includes(
            labelId
          )
      );


    const labelsToRemove =
      originalLabelIds.filter(
        (labelId) =>
          !selectedLabelIds.includes(
            labelId
          )
      );


    for (
      const labelId of
      labelsToAdd
    ) {
      await addLabelToTask(
        taskId,
        labelId
      );
    }


    for (
      const labelId of
      labelsToRemove
    ) {
      await removeLabelFromTask(
        taskId,
        labelId
      );
    }
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    const title =
      formData.title.trim();


    if (!title) {
      setError(
        "Task title cannot be empty."
      );

      return;
    }


    const taskData = {
      title,

      description:
        formData.description
          .trim() ||
        null,

      priority:
        formData.priority,

      due_date:
        formData.due_date
          ? new Date(
              formData.due_date
            ).toISOString()
          : null,

      project_id:
        formData.project_id
          ? Number(
              formData.project_id
            )
          : null,
    };


    setLoading(true);
    setError("");


    try {
      const savedTask =
        isEditing
          ? await updateTask(
              task.id,
              taskData
            )
          : await createTask(
              taskData
            );


      const originalLabelIds =
        isEditing
          ? task.labels?.map(
              (label) =>
                label.id
            ) ?? []
          : [];


      await synchronizeTaskLabels(
        savedTask.id,
        originalLabelIds,
        formData.label_ids
      );


      onTaskSaved(
        savedTask
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
      className="task-form"
      onSubmit={
        handleSubmit
      }
    >
      <div className="task-form-header">
        <div>
          <h2>
            {isEditing
              ? "Edit task"
              : "Add task"}
          </h2>

          <p>
            {isEditing
              ? "Update the details of your task."
              : "Create a new task and organize it."}
          </p>
        </div>


        <button
          type="button"
          className="task-form-close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close task form"
        >
          ×
        </button>
      </div>


      <div className="task-form-body">

        <div className="task-form-field">
          <label htmlFor="task-title">
            Task
          </label>

          <input
            id="task-title"
            name="title"
            type="text"
            value={
              formData.title
            }
            onChange={
              handleChange
            }
            placeholder="What needs to be done?"
            minLength={1}
            maxLength={100}
            disabled={
              loading
            }
            autoFocus
            required
          />
        </div>


        <div className="task-form-field">
          <label htmlFor="task-description">
            Description
          </label>

          <textarea
            id="task-description"
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            maxLength={500}
            placeholder="Add more details..."
            rows={4}
            disabled={
              loading
            }
          />
        </div>


        <div className="task-form-grid">
          <div className="task-form-field">
            <label htmlFor="task-due-date">
              Due date
            </label>

            <input
              id="task-due-date"
              name="due_date"
              type="datetime-local"
              value={
                formData.due_date
              }
              onChange={
                handleChange
              }
              disabled={
                loading
              }
            />
          </div>


          <div className="task-form-field">
            <label htmlFor="task-priority">
              Priority
            </label>

            <select
              id="task-priority"
              name="priority"
              value={
                formData.priority
              }
              onChange={
                handleChange
              }
              disabled={
                loading
              }
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
        </div>


        <div className="task-form-field">
          <label htmlFor="task-project">
            Project
          </label>

          <select
            id="task-project"
            name="project_id"
            value={
              formData.project_id
            }
            onChange={
              handleChange
            }
            disabled={
              loading
            }
          >
            <option value="">
              Inbox — No project
            </option>

            {projects.map(
              (project) => (
                <option
                  key={
                    project.id
                  }
                  value={
                    String(
                      project.id
                    )
                  }
                >
                  {project.name}
                </option>
              )
            )}
          </select>
        </div>


        <fieldset className="task-form-labels">
          <legend>
            Labels
          </legend>

          {labels.length ===
          0 ? (
            <p className="task-form-labels-empty">
              No labels available.
            </p>
          ) : (
            <div className="task-form-label-options">
              {labels.map(
                (label) => {
                  const isSelected =
                    formData
                      .label_ids
                      .includes(
                        label.id
                      );

                  return (
                    <label
                      key={
                        label.id
                      }
                      className={
                        isSelected
                          ? "task-form-label-option selected"
                          : "task-form-label-option"
                      }
                    >
                      <input
                        type="checkbox"
                        value={
                          label.id
                        }
                        checked={
                          isSelected
                        }
                        onChange={
                          handleLabelChange
                        }
                        disabled={
                          loading
                        }
                      />

                      #
                      {label.name}
                    </label>
                  );
                }
              )}
            </div>
          )}
        </fieldset>


        {error && (
          <div
            className="task-form-error"
            role="alert"
          >
            {error}
          </div>
        )}

      </div>


      <div className="task-form-footer">
        <button
          type="button"
          className="task-form-button task-form-button-secondary"
          onClick={onCancel}
          disabled={
            loading
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className="task-form-button task-form-button-primary"
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
              : "Add task"}
        </button>
      </div>
    </form>
  );
}


export default TaskForm;