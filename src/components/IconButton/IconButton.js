import React from "react";

function IconButton({ Icon, containerStyle, style, onClick }) {
  return (
    <div style={containerStyle}>
      <img src={Icon} style={style} onClick={onClick} />
    </div>
  );
}

export default IconButton;
