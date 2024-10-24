import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

import {
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import Icons from "../../assets/Icons";
import { connect } from "react-redux";
import socketIO from "socket.io-client";

import {
  EMPLOYEEDASHBOARD,
  LOGTICKET,
  LOGIN,
  ADDCATEGORY,
  ADDSUBCATEGORY,
  ADDITEM,
  ADDCOMPANY,
  ADDPROJECTMANAGER,
  APPROVER,
  ADDUSER,
  DASHBOARD,
  ADDTECHNICIAN,
  ADD_TECHNICIAN_MANAGER,
  TICKET_REPORT,
  TICKETDETAIL,
  USER_ROLES,
  ADD_TASK,
  ADD_EMPLOYEES,
  TICKET_STATUS_REPORT,
} from "../../Utils/Routes";
import AXIOS from "../../Utils/AXIOS";
import { ToastContainer, toast, Bounce } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Spinner } from "reactstrap";
function HideOnScroll(props) {
  const { children, window } = props;

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

function Header(props, { children }) {
  const logoutSession = (SessionType) => {
    // axios
    //   .post(AXIOS.axiosUrl + AXIOS.logoutSession, {
    //     SESSION_ID: props.SESSION_ID,
    //     SESSION_TYPE: SessionType,
    //     USER_ID: props.AUTH_ID,
    //   })
    //   .then((response) => {
    //     localStorage.removeItem("MDM_MasterToken");
    //     navigate("/");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  console.log("asdaslkdmasjd", props.LOGGED_IN_DATA);

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
  const handleDrawerToggle = () => {
    props.toggleDrawer(!props.showDrawer);
  };
  const breakPointlg = useMediaQuery(useTheme().breakpoints.up("lg"));
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElUser2, setAnchorElUser2] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenUserMenu2 = (event) => {
    setAnchorElUser2(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseUserMenu2 = () => {
    setAnchorElUser2(null);
  };
  const socket = socketIO.connect(AXIOS.defaultPort);
  function getRelativeTime(dateTime) {
    let timeSince = new Date().getTime() - new Date(dateTime).getTime();
    timeSince = Math.abs(timeSince);
    const MINUTE = 60 * 1000;
    // milliseconds in a minute
    const HOUR = 60 * MINUTE;
    // milliseconds in an hour
    const DAY = 24 * HOUR;
    // milliseconds in a day

    if (Number(timeSince) < MINUTE) {
      return "Just Now";
    } else if (Number(timeSince) < 2 * MINUTE) {
      return "1 min ago";
    } else if (Number(timeSince) < HOUR) {
      return Math.floor(timeSince / MINUTE) + " min ago";
    } else if (Number(timeSince) < 2 * HOUR) {
      return "an hour ago";
    } else if (Number(timeSince) < DAY) {
      return Math.floor(timeSince / HOUR) + " hours ago";
    } else if (Number(timeSince) < 2 * DAY) {
      return "yesterday";
    } else {
      return Math.floor(Number(timeSince) / DAY) + " days ago";
    }
  }

  // let Routes = [
  //   {
  //     label: "Dashboard",
  //     path: EMPLOYEEDASHBOARD,
  //   },
  //   {
  //     label: "Dashboard",
  //     path: DASHBOARD,
  //   },
  //   {
  //     label: "Ticket Detail",
  //     path: TICKETDETAIL,
  //   },
  //   {
  //     label: "Create Ticket",
  //     path: LOGTICKET,
  //   },
  //   {
  //     label: "ITSM",
  //     path: "/itsm",
  //   },

  //   {
  //     label: "Create Category",
  //     path: ADDCATEGORY,
  //   },
  //   {
  //     label: "Create Sub Category",
  //     path: ADDSUBCATEGORY,
  //   },
  //   {
  //     label: "Create Item",
  //     path: ADDITEM,
  //   },
  //   {
  //     label: "Create Company",
  //     path: ADDCOMPANY,
  //   },
  //   {
  //     label: "Assign Project Manager",
  //     path: ADDPROJECTMANAGER,
  //   },
  //   {
  //     label: "Assign Consultant",
  //     path: ADDTECHNICIAN,
  //   },
  //   {
  //     label: "Assign Approver",
  //     path: APPROVER,
  //   },

  //   {
  //     label: "Create User",
  //     path: ADDUSER,
  //   },
  //   {
  //     label: "Assign Consultant",
  //     path: ADD_TECHNICIAN_MANAGER,
  //   },

  //   {
  //     label: "Approval Report",
  //     path: TICKET_REPORT,
  //   },
  //   {
  //     label: "Logout",
  //     path: LOGIN,
  //   },
  //   {
  //     label: "User Roles",
  //     path: USER_ROLES,
  //   },
  //   {
  //     label:
  //       props.LOGGED_IN_DATA.USER_TYPE?.includes(1) ||
  //       props.LOGGED_IN_DATA.USER_TYPE?.includes(2)
  //         ? "Find Ticket"
  //         : "Additional Tasks",
  //     path: ADD_TASK,
  //   },
  //   {
  //     label: "Add Employees",
  //     path: ADD_EMPLOYEES,
  //   },
  // ];

  const [tempRoutes, setTempRoutes] = React.useState([]);
  React.useEffect(() => {
    setTempRoutes([
      {
        label: "Dashboard",
        path: EMPLOYEEDASHBOARD,
      },
      {
        label: "Dashboard",
        path: DASHBOARD,
      },
      {
        label: "Ticket Detail",
        path: TICKETDETAIL,
      },
      {
        label: "Create Ticket",
        path: LOGTICKET,
      },
      {
        label: "ITSM",
        path: "/itsm",
      },

      {
        label: "Create Category",
        path: ADDCATEGORY,
      },
      {
        label: "Create Sub Category",
        path: ADDSUBCATEGORY,
      },
      {
        label: "Create Item",
        path: ADDITEM,
      },
      {
        label: "Create Company",
        path: ADDCOMPANY,
      },
      {
        label: "Assign Project Manager",
        path: ADDPROJECTMANAGER,
      },
      {
        label: "Assign Consultant",
        path: ADDTECHNICIAN,
      },
      {
        label: "Assign Approver",
        path: APPROVER,
      },

      {
        label: "Create User",
        path: ADDUSER,
      },
      {
        label: "Assign Consultant",
        path: ADD_TECHNICIAN_MANAGER,
      },

      {
        label:
          props.LOGGED_IN_DATA.USER_TYPE?.includes(1) ||
          props.LOGGED_IN_DATA.USER_TYPE?.includes(2)
            ? "Find Ticket"
            : "Approval Report",
        path: TICKET_REPORT,
      },
      {
        label: "Logout",
        path: LOGIN,
      },
      {
        label: "User Roles",
        path: USER_ROLES,
      },
      {
        label: "Additional Tasks",
        path: ADD_TASK,
      },
      {
        label: "Add Employees",
        path: ADD_EMPLOYEES,
      },
      {
        label: "Ticket Status Report",
        path: TICKET_STATUS_REPORT,
      },
    ]);

    console.log(
      "asdhbasdhjasdas",
      props.LOGGED_IN_DATA.USER_TYPE?.includes(1) ||
        props.LOGGED_IN_DATA.USER_TYPE?.includes(2)
    );
  }, [props.LOGGED_IN_DATA]);

  const [notificationData, setNotificationData] = React.useState([]);
  const [notificationCount, setNotificationCount] = React.useState(null);
  React.useEffect(() => {
    socket.emit("join", { USER_ID: props.LOGGED_IN_DATA.USER_ID });
    socket.on("notifications", function (data) {
      console.log("Asdhabsdhasdasd", data);

      sessionStorage.setItem("NOTIFICATION_DATA", JSON.stringify(data));

      if (data && data.length > 0) {
        setNotificationData(data);
        let tempCount = 0;
        data.map((val) => {
          if (val.SEEN == false) {
            tempCount += 1;
          }
        });
        setNotificationCount(tempCount);
      }
    });
    // debouncedHandleRefresh();
  }, [props.LOGGED_IN_DATA.USER_ID]);

  // function debounce(func, delay) {
  //   let timer;
  //   return function (...args) {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(this, args);
  //     }, delay);
  //   };
  // }

  // // Example function you want to call after the last refresh
  // function handleRefresh() {
  //    let data = sessionStorage.getItem("NOTIFICATION_DATA");
  //    data = JSON.parse(data);
  //    if (data) {
  //      data.map((val) => {
  //        if (val.SEEN == false) {
  //          toast(val.DESCRIPTION, {
  //            position: "top-right",
  //            autoClose: 5000,
  //            hideProgressBar: false,
  //            closeOnClick: true,
  //            pauseOnHover: true,
  //            onClick: () => {
  //              handleIconClick(val);
  //              changeNotificationSeen(val.NOTIFICATION_ID);
  //            },
  //            draggable: true,
  //            progress: undefined,
  //            theme: "light",
  //            transition: Bounce,
  //          });
  //        }
  //      });
  //    }
  //   console.log("Refresh completed, function executed.");
  // }

  // // Create a debounced version of the function
  // const debouncedHandleRefresh = debounce(handleRefresh, 1000);

  // Simulating the refresh
  // function onRefresh() {
  //   console.log("Page is refreshing...");
  //   debouncedHandleRefresh(); // This will only call after the last refresh event
  // }

  const handleIconClick = async (row) => {
    let tktData = await axios(
      AXIOS.defaultPort + AXIOS.getTicketById + row.TICKET_ID
    );
    tktData = tktData.data;

    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getTicketRoles +
          props.LOGGED_IN_DATA.USER_ID +
          "&TICKET_ID=" +
          row.TICKET_ID
      )
      .then((response) => {
        let temp = tktData.filter((val) => val.TICKET_ID == row.TICKET_ID);
        temp[0] = { ...temp[0], ...response.data };
        console.log("jgshfjsgfjhf", temp);

        navigate("/v1/dashboard/ticketdetail", {
          state: {
            row: temp,
          },
        });
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  const changeNotificationSeen = (notificationID) => {
    let tempNotificationData = sessionStorage.getItem("NOTIFICATION_DATA");
    tempNotificationData = JSON.parse(tempNotificationData);
    console.log("Asdmhbasdjasdas", tempNotificationData);

    const index = tempNotificationData.findIndex(
      (val) => val.NOTIFICATION_ID == notificationID
    );

    tempNotificationData[index].SEEN = true;

    setNotificationData(tempNotificationData);

    socket.emit("notificationSeen", {
      NOTIFICATION_ID: notificationID,
      USER_ID: props.LOGGED_IN_DATA.USER_ID,
    });
  };

  const [notificationSeenLoading, setNotificationSeenLoading] =
    React.useState(false);
  const [notificationDeleteLoading, setNotificationDeleteLoading] =
    React.useState(false);
  const MarkAllNotificationRead = () => {
    if (notificationSeenLoading == true) return;
    setNotificationSeenLoading(true);
    axios
      .post(AXIOS.defaultPort + AXIOS.notificationMarkAsRead, {
        EMP_ID: props.LOGGED_IN_DATA.USER_ID,
        NOTIFICATION_ID: [],
      })
      .then((response) => {
        setNotificationSeenLoading(false);
        let tempNotificationData = [...notificationData];

        tempNotificationData.map((val) => {
          val.SEEN = true;
        });
        setNotificationData(tempNotificationData);
        sessionStorage.setItem(
          "NOTIFICATION_DATA",
          JSON.stringify(tempNotificationData)
        );
      })
      .catch((err) => {
        console.log("ASdasbdsa", err);
      });
  };
  const deleteAllNotificationRead = () => {
    if (notificationDeleteLoading == true) return;
    setNotificationDeleteLoading(true);
    axios
      .post(AXIOS.defaultPort + AXIOS.deleteNotification, {
        EMP_ID: props.LOGGED_IN_DATA.USER_ID,
        NOTIFICATION_ID: [],
      })
      .then((response) => {
        console.log("ASdasjbhdashda", response.data);

        setNotificationDeleteLoading(false);
        setNotificationData([]);
        setNotificationCount(null);

        // socket.emit("join", { USER_ID: props.LOGGED_IN_DATA.USER_ID });
        // toast("Notification Deleted", {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   onClick: () => {
        //     handleIconClick(val);
        //     changeNotificationSeen(val.NOTIFICATION_ID);
        //   },
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        //   transition: Bounce,
        // });
      })
      .catch((err) => {
        console.log("ASdasbdsa", err);
      });
  };

  return (
    <Box sx={{ width: "100%", marginBottom: 8 }}>
      <AppBar
        position="fixed"
        // sx={{}}
        sx={{
          backgroundColor: "#fff",
          // width: `calc(100% - ${props.drawerWidth}px)`,
          // ml: `${props.drawerWidth}px`,
        }}
      >
        <Toolbar variant="dense">
          {/* <Typography variant="h6" color="inherit" component="div">
            Photos
          </Typography> */}
          {/* {!breakPointlg && ( */}
          {/* <IconButton
            onClick={() => {
              handleDrawerToggle();
            }}
          > */}
          {/* <img
              src={Icons.Hamburger_icon_black}
              style={{
                width: 24,
                height: 16,
              }}
            /> */}
          {props.LOGGED_IN_DATA?.COMPANY_LOGO ? (
            <img
              src={
                AXIOS.defaultPort +
                "Support_Portal_api/COMPANY_LOGO/" +
                props.LOGGED_IN_DATA?.COMPANY_LOGO
              }
              style={{
                width: 55,
                height: 55,
                cursor: "pointer",
              }}
              onClick={() => {
                handleDrawerToggle();
              }}
            />
          ) : (
            <img
              src={Icons.Hamburger_icon_black}
              style={{
                width: 24,
                height: 16,
                cursor: "pointer",
              }}
              onClick={() => {
                handleDrawerToggle();
              }}
            />
          )}
          {/* </IconButton> */}
          {/* )} */}
          <Tooltip title="Click for Dashboard">
            <h4
              style={{ color: "black", fontStyle: "italic", cursor: "pointer" }}
              onClick={() => {
                if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
                  navigate(EMPLOYEEDASHBOARD);
                }
                if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
                  navigate(DASHBOARD);
                }
              }}
            >
              Service Portal
            </h4>
          </Tooltip>
          <h4 style={{ color: "black", fontStyle: "", marginLeft: 20 }}>
            |{" "}
            {
              tempRoutes.find((item) => item?.path == props?.ActiveScreen)
                ?.label
            }
          </h4>

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
              onClick={handleOpenUserMenu2}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsNoneRoundedIcon
                  sx={{
                    color: "gray",
                  }}
                />
              </Badge>
            </IconButton>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser2}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMountedF
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser2)}
              onClose={handleCloseUserMenu2}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  margin: 5,
                  padding: 5,
                }}
              >
                <button
                  className="signup-button"
                  style={{
                    minWidth: 120,
                    display: "flex",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    MarkAllNotificationRead();
                  }}
                >
                  {notificationSeenLoading ? (
                    <Spinner size={"sm"} />
                  ) : (
                    " Mark all as read"
                  )}
                </button>
                <button
                  className="signup-button"
                  style={{
                    minWidth: 100,
                    display: "flex",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    deleteAllNotificationRead();
                  }}
                >
                  {notificationDeleteLoading ? (
                    <Spinner size={"sm"} />
                  ) : (
                    "   Delete All"
                  )}
                </button>
              </div>
              <Divider />

              {notificationData.map((val) => {
                return (
                  <>
                    <div
                      style={{
                        minWidth: 250,
                        padding: 2,
                        paddingTop: 5,
                        paddingBottom: 5,
                        lineHeight: "10px",
                        backgroundColor: val.SEEN == false ? "#ADD8E6" : null,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleIconClick(val);
                        // console.log("Asdbashjdasdasd",val.NOTIFICATION_ID);

                        changeNotificationSeen(val.NOTIFICATION_ID);
                      }}
                      className="notification-item"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          {val.TITLE}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                          }}
                        >
                          {getRelativeTime(val.CREATED_AT)}
                        </span>
                      </div>
                      <br />
                      <span
                        style={{
                          fontSize: 12,
                        }}
                      >
                        {val.DESCRIPTION}
                      </span>
                    </div>

                    <Divider />
                  </>
                );
              })}

              {notificationData.length == 0 && (
                <div
                  style={{
                    minWidth: 250,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>Empty inbox</p>
                </div>
              )}

              {/* <MenuItem>{props.LOGGED_IN_DATA.DESIGNATION}</MenuItem>
              <Divider /> */}
            </Menu>

            <IconButton
              aria-label="show notification"
              size="large"
              color="inherit"
              sx={{ mr: 2 }}
              className="nav-bar-item"
              onClick={handleOpenUserMenu}
            >
              {/* <Badge badgeContent={4} color="error"> */}
              {/* <LoginRoundedIcon
                onClick={() => logoutSession("SINGLE")}
                sx={{
                  color: COLORS.white,
                }}
              /> */}

              <img src={Icons.profile_img} />
              {/* </Badge> */}
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMountedF
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>Welcome, {props.LOGGED_IN_DATA.USER_NAME}</MenuItem>
              <MenuItem>({props.LOGGED_IN_DATA.USER_ID})</MenuItem>
              <Divider />
              {/* <MenuItem>{props.LOGGED_IN_DATA.DESIGNATION}</MenuItem>
              <Divider /> */}

              <MenuItem>Ph: {props.LOGGED_IN_DATA.USER_MOBILE}</MenuItem>
              <Divider />

              <div
                onClick={() => {
                  localStorage.removeItem("SUPPORT_DATA");
                  navigate("/");
                  sessionStorage.removeItem("SELECTED_FILTER");
                  sessionStorage.removeItem("SELECTED_SUB_FILTER");
                  sessionStorage.removeItem("NOTIFICATION_DATA");
                }}
              >
                <MenuItem>Logout</MenuItem>
              </div>
            </Menu>
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
    </Box>
  );
}
const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(Header);
