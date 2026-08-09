import "../../styles/pagination.css";


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
    (page - 1) *
    pageSize +
    1;

  const lastItem =
    Math.min(
      page * pageSize,
      total
    );


  function handlePageSizeChange(
    event
  ) {
    onPageSizeChange(
      Number(
        event.target.value
      )
    );
  }


  return (
    <div
      className="pagination"
      aria-label="Task pagination"
    >
      <div className="pagination-summary">
        Showing{" "}
        <strong>
          {firstItem}
          {" - "}
          {lastItem}
        </strong>
        {" of "}
        <strong>
          {total}
        </strong>
      </div>


      <div className="pagination-controls">
        <div className="pagination-size">
          <label htmlFor="page-size">
            Per page
          </label>

          <select
            id="page-size"
            value={pageSize}
            onChange={
              handlePageSizeChange
            }
          >
            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>
          </select>
        </div>


        <div className="pagination-navigation">
          <button
            type="button"
            className="button button-secondary button-icon button-small"
            onClick={() =>
              onPageChange(
                page - 1
              )
            }
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <span aria-hidden="true">
              ←
            </span>
          </button>

          <span
            className="pagination-page"
            aria-live="polite"
          >
            {totalPages === 0
              ? "0 / 0"
              : `${page} / ${totalPages}`}
          </span>

          <button
            type="button"
            className="button button-secondary button-icon button-small"
            onClick={() =>
              onPageChange(
                page + 1
              )
            }
            disabled={
              totalPages === 0 ||
              page >= totalPages
            }
            aria-label="Next page"
          >
            <span aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}


export default PaginationControls;