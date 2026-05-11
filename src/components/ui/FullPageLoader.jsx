import React from "react";
import "./FullPageLoader.css";

export function FullPageLoader() {
  return (
    <div className="full-page-loader">
      <div className="loader-content">
        <div className="loader-orbits">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />
          <div className="loader-core" />
        </div>
        <div className="loader-text">
          <span className="brand-text">PI STORE</span>
          <div className="shimmer-bar" />
        </div>
      </div>
      <div className="loader-bg-glow" />
    </div>
  );
}
