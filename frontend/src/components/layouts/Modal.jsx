import {
  useEffect,
  useRef,
} from "react";

import "../../styles/modal.css";


function Modal({
  children,
  onClose,
  ariaLabel,
}) {
  const modalRef =
    useRef(null);

  const onCloseRef =
    useRef(onClose);

  const previousFocusRef =
    useRef(null);


  useEffect(() => {
    onCloseRef.current =
      onClose;
  }, [
    onClose,
  ]);


  useEffect(() => {
    previousFocusRef.current =
      document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";


    const modalElement =
      modalRef.current;

    const focusableSelector = [
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");


    function getFocusableElements() {
      if (!modalElement) {
        return [];
      }

      return Array.from(
        modalElement.querySelectorAll(
          focusableSelector
        )
      );
    }


    function focusModal() {
      const focusableElements =
        getFocusableElements();

      if (
        focusableElements.length >
        0
      ) {
        focusableElements[0]
          .focus();
      } else {
        modalElement?.focus();
      }
    }


    const focusTimer =
      window.setTimeout(
        focusModal,
        0
      );


    function handleKeyDown(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();

        onCloseRef.current();

        return;
      }


      if (
        event.key !==
        "Tab"
      ) {
        return;
      }


      const focusableElements =
        getFocusableElements();


      if (
        focusableElements.length ===
        0
      ) {
        event.preventDefault();

        modalElement?.focus();

        return;
      }


      const firstElement =
        focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length -
          1
        ];


      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();

        lastElement.focus();

        return;
      }


      if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();

        firstElement.focus();
      }
    }


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.clearTimeout(
        focusTimer
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;

      if (
        previousFocusRef.current instanceof
        HTMLElement
      ) {
        previousFocusRef.current
          .focus();
      }
    };
  }, []);


  function handleOverlayClick(
    event
  ) {
    if (
      event.target ===
      event.currentTarget
    ) {
      onCloseRef.current();
    }
  }


  return (
    <div
      className="modal-overlay"
      onMouseDown={
        handleOverlayClick
      }
    >
      <div
        ref={modalRef}
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}


export default Modal;