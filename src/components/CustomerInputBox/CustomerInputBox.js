import React from "react";
import "./CustomerInputBox.css";
function CustomerInputBox({
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
}) {
  return (
    // <div
    //   style={{
    //     flexDirection: "column",
    //     // width:"100%"
    //   }}
    // >
    <>
      {/* <div
        // className="text-box-icon-style"
        style={{
          backgroundColor: isRequired ? "red" : "",
        }}
      /> */}
      <input
        id={id}
        className={`customer-input-box-style${error ? " text-error" : ""}`}
        // className={`customer-input-box-style text-error`}
        placeholder={Placeholder}
        onChange={onChange}
        value={Value}
        disabled={Disabled}
        type={Type}
        style={{ ...Style, width: "100%" }}
        onBlur={onBlur}
      />
      <p className="helper-text">{helperText}</p>
    </>
    // </div>
  );
}

export default CustomerInputBox;
