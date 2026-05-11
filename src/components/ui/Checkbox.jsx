import React, { forwardRef, useId } from "react";



export const Checkbox = forwardRef(({

  label,

  className = "",

  id,

  ...props

}, ref) => {

  const generatedId = useId();

  const inputId = id || generatedId;

  

  return (

    <div className={className}>

      <label htmlFor={inputId} className="checkbox-lbl">

        <input

          ref={ref}

          type="checkbox"

          id={inputId}

          {...props}

        />

        {label}

      </label>

    </div>

  );

});



Checkbox.displayName = "Checkbox";

