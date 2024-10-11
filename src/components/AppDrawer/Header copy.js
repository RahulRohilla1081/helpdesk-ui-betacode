import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AddIcon from "@mui/icons-material/Add";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import {
  Avatar,
  Badge,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
// import {
//   CUSTOMER,
//   CUSTOMER_CREATION,
//   DASHBOARD,
//   VENDOR,
//   VENDOR_APPROVAL,
//   VENDOR_CREATION,
// } from "../../Utils/Routes";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../screens/Utils/Theme";
import axios from "axios";
import AXIOS from "../../screens/Utils/AXIOS";
import {
  APPROVAL_CENTER,
  CONTROL_CENTER,
  CUSTOMER,
  CUSTOMER_APPROVAL,
  CUSTOMER_CREATION,
  DASHBOARD,
  VENDOR,
  VENDOR_APPROVAL,
  VENDOR_CREATION,
} from "../../screens/Utils/Routes";
// import AXIOS from "../../Utils/AXIOS";
// import ICONS from "../../utils/ICONS";

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function Header(props, { children }) {
  const logoutSession = (SessionType) => {
    axios
      .post(AXIOS.axiosUrl + AXIOS.logoutSession, {
        SESSION_ID: props.SESSION_ID,
        SESSION_TYPE: SessionType,
        USER_ID: props.AUTH_ID,
      })
      .then((response) => {
        localStorage.removeItem("MDM_MasterToken");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const vendorDropDownOptions = [
    {
      label: "Vendor",
      icon: <GroupOutlinedIcon />,
      path: VENDOR,
    },
    {
      label: "Vendor Approval",
      icon: <FactCheckIcon />,
      path: VENDOR_APPROVAL,
    },
    {
      label: "Vendor Creation",
      icon: <AddBoxIcon />,
      path: VENDOR_CREATION,
    },
  ];
  const CustomerDropDownOptions = [
    {
      label: "Customer",
      icon: <GroupOutlinedIcon />,
      path: CUSTOMER,
    },
    {
      label: "Customer Creation",
      icon: <FactCheckIcon />,
      path: CUSTOMER_CREATION,
    },
    {
      label: "Customer Approval",
      icon: <FactCheckIcon />,
      path: CUSTOMER_APPROVAL,
    },
  ];
  const AdminDropDownOptions = [
    {
      label: "Control Center",
      icon: <GroupOutlinedIcon />,
      path: CONTROL_CENTER,
    },
    {
      label: "Approver Center",
      icon: <FactCheckIcon />,
      path: APPROVAL_CENTER,
    },
  ];

  const navigate = useNavigate();
  const [vendorAnchorEL, setVendorAnchorEL] = React.useState(null);
  const openVendorDropdown = Boolean(vendorAnchorEL);
  const handleVendorDropdownOpen = (event) => {
    setVendorAnchorEL(event.currentTarget);
  };
  const handleVendorDropdownClose = (path) => {
    setVendorAnchorEL(null);
  };
  const [customerAnchorEL, setCustomerAnchorEL] = React.useState(null);
  const openCustomerDropdown = Boolean(customerAnchorEL);
  const handleCustomerDropdownOpen = (event) => {
    setCustomerAnchorEL(event.currentTarget);
  };
  const handleCustomerDropdownClose = (path) => {
    setCustomerAnchorEL(null);
  };
  const [AdminAnchorEL, setAdminAnchorEL] = React.useState(null);
  const openAdminDropdown = Boolean(AdminAnchorEL);
  const handleAdminDropdownOpen = (event) => {
    setAdminAnchorEL(event.currentTarget);
  };
  const handleAdminDropdownClose = (path) => {
    setAdminAnchorEL(null);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar
          sx={{
            backgroundColor: "#323949",
          }}
        >
          <Toolbar>
            <div>
              <ListItem
                className="nav-bar-item"
                disablePadding
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                }}
                onClick={() => {
                  navigate(DASHBOARD);
                }}
              >
                <ListItemButton>
                  <ListItemText
                    primary={"Dashboard"}
                    sx={{ textAlign: "center" }}
                    className="text-label"
                  />
                </ListItemButton>
              </ListItem>
            </div>
            <div>
              <ListItem
                className="nav-bar-item"
                disablePadding
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                }}
                aria-controls={openVendorDropdown ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openVendorDropdown ? "true" : undefined}
                onClick={handleVendorDropdownOpen}
              >
                <ListItemButton>
                  <ListItemText
                    primary={"Vendor"}
                    sx={{ textAlign: "center" }}
                    className="text-label"
                  />
                </ListItemButton>
              </ListItem>
              <Menu
                id="basic-menu"
                anchorEl={vendorAnchorEL}
                open={openVendorDropdown}
                onClose={handleVendorDropdownClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {vendorDropDownOptions.map((val) => {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleVendorDropdownClose();
                          navigate(val.path);
                        }}
                        sx={{
                          p: 2,
                        }}
                      >
                        <ListItemIcon>{val.icon}</ListItemIcon>
                        {val.label}
                      </MenuItem>
                    </>
                  );
                })}
              </Menu>
            </div>
            <div>
              <ListItem
                className="nav-bar-item"
                disablePadding
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                }}
                aria-controls={openCustomerDropdown ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openCustomerDropdown ? "true" : undefined}
                onClick={handleCustomerDropdownOpen}
              >
                <ListItemButton>
                  <ListItemText
                    primary={"Customer"}
                    sx={{ textAlign: "center" }}
                    className="text-label"
                  />
                </ListItemButton>
              </ListItem>
              <Menu
                id="basic-menu"
                anchorEl={customerAnchorEL}
                open={openCustomerDropdown}
                onClose={handleCustomerDropdownClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {CustomerDropDownOptions.map((val) => {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleCustomerDropdownClose();
                          navigate(val.path);
                        }}
                        sx={{
                          p: 2,
                        }}
                      >
                        <ListItemIcon>{val.icon}</ListItemIcon>
                        {val.label}
                      </MenuItem>
                    </>
                  );
                })}
              </Menu>
            </div>
            <div>
              <ListItem
                className="nav-bar-item"
                disablePadding
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                }}
                aria-controls={openAdminDropdown ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openAdminDropdown ? "true" : undefined}
                onClick={handleAdminDropdownOpen}
              >
                <ListItemButton>
                  <ListItemText
                    primary={"Admin"}
                    sx={{ textAlign: "center" }}
                    className="text-label"
                  />
                </ListItemButton>
              </ListItem>
              <Menu
                id="basic-menu"
                anchorEl={AdminAnchorEL}
                open={openAdminDropdown}
                onClose={handleAdminDropdownClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {AdminDropDownOptions.map((val) => {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          handleCustomerDropdownClose();
                          navigate(val.path);
                        }}
                        sx={{
                          p: 2,
                        }}
                      >
                        <ListItemIcon>{val.icon}</ListItemIcon>
                        {val.label}
                      </MenuItem>
                    </>
                  );
                })}
              </Menu>
            </div>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <IconButton
                aria-label="show notification"
                size="large"
                color="inherit"
                sx={{ mr: 2 }}
                className="nav-bar-item"
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsNoneRoundedIcon
                    sx={{
                      color: COLORS.white,
                    }}
                  />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="show notification"
                size="large"
                color="inherit"
                sx={{ mr: 2 }}
                className="nav-bar-item"
              >
                {/* <Badge badgeContent={4} color="error"> */}
                <LoginRoundedIcon
                  onClick={() => logoutSession("SINGLE")}
                  sx={{
                    color: COLORS.white,
                  }}
                />
                {/* </Badge> */}
              </IconButton>
              {/* <Avatar
                alt="Cindy Baker"
                src={ICONS.ProfileIcon}
                className="nav-bar-item"
                style={{
                  cursor: "pointer",
                }}
              /> */}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>{children}</Container>
    </React.Fragment>
  );
}
