// src/components/DesktopGuard.jsx
import React, { useEffect, useState } from "react";

/**
 * Shows its children only when the viewport meets the minimum size.
 * Default breakpoint: 1024 px width × 600 px height.
 *
 * Uses plain HTML + Bootstrap utility / component classes
 * (no react‑bootstrap dependency).
 */
export default function DesktopGuard({
  children,
  minWidth = 1024,
  minHeight = 600,
}) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const checkSize = () => {
    const ok =
      window.innerWidth >= minWidth && window.innerHeight >= minHeight;
    setIsDesktop(ok);
    setShowModal(!ok);
  };

  useEffect(() => {
    checkSize(); // run on mount
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // When the viewport is large enough just render the children
  if (isDesktop) return <>{children}</>;

  /* -------------------------------------------------------------
   * Modal markup – follows the structure used by Bootstrap 5
   * ---------------------------------------------------------- */
  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{
        display: showModal ? "block" : "none",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title text-danger">Desktop Version Required</h5>
          </div>

          {/* Body */}
          <div className="modal-body">
            This part of the application works best on a desktop or laptop
            with a screen width of at least{" "}
            <strong>{minWidth}px</strong>. You can still visit our{" "}
            <a href="/">Home</a> or <a href="/About">About</a> pages.
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (window.location.href = "/About")}
            >
              About Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
