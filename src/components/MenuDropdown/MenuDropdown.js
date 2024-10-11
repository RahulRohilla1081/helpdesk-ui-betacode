


import React, { useState, useContext } from "react";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import { useNavigate } from "react-router-dom";

const menu = {
  menuItem: {
    padding: "6px 4px",
    borderRadius: "8px",
  },
};

export default function MenuDropdown({
  Icon,
  MenuLabel0,
  MenuOnCLick0,
  MenuLabel1,
  MenuOnCLick1,
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const showMenu = Boolean(anchorEl);
  //   const MenuList=[]
  return (
    <>
      <Tooltip title={"Action"}>
        <IconButton onClick={(e) => setAnchorEl(e.target)}>
          <Icon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={showMenu}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          mt: 1.5,
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
        }}
        PaperProps={{ sx: { px: 2 } }}
        elevation={0}
      >
        <MenuItem style={menu.menuItem} onClick={MenuOnCLick0}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={MenuLabel0} style={{ width: 150 }} />
        </MenuItem>
        <Divider />
        <MenuItem
          style={menu.menuItem}
          onClick={() => {
            MenuOnCLick1();
          }}
        >
          <ListItemIcon>
            <PersonOutlineRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={MenuLabel1} style={{ width: 150 }} />
        </MenuItem>
        {/* {MenuData.map((val, index) => {
          return (
            <>
              <MenuItem
                style={menu.menuItem}
                onClick={() => {
                  index == 0 ? MenuOnCLick0() : null;
                }}
              >
                <ListItemIcon>
                  <PersonOutlineRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={val.Label} style={{ width: 150 }} />
              </MenuItem>
              {MenuData.length - 1 != index && }
            </>
          );
        })} */}

        {/* <MenuItem
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            "&:hover": { backgroundColor: "transparent" },
            cursor: "initial",
            borderRadius: "4px",
            padding: 0,
          }}
        >
          <Typography variant="h6">Sumit</Typography>
          <Typography variant="subtitle1" color={"GrayText"}>
            sumitbura75@gmail.com
          </Typography>
        </MenuItem> */}
        {/* <Divider />
        <MenuItem style={menu.menuItem}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem
          style={menu.menuItem}
          onClick={() => {
            navigate("/account");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <TuneRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem style={menu.menuItem}>
          <ListItemIcon>
            <CreditCardRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Billing" />
        </MenuItem>
        <Divider />
        <ListItemButton
          style={menu.menuItem}
          sx={{
            display: "flex",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          <Typography align="inherit">Logout</Typography>
        </ListItemButton> */}
      </Menu>
    </>
  );
}
