import React from "react";

const PaginationDot = ({ active, onClick }) => {
  return (
    <span
      className={`pagination-dot ${active ? "active" : ""}`}
      onClick={onClick}
    />
  );
};

export default PaginationDot;
