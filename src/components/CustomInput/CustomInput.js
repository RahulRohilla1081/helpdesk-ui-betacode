import React from "react";
import "./styles.css";
import { Input } from "reactstrap";
function CustomInput({
  placeholder,
  onChange,
  value,
  className,
  type,
  style,
  disabled,
}) {
  return (
    <Input
      type={type}
      className={className}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={onChange}
      style={{
        height: 30,
        ...style,
      }}
    />
  );
}

export default CustomInput;
