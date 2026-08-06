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
    <section>
      <h2>View options</h2>

      <div>
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

      <div>
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

      <div>
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

      <div>
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

      {hasActiveOptions && (
        <button
          type="button"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </section>
  );
}

export default TaskFilters;