import React, { useEffect, useState } from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import IMAGES from "../../assets/IMAGES";
import Icons from "../../assets/Icons";
import Collapsible from "react-collapsible";
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
  TURN_AROUND_TIME_MAPPING,
  TURN_AROUND_TIME,
  USER_ROLES,
  ADD_TASK,
  ADD_EMPLOYEES,
  TICKET_STATUS_REPORT,
} from "../../Utils/Routes";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import QueueIcon from "@mui/icons-material/Queue";
import LogoutIcon from "@mui/icons-material/Logout";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import AddCardIcon from "@mui/icons-material/AddCard";
import { connect } from "react-redux";
import AXIOS from "../../Utils/AXIOS";

function AppDrawerEmployee(props) {
  const navigate = useNavigate();

  const breakPointlg = useMediaQuery(useTheme().breakpoints.up("lg"));

  const handleDrawerToggle = () => {
    props.toggleDrawer(!props.showDrawer);
  };

  const [RoutesList, setRouteList] = useState([]);

  useEffect(() => {
    ShowHideRoutes();
  }, [props.LOGGED_IN_DATA]);

  console.log("asdabsdjasdasdasd", props.LOGGED_IN_DATA.USER_TYPE);

  // const [ShowHideRoutes,setShowHideRoutes]=useState([])

  const ShowHideRoutes = () => {
    let tempRoutes = [
      {
        label: "Dashboard",
        icon: <DashboardOutlinedIcon />,
        path: EMPLOYEEDASHBOARD,
        // SHOW: true,
        SHOW: props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" ? true : false,
        SUB_ROUTES: [],
      },
      {
        label: "Dashboard",
        icon: <DashboardOutlinedIcon />,
        path: DASHBOARD,
        SHOW: props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER" ? true : false,
        SUB_ROUTES: [],
      },
      {
        label: "Create Ticket",
        icon: <QueueIcon />,
        path: LOGTICKET,
        SHOW: !(
          props.LOGGED_IN_DATA.USER_TYPE?.includes(6) &&
          props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
        )
          ? true
          : false,
        SUB_ROUTES: [],
      },
      // {
      //   label: "ITSM",
      //   icon: <QueueIcon />,
      //   path: "/itsm",
      //   SHOW:
      //     (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
      //       props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
      //     (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
      //       props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
      //       ? true
      //       : false,
      //   SUB_ROUTES: [],
      // },
      {
        label: "Master",
        icon: <GroupAddIcon />,
        path: EMPLOYEEDASHBOARD,
        SHOW: false,
        SUB_ROUTES: [
          {
            sub_label: "Create Category",
            sub_icon: <AddBusinessIcon />,
            sub_path: ADDCATEGORY,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "Create Sub Category",
            sub_icon: <AddToPhotosIcon />,
            sub_path: ADDSUBCATEGORY,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "Create Item",
            sub_icon: <AddCardIcon />,
            sub_path: ADDITEM,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "Create Company",
            sub_icon: <AddCardIcon />,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,

            sub_path: ADDCOMPANY,
          },
          {
            sub_label: "Assign Project Manager",
            sub_icon: <AddCardIcon />,
            sub_path: ADDPROJECTMANAGER,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "Assign Consultant",
            sub_icon: <AddCardIcon />,
            sub_path: ADDTECHNICIAN,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "Assign Approver",
            sub_icon: <AddBusinessIcon />,
            sub_path: APPROVER,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(3) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },

          {
            sub_label: "Create User",
            sub_icon: <AddCardIcon />,
            sub_path: ADDUSER,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(3) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "Assign Consultant",
            sub_icon: <AddCardIcon />,
            sub_path: ADD_TECHNICIAN_MANAGER,
            SHOW:
              props.LOGGED_IN_DATA.USER_TYPE?.includes(3) &&
              props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
                ? true
                : false,
          },
          {
            sub_label: "TAT",
            sub_icon: <AddCardIcon />,
            sub_path: TURN_AROUND_TIME,
            SHOW:
              ((props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
                props.LOGGED_IN_DATA.USER_TYPE?.includes(0)) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "Customer TAT",
            sub_icon: <AddCardIcon />,
            sub_path: TURN_AROUND_TIME_MAPPING,
            SHOW:
              ((props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
                props.LOGGED_IN_DATA.USER_TYPE?.includes(0)) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") ||
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(4) &&
                props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE")
                ? true
                : false,
          },
          {
            sub_label: "User Roles",
            sub_icon: <AddCardIcon />,
            sub_path: USER_ROLES,
            SHOW:
              (props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
                props.LOGGED_IN_DATA.USER_TYPE?.includes(0)) &&
              props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
                ? true
                : false,
          },
          // {
          //   sub_label: "Add Task",
          //   sub_icon: <AddCardIcon />,
          //   sub_path: ADD_TASK,
          //   SHOW:
          //     props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" ? true : false,
          // },
          // {
          //   sub_label: "Report",
          //   sub_icon: <AddCardIcon />,
          //   sub_path: TICKET_REPORT,
          //   SHOW:
          //     props.LOGGED_IN_DATA.USER_TYPE == 0 &&
          //     props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
          //       ? true
          //       : false,
          // },
        ],
      },
      // {
      //   label: "Master",
      //   icon: <LogoutIcon />,
      //   path: APPROVER,
      //   SHOW: false,

      //   SUB_ROUTES: [],
      // },
      {
        label: "Additional Tasks",
        icon: <AssessmentIcon />,
        path: ADD_TASK,
        SHOW:
          props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
          !props.LOGGED_IN_DATA.USER_TYPE?.includes(5) &&
          !(
            props.LOGGED_IN_DATA.USER_TYPE?.includes(6) &&
            props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
          )
            ? true
            : false,
        SUB_ROUTES: [],
      },
      {
        label:
          (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) ||
            props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
            props.LOGGED_IN_DATA.USER_TYPE?.includes(5)) &&
          props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
            ? "Approval Report"
            : "Find Ticket",
        icon: <AssessmentIcon />,
        path: TICKET_REPORT,

        SHOW:
          props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
          !props.LOGGED_IN_DATA.USER_TYPE?.includes(6)
            ? true
            : false,
        SUB_ROUTES: [],
      },
      {
        label: "Ticket Status Report",
        icon: <AssessmentIcon />,
        path: TICKET_STATUS_REPORT,
        SHOW:
          (props.LOGGED_IN_DATA.USER_TYPE?.includes(0) ||
            props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
            props.LOGGED_IN_DATA.USER_TYPE?.includes(5)) &&
          props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
            ? true
            : false,
        SUB_ROUTES: [],
      },
      {
        label: "Add Employees",
        icon: <AssessmentIcon />,
        path: ADD_EMPLOYEES,
        SHOW:
          props.LOGGED_IN_DATA.USER_TYPE?.includes(6) &&
          props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
            ? true
            : false,
        SUB_ROUTES: [],
      },

      {
        label: "Logout",
        icon: <LogoutIcon />,
        path: LOGIN,
        SUB_ROUTES: [],
        SHOW: true,
      },
    ];

    tempRoutes.map((val, index) => {
      if (val.SUB_ROUTES.length > 0) {
        const data = val.SUB_ROUTES.find((item) => item.SHOW == true);

        if (data) {
          val.SHOW = true;
        } else {
          val.SHOW = false;
        }
      }
    });
    setRouteList(tempRoutes);
  };

  return (
    <Box
      sx={{
        backgroundColor: "red",
      }}
      className="main-container-scroll parent"
    >
      <Drawer
        open={props.showDrawer}
        // variant={`${breakPointlg ? "temporary" : "persistent"}`}
        variant={`temporary`}
        // variant="persistent"
        ModalProps={{
          keepMounted: false,
        }}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            zIndex: (theme) => theme.zIndex.drawer - 200,
            boxSizing: "border-box",
            width: 230,
            backgroundColor: "#001217",
          },
        }}
      >
        <div className="logo-container">
          <img
            src={IMAGES.samishti_logo}
            style={{
              width: 73,
              height: 80,
            }}
          />
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
                borderRadius: 5,
              }}
              onClick={() => {
                handleDrawerToggle();
              }}
            />
          ) : (
            <img
              src={Icons.Hamburger_icon}
              style={{
                width: 24,
                height: 16,
              }}
              onClick={() => {
                handleDrawerToggle();
              }}
            />
          )}
          {/* {!breakPointlg && ( */}

          {/* )} */}
        </div>

        <div className="back-ground-drawer child">
          <List sx={{ width: 1 }}>
            {RoutesList.map((val) => {
              return (
                <>
                  {val.SHOW == true && val.SUB_ROUTES.length <= 0 && (
                    <div
                      className="drawer-item"
                      onClick={() => {
                        if (val.path == LOGIN) {
                          localStorage.removeItem("SUPPORT_DATA");
                          navigate(val.path);
                        } else {
                          navigate(val.path);
                        }
                      }}
                    >
                      {val.icon}
                      {val.label}
                    </div>
                  )}
                  {val.SHOW == true && val.SUB_ROUTES.length > 0 && (
                    <>
                      <Collapsible
                        trigger={
                          <div className="drawer-item-collapsible-container">
                            <div className="drawer-collapsible-item">
                              {val.icon}
                              {val.label}
                            </div>
                            <ExpandMoreIcon sx={{ color: "#fff" }} />
                          </div>
                        }
                        onTriggerOpening={() => {}}
                      >
                        <div className="drawer-sub-container">
                          {val.SUB_ROUTES.map((innerVal) => {
                            return (
                              innerVal.SHOW && (
                                <div
                                  className="drawer-sub-item active"
                                  onClick={() => {
                                    console.log("checking CI/CD");
                                    navigate(innerVal.sub_path);
                                    props.toggleDrawer(false);
                                  }}
                                  style={{
                                    color:
                                      props.ActiveKey == innerVal.sub_path
                                        ? "#22AAD2"
                                        : "#000",
                                    fontWeight:
                                      props.ActiveKey == innerVal.sub_path
                                        ? "bold"
                                        : "",
                                    cursor: "pointer",
                                  }}
                                >
                                  {innerVal.sub_icon}

                                  {innerVal.sub_label}
                                </div>
                              )
                            );
                          })}
                        </div>
                      </Collapsible>
                    </>
                  )}
                </>
              );
            })}
          </List>
        </div>
      </Drawer>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(AppDrawerEmployee);
