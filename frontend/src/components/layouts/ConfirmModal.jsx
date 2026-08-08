import Modal from "./Modal.jsx";

import "../../styles/confirm-modal.css";


function ConfirmModal({
  title,
  message,
  confirmText = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      onClose={
        loading
          ? () => {}
          : onCancel
      }
      ariaLabel={title}
    >
      <div className="confirm-modal">
        <div className="confirm-modal-icon">
          !
        </div>

        <div className="confirm-modal-content">
          <h2>
            {title}
          </h2>

          <p>
            {message}
          </p>
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-button confirm-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-modal-button confirm-modal-delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}


export default ConfirmModal;