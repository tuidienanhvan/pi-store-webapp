import React, { forwardRef, useId } from "react";



import "./Input.css";



export const Input = forwardRef(({

  label,

  hint,

  error,

  leadingIcon: LeadingIconComponent,

  className = "",

  id,

  style,          // ? extracted so it doesn't override paddingLeft on <input>

  inputStyle,     // optional: styles specifically for the <input> element

  ...props

}, ref) => {

  const generatedId = useId();

  const inputId = id || generatedId;

  const isInvalid = Boolean(error);



  // Merge: padding-left from icon + any caller-supplied inputStyle

  const resolvedInputStyle = {

    ...(LeadingIconComponent ? { paddingLeft: "40px" } : {}),

    ...inputStyle,

  };



  return (

    <div className={`form-group ${className}`} style={style}>

      {label && (

        <label htmlFor={inputId} className="form-label">

          {label}

        </label>

      )}

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

        {LeadingIconComponent && (
          <div style={{ position: "absolute", left: "12px", color: "color-mix(in srgb, var(--bc) 60%, transparent)", display: "flex", pointerEvents: "none" }}>
            <LeadingIconComponent size={15} />
          </div>
        )}

        <input

          ref={ref}

          id={inputId}

          className="input"

          style={resolvedInputStyle}

          aria-invalid={isInvalid}

          aria-describedby={

            isInvalid ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

          }

          {...props}

        />

      </div>

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



Input.displayName = "Input";

