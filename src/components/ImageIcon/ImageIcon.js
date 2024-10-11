import React from "react";

function ImageIcon({ Icon, ContainerStyle, Style,  }) {
  return (
    <div style={ContainerStyle}>
      <img src={Icon} style={Style}  />
    </div>
  );
}

export default ImageIcon;
