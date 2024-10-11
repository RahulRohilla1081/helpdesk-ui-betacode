import React, { useState } from "react";
import {
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import Header from "./Header";
import AppDrawer from "./AppDrawer";
import { fontSize, maxHeight, minHeight } from "@mui/system";
export default function MainScreen(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerWidth=200
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
          ActiveKey={props.Activekey}
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
            // height: "100vh",
            minHeight: "88vh",
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
