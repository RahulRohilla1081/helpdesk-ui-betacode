import React from "react";
import Typography from "@mui/material/Typography";
// import Select from "@mui/material/Select";
import Select from "react-select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
// import { COLORS } from "../../utils/Theme";
import { Box } from "@mui/material";

function CustomSelect({
  options,
  value,
  onChange,
  Label,
  error,
  Multi,
  IS_DISABLED,
  ID,
}) {
  // console.log("Options",Options);
  return (
    // <FormControl sx={{ m: 1, minWidth: "98.5%" }}>
    //   <InputLabel id="demo-simple-select-helper-label">{Label}</InputLabel>
    //   <Select
    //     labelId="demo-simple-select-helper-label"
    //     id="demo-simple-select-helper"
    //     value={Value}
    //     label={Label}
    //     onChange={OnChange}
    //   >
    //     {Options.map((val, index) => {
    //       return <MenuItem value={val.value}>{val.label}</MenuItem>;
    //     })}
    //   </Select>
    // </FormControl>
    <Box>
      <Select
        // classNames={{
        //   control: (state) => (state.isFocused ? "text-error" : "text-error"),
        // }}
        type={"dropdown"}
        id={ID}
        isMulti={Multi}
        // isDisabled={IS_DISABLED}
        styles={{
          placeholder: (defaultStyles) => {
            return {
              ...defaultStyles,
              color: "#94a3b8",
              fontSize: 15,
              fontWeight: 450,
              // marginTop: -5,
            };
          },
          option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isSelected ? "#70777d" : "white",
            color: state.isSelected ? "white" : "black",
            fontSize: 12,
            padding: 5,
            ":hover": {
              backgroundColor: "#20c997",
              color: "white",
            },
          }),
          control: (provided, state) => ({
            ...provided,
            background: "#fff",
            borderColor: "#c4c5c6",
            minHeight: "30px",
            height: "30px",
            borderRadius: 5,

            background: "#fdfdfe",
            boxShadow: state.isFocused ? "0 0 5px #f9fbfd" : "",
            borderColor: error ? "red" : "#e1e1e1",
          }),

          valueContainer: (provided, state) => ({
            ...provided,
            height: "30px",
            // marginTop:"-5px",
            padding: "0 6px",
            fontSize: 13,
          }),

          input: (provided, state) => ({
            ...provided,
            margin: "0px",
          }),
          indicatorSeparator: (state) => ({
            display: "none",
          }),
          indicatorsContainer: (provided, state) => ({
            ...provided,
            height: "30px",
          }),
        }}
        // className="text-error"
        options={options}
        value={value}
        onChange={onChange}
        // placeholder={"Select " + Label}
      />
    </Box>
  );
}

export default CustomSelect;
