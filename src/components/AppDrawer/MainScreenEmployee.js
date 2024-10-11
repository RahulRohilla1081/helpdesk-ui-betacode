import React, { useState } from "react";
import {
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import Header from "./Header";
// import AppDrawerEmployee from "./AppDrawerEmployee";
import { maxHeight, minHeight } from "@mui/system";
import AppDrawer from "./AppDrawer";

export default function MainScreenEmployee(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      {/* <Box
        sx={{
          ml: useMediaQuery(useTheme().breakpoints.up("lg"))
            ? `${props.drawerWidth}px`
            : "200px",
        }}
      > */}

      {/* </Box> */}
      <Box
        // sx={{
        //   display: "flex",
        // }}
      >
        <AppDrawer
          drawerWidth={props.drawerWidth}
          toggleDrawer={setDrawerOpen}
          showDrawer={drawerOpen}
          ActiveKey={props.ActiveKey}
        />
        <Box
          // className="main-screen"
          component={"main"}
          sx={{
            // p: 4,
            width: { lg: `calc(100%)` },
            // ml: useMediaQuery(useTheme().breakpoints.up("lg"))
            //   ? `${props.drawerWidth}px`
            //   : "0px",
            // width: { lg: `calc(100% - ${props.drawerWidth}px)` },
            // ml: useMediaQuery(useTheme().breakpoints.up("lg"))
            //   ? `${props.drawerWidth}px`
            //   : "0px",
            backgroundColor: "#f0f0f0",

            // height:"100vh",
            minHeight: "100vh",
            // maxHeight:"150vh"
            // flexGrow: 1,
          }}
        >
          {/* <Toolbar />
          <CssBaseline /> */}
          <Header
            drawerWidth={props.drawerWidth}
            // toggleDrawer={props.setShowDrawer}
            showDrawer={drawerOpen}
            toggleDrawer={setDrawerOpen}
            ActiveScreen={props.Activekey}
          />
          {props.children}
        </Box>
      </Box>
    </>
  );
}
