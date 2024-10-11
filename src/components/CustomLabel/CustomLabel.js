import React from "react";

function CustomLabel({ LabelText }) {
  return (
    // <div>
    <p
      style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "gray",
      }}
    >
      {LabelText}
    </p>
    // </div>
  );
}

export default CustomLabel;
