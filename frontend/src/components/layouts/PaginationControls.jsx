function PaginationControls({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  if (total === 0) {
    return null;
  }

  const firstItem =
    (page - 1) * pageSize + 1;

  const lastItem = Math.min(
    page * pageSize,
    total
  );

  function handlePageSizeChange(event) {
    onPageSizeChange(
      Number(event.target.value)
    );
  }

  return (
    <nav aria-label="Task pagination">
      <p>
        Showing {firstItem}-{lastItem} of{" "}
        {total} tasks
      </p>

      <div>
        <label htmlFor="page-size">
          Tasks per page
        </label>

        <select
          id="page-size"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div>
        <button
          type="button"
          onClick={() =>
            onPageChange(page - 1)
          }
          disabled={page <= 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() =>
            onPageChange(page + 1)
          }
          disabled={
            page >= totalPages
          }
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default PaginationControls;