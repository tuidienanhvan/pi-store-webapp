import React, { forwardRef } from "react";

import "./Table.css";



export const Table = forwardRef(({

  children,

  className = "",

  ...props

}, ref) => {

  return (

    <div className={`table-wrapper ${className}`}>

      <table ref={ref} className="table" {...props}>

        {children}

      </table>

    </div>

  );

});



Table.displayName = "Table";

