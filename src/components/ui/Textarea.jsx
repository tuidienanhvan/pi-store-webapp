import React, { forwardRef, useId } from "react";

import "./Input.css";



export const Textarea = forwardRef(({

  label,

  hint,

  error,

  className = "",

  id,

  ...props

}, ref) => {

  const generatedId = useId();

  const inputId = id || generatedId;

  const isInvalid = Boolean(error);

  

  return (

    <div className={`form-group ${className}`}>

      {label && (

        <label htmlFor={inputId} className="form-label">

          {label}

        </label>

      )}

      <textarea

        ref={ref}

        id={inputId}

        className="textarea"

        aria-invalid={isInvalid}

        aria-describedby={

          isInvalid ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

        }

        {...props}

      />

      {hint && !isInvalid && (

        <div id={`${inputId}-hint`} className="form-hint">

          {hint}

        </div>

      )}

      {isInvalid && error && (

        <div id={`${inputId}-error`} className="form-error">

          {error}

        </div>

      )}

    </div>

  );

});



Textarea.displayName = "Textarea";

