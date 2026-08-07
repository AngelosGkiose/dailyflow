import "../../styles/task-filters.css";


function TaskFilters({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  function handleChange(event) {
    const { name, value } = event.target;

    onFilterChange(name, value);
  }

  const hasActiveOptions =
    filters.priority !== "" ||
    filters.dueDate !== "" ||
    filters.sortBy !== "created_at" ||
    filters.order !== "desc";


  return (
    <section className="task-filters">
      <div className="task-filters-header">
        <div>
          <h2>View options</h2>
          <p>
            Filter and sort the tasks in this view.
          </p>
        </div>

        {hasActiveOptions && (
          <button
            type="button"
            className="task-filters-clear"
            onClick={onClearFilters}
          >
            Reset
          </button>
        )}
      </div>

      <div className="task-filters-grid">
        <div className="task-filter-field">
          <label htmlFor="filter-priority">
            Priority
          </label>

          <select
            id="filter-priority"
            name="priority"
            value={filters.priority}
            onChange={handleChange}
          >
            <option value="">
              All priorities
            </option>

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

        <div className="task-filter-field">
          <label htmlFor="filter-due-date">
            Due date
          </label>

          <input
            id="filter-due-date"
            name="dueDate"
            type="date"
            value={filters.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="task-filter-field">
          <label htmlFor="filter-sort-by">
            Sort by
          </label>

          <select
            id="filter-sort-by"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
          >
            <option value="created_at">
              Created date
            </option>

            <option value="updated_at">
              Updated date
            </option>

            <option value="due_date">
              Due date
            </option>

            <option value="title">
              Title
            </option>
          </select>
        </div>

        <div className="task-filter-field">
          <label htmlFor="filter-order">
            Order
          </label>

          <select
            id="filter-order"
            name="order"
            value={filters.order}
            onChange={handleChange}
          >
            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}


export default TaskFilters;