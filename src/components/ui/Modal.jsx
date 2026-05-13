import React, { useEffect, useRef } from "react";

import { createPortal } from "react-dom";

import { IconButton } from "./Button";
import { X } from "lucide-react";
 // Reuses icon styling



export function Modal({ open, onClose, title, children, size = "md" }) {

  const modalRef = useRef(null);



  useEffect(() => {

    const handleEscape = (e) => {

      if (e.key === "Escape" && open) onClose();

    };

    if (open) {

      document.addEventListener("keydown", handleEscape);

      document.body.style.overflow = "hidden"; // lock scroll

    } else {

      document.body.style.overflow = "";

    }

    return () => {

      document.removeEventListener("keydown", handleEscape);

      document.body.style.overflow = "";

    };

  }, [open, onClose]);



  const handleBackdropClick = (e) => {

    if (e.target === e.currentTarget) onClose();

  };



  if (!open) return null;



  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) return null;



  const maxWidth = size === "sm" ? "400px" : size === "lg" ? "800px" : "500px";



  return createPortal(

    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">

      <div ref={modalRef} className="modal" style={{ maxWidth }}>

        {title && (

          <header className="modal__header">

            <h3 id="modal-title" style={{ margin: 0, fontSize: "var(--fs-18)" }}>{title}</h3>

            <IconButton icon={X} label="Close modal" onClick={onClose} size="sm" />

          </header>

        )}

        <div className="modal__body">

          {children}

        </div>

      </div>

    </div>,

    modalRoot

  );

}

