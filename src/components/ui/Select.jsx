import React, { forwardRef, useId } from "react";

import { Icon } from "./icons";

import "./Input.css";



export const Select = forwardRef(({

  label,

  hint,

  error,

  options = [],

  className = "",

  id,

  style,

  selectStyle,

  ...props

}, ref) => {

  const generatedId = useId();

  const inputId = id || generatedId;

  const isInvalid = Boolean(error);



  const resolvedSelectStyle = {

    appearance: "none",

    WebkitAppearance: "none",

    MozAppearance: "none",

    backgroundImage: "none",

    paddingRight: "42px",

    ...selectStyle,

  };



  return (

    <div className={`form-group ${className}`} style={style}>

      {label && (

        <label htmlFor={inputId} className="form-label">

          {label}

        </label>

      )}

      <div style={{ position: "relative" }}>

        <select

          ref={ref}

          id={inputId}

          className="select"

          aria-invalid={isInvalid}

          aria-describedby={

            isInvalid ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

          }

          style={resolvedSelectStyle}

          {...props}

        >

          {options.map((opt, i) => (

            <option key={i} value={opt.value}>

              {opt.label}

            </option>

          ))}

        </select>

        <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "color-mix(in srgb, var(--base-content) 60%, transparent)", display: "flex" }}>

          <Icon name="chevron-down" size={14} />

        </div>

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



Select.displayName = "Select";

