import React from "react";
import "./styles.css";
function LoginInput({
  Placeholder,
  onChange,
  Value,
  Disabled,
  Type,
  Style,
  error,
  helperText,
  onBlur,
  isRequired,
  id,
  className,
}) {
  return (
    <div
      style={{
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div className="group">
        <div
          className="text-box-icon-style"
          style={{
            backgroundColor: isRequired ? "red" : "",
          }}
        />
        <input
          id={id}
          className={`text-box-style ${className} ${
            error ? " text-error" : ""
          }`}
          placeholder={Placeholder}
          onChange={onChange}
          value={Value}
          disabled={Disabled}
          type={Type}
          style={{ ...Style, width: "100%" }}
          onBlur={onBlur}
        />
      </div>
      <p className="helper-text">{helperText}</p>
    </div>
  );
}

export default LoginInput;
