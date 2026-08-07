import {
  useEffect,
} from "react";

import "../../styles/modal.css";


function Modal({
  children,
  onClose,
  ariaLabel,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [onClose]);


  function handleOverlayClick(event) {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  }


  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}


export default Modal;