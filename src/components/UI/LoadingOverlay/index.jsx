import React from "react";
import "./style.css";

const LoadingOverlay = ({ text = "Carregando..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner">
            <div className="loading-circle outer" />
            <div className="loading-circle inner" />
          </div>
        </div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
