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
    (page - 1) * pageSize + 1;

  const lastItem =
    Math.min(
      page * pageSize,
      total
    );


  function handlePageSizeChange(event) {
    onPageSizeChange(
      Number(event.target.value)
    );
  }


  return (
    <div className="pagination">
      <div className="pagination-summary">
        Showing{" "}
        <strong>{firstItem}</strong>
        {" - "}
        <strong>{lastItem}</strong>
        {" of "}
        <strong>{total}</strong>
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
            className="pagination-button"
            onClick={() =>
              onPageChange(page - 1)
            }
            disabled={page <= 1}
          >
            ←
          </button>

          <span className="pagination-page">
            {totalPages === 0
              ? "0 / 0"
              : `${page} / ${totalPages}`}
          </span>

          <button
            type="button"
            className="pagination-button"
            onClick={() =>
              onPageChange(page + 1)
            }
            disabled={
              totalPages === 0 ||
              page >= totalPages
            }
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}


export default PaginationControls;