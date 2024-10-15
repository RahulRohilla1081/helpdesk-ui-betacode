// empdashboard
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import MainScreen from "../../components/AppDrawer/MainScreen";
import { DASHBOARD, EMPLOYEEDASHBOARD } from "../../Utils/Routes";
import folderIcon from "../../assets/IMAGES/folder.png";
import "./Dashboard.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Tooltip,
} from "@mui/material";
import {
  Badge,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Modal,
  CardBody,
} from "reactstrap";
import CustomCardEmployee from "../../components/Cards/CustomCardEmployee";
import { width, Button, Col, Container, Form, Label, Row } from "reactstrap";
import Select from "react-select";

import axios from "axios";
import { TicketCountAction } from "../../redux/action/TicketCountAction";
import { AllTicketDataAction } from "../../redux/action/AllTicketDataAction";
import { connect, useDispatch } from "react-redux";
import cogoToast from "cogo-toast";
import AXIOS from "../../Utils/AXIOS";
import constants from "../../Utils/constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { fontSize } from "@mui/system";
import { saveAs } from "file-saver";
import Lottie from "react-lottie-player";

function Dashboard(props) {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [Tbody, setTbody] = useState([]);
  const [TbodyCopy, setTbodyCopy] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [rowData, setRowData] = useState([]);
  const [trEmpFlag, setTrEmpFlag] = useState(false);
  const [trTickets, setTrTickets] = useState([]);

  const [OwnCreatedData, setOwnCreatedData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [technicianData, setTechnicianData] = useState([]);
  const [approverData, setApproverData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [allTicketData, setAllTicketData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   ifTrEmpTech();
  //   getOwnData();
  //   if (props.LOGGED_IN_DATA?.USER_TYPE.includes(0)) {
  //     getTktDataByAdmin();
  //   }
  //   if (props.LOGGED_IN_DATA?.USER_TYPE.includes(1)) {
  //     getTktDataByTechnician();
  //   }
  //   if (props.LOGGED_IN_DATA?.USER_TYPE.includes(2)) {
  //     getTktDataByApprover();
  //   }
  //   if (props.LOGGED_IN_DATA?.USER_TYPE.includes(3)) {
  //     getTktDataByManager();
  //   }
  //   // setIsLoading(false);
  // }, [props.LOGGED_IN_DATA, allTicketData]);

  // useEffect(() => {
  //   let mergedData = [
  //     ...OwnCreatedData,
  //     ...trTickets,
  //     ...adminData,
  //     ...technicianData,
  //     ...approverData,
  //     ...managerData,
  //   ];

  //   let finalData = [];
  //   mergedData.map((val) => {
  //     const index = finalData.findIndex(
  //       (item) => item.TICKET_ID == val.TICKET_ID
  //     );
  //     let PENDING_STRING = "";
  //     val.PENDING_WITH?.map((user, index) => {
  //       PENDING_STRING += user.USER_NAME;
  //       // PENDING_STRING += user;

  //       if (index < val.PENDING_WITH.length - 1) {
  //         PENDING_STRING += ", ";
  //       }
  //     });
  //     val.PENDING_STRING = PENDING_STRING;
  //     if (index == -1) {
  //       finalData.push({ ...val });
  //     } else {
  //       val.ROLE.map((role) => {
  //         const RoleIndex = finalData[index].ROLE.findIndex(
  //           (roleVal) => roleVal == role
  //         );
  //         if (RoleIndex == -1) {
  //           finalData[index].ROLE.push(role);
  //         }
  //       });
  //     }
  //   });
  //   finalData.sort((a, b) => b.TICKET_ID - a.TICKET_ID);
  //   setTbodyCopy(finalData);
  //   setTbody(finalData);
  //   setDashboardCardLengths(finalData);
  // }, [
  //   OwnCreatedData,
  //   technicianData,
  //   adminData,
  //   approverData,
  //   managerData,
  //   trTickets,
  // ]);
  useEffect(() => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getDashboardTickets_emp +
          props.LOGGED_IN_DATA.USER_ID
      )
      .then((res) => {
        setIsLoading(false);
        let finalData = res.data.TICKETS;
        setTbodyCopy(finalData);
        setTbody(finalData);
        setDashboardCardLengths(finalData);
        setTrEmpFlag(res.data.TrEmpFlag);
      });
  }, []);

  // const ifTrEmpTech = async () => {
  //   // let mainData = [];
  //   const res = await axios.get(AXIOS.defaultPort + AXIOS.getAllMappedTech);
  //   let techClients = [];
  //   res.data.map((val) => {
  //     if (val.EMP_ID == props.LOGGED_IN_DATA.USER_ID)
  //       techClients.push(val.CLIENT_ID);
  //   });

  //   if (
  //     res.data.some(
  //       (val) =>
  //         val.EMP_ID == props.LOGGED_IN_DATA.USER_ID &&
  //         val.CATEGORY_ID == 1 &&
  //         val.SUB_CATEGORY_ID == 1009
  //     )
  //   ) {
  //     setTrEmpFlag(true);
  //     let allTrTickets = allTicketData.filter(
  //       (ticket) =>
  //         // ticket.FLAG == 1 &&
  //         // ticket.TR_APPROVAL == true &&
  //         // ticket.TR_APPROVED == 1
  //         // &&
  //         techClients.includes(ticket.CLIENT_ID) && ticket.TR_APPROVED == 1
  //     );
  //     allTrTickets.map((val) => {
  //       val.ROLE = "TR";
  //     });
  //     setTrTickets(allTrTickets);
  //     // mainData = allTrTickets;
  //   }
  //   // return mainData;
  // };

  // const getOwnData = async () => {
  //   await axios
  //     .get(
  //       AXIOS.defaultPort +
  //         AXIOS.getTicketbyCreatedBy +
  //         props.LOGGED_IN_DATA.USER_ID
  //     )
  //     .then(async (res) => {
  //       let tempResponse = [];
  //       res.data.map((val) => {
  //         tempResponse.push({ ...val, ROLE: ["OWN"] });
  //       });
  //       setOwnCreatedData(tempResponse);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //     });
  // };

  // const getTktDataByTechnician = async () => {
  //   await axios
  //     .get(
  //       AXIOS.defaultPort +
  //         AXIOS.getTicketForTechnician +
  //         props.LOGGED_IN_DATA?.USER_ID
  //     )
  //     .then((response) => {
  //       let tempResponse = [];
  //       response.data.map((val) => {
  //         tempResponse.push({ ...val, ROLE: [1] });
  //       });
  //       setTechnicianData(tempResponse);
  //     })
  //     .catch((err) => {
  //       getOwnData([]);
  //     });
  // };
  // const getTktDataByApprover = async () => {
  //   await axios
  //     .get(
  //       AXIOS.defaultPort +
  //         AXIOS.getTicketsForApprover +
  //         props.LOGGED_IN_DATA?.USER_ID
  //     )
  //     .then((response) => {
  //       let tempResponse = [];
  //       response.data.map((val) => {
  //         tempResponse.push({ ...val, ROLE: [2] });
  //       });
  //       setApproverData(tempResponse);
  //     })
  //     .catch((err) => {});
  // };

  // const getTktDataByAdmin = async () => {
  //   await axios
  //     .get(AXIOS.defaultPort + AXIOS.getAllTicket)
  //     .then((response) => {
  //       let tempResponse = [];
  //       response.data.map((val) => {
  //         tempResponse.push({ ...val, ROLE: [0] });
  //       });
  //       setAdminData(tempResponse);
  //     })
  //     .catch((err) => {});
  // };

  const [DashboardCardLengths, setDashboardCardLengths] = useState([]);
  // const getTktDataByManager = async () => {
  //   await axios
  //     .get(
  //       AXIOS.defaultPort +
  //         AXIOS.getTicketsForManager +
  //         props.LOGGED_IN_DATA?.USER_ID
  //     )
  //     .then((response) => {
  //       console.log("jhfsj", response.data);
  //       let tempResponse = [];
  //       response.data.map((val) => {
  //         tempResponse.push({ ...val, ROLE: [3] });
  //       });

  //       setManagerData(tempResponse);
  //     })
  //     .catch((err) => {});
  // };
  let statusFlag = [
    { flag: 0, value: "Unassigned" },
    { flag: 1, value: "TR Movement Pending" },
    { flag: 2, value: "Resolved" },
    { flag: 3, value: "Client Approval Pndg" },
    { flag: 4, value: "Closed" },
    { flag: 5, value: "Under Process by BetaCode" },
    { flag: 6, value: "On Hold" },
    { flag: 7, value: "Effort Approval Pndg" },
    { flag: 8, value: "Appr Pndg" },
    { flag: 9, value: "TR Approval Pending" },
    { flag: 10, value: "Ticket Rejected" },
    { flag: 11, value: "Proposed Soln." },
    { flag: 12, value: "Cust. Action" },
    { flag: 13, value: "TR to SAP" },
  ];

  const getStatusBadgeStyle = (statusName) => {
    switch (statusName) {
      case "1":
        return { backgroundColor: "#dc3545", color: "#fff", fontSize: 11 }; // yellow

      case "9":
        return { backgroundColor: "#dc3545", color: "#fff", fontSize: 11 }; // blue
      case "10":
        return { backgroundColor: "#dc3545", color: "#fff", fontSize: 11 }; // blue
      case "6":
      case "8":
        return { backgroundColor: "#dc3545", color: "#fff", fontSize: 11 }; // yellow
      case "2":
        return { backgroundColor: "#28a745", color: "#fff", fontSize: 11 }; // red

      case "5":
        return { backgroundColor: "#E49B0F", color: "#fff", fontSize: 11 }; // green
      case "0":
        return { backgroundColor: "#E49B0F", color: "#fff", fontSize: 11 }; // green
      case "4":
        return { backgroundColor: "#28a745", color: "#fff", fontSize: 11 }; // red
      case "3":
        return { backgroundColor: "#6c757d", color: "#fff", fontSize: 11 }; // gray
      case "7":
        return { backgroundColor: "#dc3545", color: "#fff", fontSize: 11 }; // gray
      case "11":
        return { backgroundColor: "#E49B0F", color: "#fff", fontSize: 11 }; // gray
      case "12":
        return { backgroundColor: "#E49B0F", color: "#fff", fontSize: 11 }; // gray
      case "13":
        return { backgroundColor: "#E49B0F", color: "#fff", fontSize: 11 };
      default:
        return { backgroundColor: "#6c757d", color: "#fff", fontSize: 11 }; // default gray
    }
  };
  useEffect(() => {
    props
      .TicketCountAction()
      .then((res) => {
        if (res == "success") {
          console.log("success");
        } else {
          cogoToast.error("Something went wrong 123");
        }
      })
      .catch((err) => {
        cogoToast.error("Something went wrong 12236");
      });
    // props
    //   .AllTicketDataAction()
    // axios
    //   .get(AXIOS.defaultPort + AXIOS.getAllTicket)
    //   .then((response) => {
    //     console.log("success");
    //     let tempData = [...response.data];
    //     tempData.map((val) => {
    //       val.ASSIGNED_DATE = new Date(val.ASSIGNED_DATE).toDateString();
    //     });
    //     console.log("jhsdfjsf", tempData);
    //     setAllTicketData(tempData);
    //   })
    //   .catch((err) => {
    //     // cogoToast.error("Something went wrong 32457");
    //   });
  }, []);

  const HeaderData = [
    {
      Label: "Ticket ID",
    },
    {
      Label: "Customer",
    },
    {
      Label: "Created By",
    },
    {
      Label: "Subject",
    },
    {
      Label: "Type of Request",
    },

    {
      Label: "Assigned Date",
    },
    {
      Label: "Status",
    },
    {
      Label: "Priority",
    },
    {
      Label: "Pending with",
    },
    {
      Label: "View",
    },
    {
      Label: "Module",
    },
    {
      Label: "Function",
    },
  ];

  const handleCheckboxChange = (ticketId) => {
    setTbody((prevSelectedRows) => {
      if (prevSelectedRows.includes(ticketId)) {
        return prevSelectedRows.filter((id) => id !== ticketId); // Remove ticketId from selection
      } else {
        return [...prevSelectedRows, ticketId]; // Add ticketId to selection
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allTicketIds = Tbody.map((row) => row["Ticket ID"]);
      setTbody(allTicketIds); // Select all rows
    } else {
      setTbody([]); // Deselect all rows
    }
  };

  // const filteredRows = rowData
  //   .filter((row) => {
  //     if (!statusFilter) return true; // No status filter applied
  //     return row.Status?.toLowerCase() === statusFilter.toLowerCase();
  //   })
  //   .filter((row) => {
  //     if (!searchQuery) return true; // No search query
  //     return Object.values(row)
  //       .filter((value) => typeof value === "string")
  //       .join(" ")
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase());
  //   });

  const navigate = useNavigate();
  const handleIconClick = (row) => {
    navigate("/v1/dashboard/ticketdetail", {
      state: {
        row: DashboardCardLengths.filter(
          (val) => val.TICKET_ID == row.TICKET_ID
        ),
      },
    });
  };

  const [DashboardCards, setDashboardCards] = useState([
    {
      TITLE: "UnAssigned",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      TOOLTIP_TITLE: "UnAssigned",
      FILTER_KEY: "",
      KEY: "UNASSIGNED",
      FLAG: 0,
      SHOW: false,
    },
    {
      TITLE: "TRM Pndg",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      TOOLTIP_TITLE: "TR Movement Pending",
      FILTER_KEY: "",
      KEY: "TRM_PENDING",
      FLAG: 1,
      SHOW: false,
    },
    {
      TITLE: "Resolved",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      TOOLTIP_TITLE: "Resolved",

      KEY: "OPEN",
      FLAG: 2,
      SHOW: false,
    },
    {
      TITLE: "CAP",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      TOOLTIP_TITLE: "Client Approval Pending",
      FILTER_KEY: "",
      KEY: "CAA",
      FLAG: 3,
      SHOW: false,
    },
    {
      TITLE: "Closed",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      TOOLTIP_TITLE: "Closed",
      FILTER_KEY: "",
      KEY: "OPEN",
      FLAG: 4,
      SHOW: false,
    },
    {
      TITLE: "Undr Process",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      TOOLTIP_TITLE: "Under Process",
      FILTER_KEY: "",
      KEY: "OPEN",
      FLAG: 5,
      SHOW: false,
    },
    {
      TITLE: "On Hold",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      TOOLTIP_TITLE: "On Hold",
      FILTER_KEY: "",
      KEY: "ON_HOLD",
      FLAG: 6,
      SHOW: false,
    },
    {
      TITLE: "EAP",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      KEY: "EAA",
      TOOLTIP_TITLE: "Efforts Approval pending",
      FLAG: 7,
      SHOW: false,
    },
    {
      TITLE: "Appr Pndg",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      TOOLTIP_TITLE: "Approval Pending",
      KEY: "WORK_IN_PROGRESS",
      FLAG: 8,
      SHOW: false,
    },
    {
      TITLE: "TR Appr Pndg",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      KEY: "TR_APPROVAL_PENDING",
      TOOLTIP_TITLE: "TR Approval Pending",
      FLAG: 9,
      SHOW: false,
    },
    {
      TITLE: "Tkt Rjctd",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      KEY: "TICKET REJECTED",
      TOOLTIP_TITLE: "Ticket Rejected",
      FLAG: 10,
      SHOW: false,
    },
    {
      TITLE: "Propsd. Soln.",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      KEY: "PROPOSED_SOLUTION",
      TOOLTIP_TITLE: "Proposed Solution",
      FLAG: 11,
      SHOW: false,
    },
    {
      TITLE: "Cust. Actn.",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      KEY: "CUSTOMER_ACTION",
      TOOLTIP_TITLE: "Customer Action",
      FLAG: 12,
      SHOW: false,
    },
    {
      TITLE: "TR to SAP",
      COUNT: 0,
      CLASS_NAME: "Empcard Empcard-1",
      FILTER_KEY: "",
      KEY: "TR_TO_SAP",
      TOOLTIP_TITLE: "TR to SAP",
      FLAG: 13,
      SHOW: false,
    },
    // {
    //   TITLE: "WIP",
    //   COUNT: 0,
    //   CLASS_NAME: "Empcard Empcard-4",
    //   FILTER_KEY: "",
    //   KEY: "WAITING_USER_INPUT",
    //   FLAG: 9,
    //   SHOW: false,
    // },
  ]);

  const [isFormCollapsed, setIsFormCollapsed] = useState(true);

  useEffect(() => {
    let tempDashboardCard = [...DashboardCards];

    tempDashboardCard.map((val) => {
      const Count = DashboardCardLengths.filter((item) => {
        return Number(item.FLAG) == Number(val.FLAG);
      });

      if (Count) {
        val.COUNT = Count.length;
      }
    });

    tempDashboardCard.map((val, index) => {
      if (val.COUNT == 0) {
        val.SHOW = false;
        // tempDashboardCard.splice(1, index);
      } else {
        val.SHOW = true;
      }
    });

    setDashboardCards(tempDashboardCard);
  }, [DashboardCardLengths]);

  const [IsCardActive, setIsCardActive] = useState(false);

  const handleDashboardCardClick = (CardDataFilterKey) => {
    // let tempRowData=[]
    const tempData = TbodyCopy.filter((row) => {
      if (CardDataFilterKey.toString() == "") {
        return true;
      }
      // No status filter applied
      else {
        return Number(row.FLAG) == Number(CardDataFilterKey);
      }
    });

    setTbody(tempData);

    setIsCardActive(true);
  };
  const handleSearch = (value) => {
    // let tempRowData=[]
    const tempData = TbodyCopy.filter((row) => {
      if (!value) return true; // No search query
      return Object.values(row)
        .filter((value) => typeof value === "string")
        .join(" ")
        .toLowerCase()
        .includes(value.toLowerCase());
    });

    setTbody(tempData);
  };

  // const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [assignedDateFilter, setAssignedDateFilter] = useState("");
  const [requestType, setRequestType] = useState("");
  const [SearchQueryCollapse, setSearchQueryCollapse] = useState("");

  const convertIndianStandardIntoYMD = (date) => {
    var date = new Date(date),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  const [CategoryData, setCategoryData] = useState([]);
  const [SubCategoryData, setSubCategoryData] = useState([]);
  useEffect(() => {
    handleDetailsFiltering();
  }, [
    // statusFilter,
    categoryFilter,
    assignedDateFilter,
    requestType,
    subCategoryFilter,
  ]);
  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllCategory = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllCategory).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.CATEGORY_NAME, value: val.CATEGORY_ID, ...val });
      });
      setCategoryData(temp);
    });
  };

  const getSubCategory = async (Category) => {
    let mainData = [];
    await axios
      .get(AXIOS.defaultPort + AXIOS.getSubCategory + Category)
      .then((response) => {
        let temp = [];
        response.data.SUB_CATEGORY.map((val) => {
          temp.push({
            label: val.SUB_CATEGORY_NAME,
            value: val.SUB_CATEGORY_ID,
            ...val,
          });
        });
        mainData = temp;
        setSubCategoryData(temp);
      });
    return mainData;
  };
  const handleDetailsFiltering = () => {
    const filteredRow = TbodyCopy.filter((row) => {
      // Check if the ticket ID matches the search query
      if (!searchQuery) return true; // No search query
      return row["Ticket ID"].toLowerCase().includes(searchQuery.toLowerCase());
    })
      .filter((row) => {
        // Filter by status
        if (!statusFilter) return true; // No status filter applied
        // console.log("Status Filter:", statusFilter);
        // console.log("Row Status:", row.Status.toLowerCase());
        // return row.Status.toLowerCase() === statusFilter.toLowerCase();
        return Number(row.FLAG) == Number(statusFilter);
      })
      .filter((row) => {
        // Additional filters based on request type, category, subcategory, and assigned date
        const lowerRequestType = row.REQUEST;
        const lowerCategory = row.CATEGORY_NAME?.toLowerCase();
        const lowerSubCategory = row.SUB_CATEGORY?.toLowerCase();
        const assignedDate = new Date(row.LOGGED_DATE);

        return (
          (requestType === "" ||
            Number(lowerRequestType) === Number(requestType)) &&
          (!categoryFilter || lowerCategory === categoryFilter.toLowerCase()) &&
          (!subCategoryFilter ||
            lowerSubCategory === subCategoryFilter.toLowerCase()) &&
          (!assignedDateFilter ||
            convertIndianStandardIntoYMD(assignedDateFilter) ==
              convertIndianStandardIntoYMD(assignedDate))
        );
      });

    setTbody(filteredRow);
  };

  const CsvHeader = [
    {
      name: "Ticket ID",
      selector: "TICKET_ID",
    },
    {
      name: "Reference",
      selector: "REFERENCE",
    },
    {
      name: "Created By",
      selector: "CREATED_BY_NAME",
    },
    {
      name: "Created By Contact",
      selector: "CREATED_BY_CONTACT",
    },
    {
      name: "Created By Email",
      selector: "CREATED_BY_EMAIL",
    },
    {
      name: "Company Name",
      selector: "COMPANY_NAME",
    },
    {
      name: "Subject",
      selector: "SUBJECT",
    },
    {
      name: "Type of Request",
      selector: "REQUEST_DESCRIPTION",
    },
    {
      name: "Category Name",
      selector: "CATEGORY_NAME",
    },
    {
      name: "Sub Category Name",
      selector: "SUB_CATEGORY_NAME",
    },
    {
      name: "Assigned Date",
      selector: "LOGGED_DATE",
    },
    {
      name: "Flag",
      selector: "FLAG",
    },
    {
      name: "Status",
      selector: "FLAG",
    },
    {
      name: "Priority",
      selector: "PRIORITY",
    },
    {
      name: "Pending with",
      selector: "PENDING_WITH",
    },
    {
      name: "Target Date",
      selector: "TARGET_DATE",
    },
  ];

  const handleExcelExport = () => {
    let excelData = [...Tbody];
    excelData.map((val) => {
      val.REQUEST_DESCRIPTION = constants.requestType[val.REQUEST];

      let pending = [];
      val.PRIORITY = constants.priorityText[val.PRIORITY];
      val.PENDING_WITH.map((pendg) => {
        pending.push(pendg.USER_NAME);
      });
      val.PENDING_WITH = pending;
    });

    console.log("Adasdasdas", excelData);
    // console.log(
    //   "jhsfgjsgf",
    //   excelData.filter((val) => val.TICKET_ID == "100042")
    // );
    if (excelData.length > 0) {
      // Exclude the "Action" column from csvColumns
      const csvColumns = CsvHeader.filter(
        (column) => column.name !== "Action"
      ).map((column) => column.name);

      const csvRows = excelData.map((item) =>
        csvColumns.map((columnName) => {
          const column = CsvHeader.find((col) => col.name === columnName);
          if (column) {
            let cellValue = "";
            if (typeof column.name === "function") {
              cellValue = column.selector(item);
            } else {
              if (column.name == "Status") {
                cellValue =
                  statusFlag.find(
                    (StatusVal) =>
                      StatusVal.flag == Number(item[column.selector])
                  )?.value || "";
              } else if (column.selector == "LOGGED_DATE") {
                cellValue =
                  new Date(item[column.selector]).toDateString() || "";
              } else if (column.selector == "TARGET_DATE") {
                cellValue =
                  item[column.selector] != undefined
                    ? new Date(item[column.selector]).toDateString()
                    : "";
                console.log("Asdkjabsdhjbasjdas", cellValue);
              } else {
                cellValue = item[column.selector] || "";
              }
            }
            // Wrap cell value in double quotes to handle commas
            return `"${cellValue}"`;
          }
          return ""; // Return an empty value for excluded columns
        })
      );

      const csvContent =
        csvColumns.join(",") +
        "\n" +
        csvRows.map((row) => row.join(",")).join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8",
      });
      saveAs(blob, "Tickets.csv"); // Use the saveAs function to download the CSV file
    }
  };

  return (
    <>
      <MainScreen drawerWidth={282} Activekey={EMPLOYEEDASHBOARD}>
        <div className="dashboard-main-container">
          {/* <div>
          
            <CustomCardEmployee data={props.ticketsCount} />
          </div> */}
          {/* </div> */}
          <div className="sub-container">
            {DashboardCards.map((val) => {
              return (
                val.SHOW && (
                  <Tooltip title={val.TOOLTIP_TITLE}>
                    <Card
                      onClick={() => {
                        handleDashboardCardClick(val.FLAG);
                        setStatusFilter(val.FLAG);
                      }}
                      className={val.CLASS_NAME}
                    >
                      <CardContent>
                        <div className="card-design">
                          <h4
                            style={{ color: "#fff", fontSize: 13 }}
                            className="number-count"
                          >
                            {val.COUNT}
                          </h4>
                          <div
                            style={{ color: "#fff", fontSize: 13 }}
                            // className="card-content"
                          >
                            {val.TITLE}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Tooltip>
                )
              );
            })}
          </div>
          <div className="table-container mx-3">
            <Card>
              <CardBody
                style={{
                  margin: 10,
                }}
              >
                {IsCardActive && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: -15,
                    }}
                  >
                    <p
                      style={{
                        height: "1.5vh",
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                    >
                      Awaiting Vendor Input Ticket Details
                    </p>
                    <Button
                      color="link"
                      onClick={() => {
                        setIsFormCollapsed(!isFormCollapsed);
                      }}
                    >
                      {isFormCollapsed ? (
                        <ExpandMoreIcon
                          sx={{
                            color: "#000",
                            height: "10%",
                            width: "10 %",
                          }}
                        />
                      ) : (
                        <ExpandLessIcon
                          sx={{
                            color: "#000",
                            height: "10%",
                            width: "10 %",
                          }}
                        />
                      )}
                    </Button>
                  </div>
                )}

                {!isFormCollapsed && (
                  <div>
                    <div className="content clearfix mt-4">
                      <Form>
                        <Row>
                          <Col lg="6">
                            <div className="mb-3">
                              <Label for="ticket-no">Ticket ID</Label>
                              <div className="d-flex">
                                <Input
                                  type="text"
                                  name="TICKET_NO"
                                  className="form-control"
                                  id="basicpill-lastname-input2"
                                  value={SearchQueryCollapse}
                                  onChange={(e) => {
                                    setSearchQueryCollapse(e.target.value);
                                    handleSearch(e.target.value);
                                  }}
                                  placeholder="Enter ticket id"
                                />
                              </div>
                            </div>
                          </Col>

                          <Col lg="6">
                            <div className="mb-3">
                              <Label for="basicpill-email-input4">
                                Type of Request
                              </Label>
                              <Input
                                type="select"
                                name="REQUEST_TYPE"
                                className="form-control"
                                value={requestType}
                                onChange={(e) => setRequestType(e.target.value)}
                              >
                                <option value="">Select Request</option>
                                <option value={1}>Service Request</option>
                                <option value={2}>New Requirement</option>
                                <option value={3}>Change Requirement</option>
                              </Input>
                            </div>
                          </Col>
                          <Col lg="6">
                            <div className="mb-3">
                              <Label for="basicpill-email-input4">
                                Category
                              </Label>
                              <Select
                                options={CategoryData}
                                value={CategoryData.find(
                                  (val) => val.label == categoryFilter
                                )}
                                onChange={(e) => {
                                  setCategoryFilter(e.label);
                                  getSubCategory(e.value);
                                }}
                              />
                              {/* <Input
                                type="select"
                                name="CATEGORY"
                                className="form-control"
                                value={categoryFilter}
                                onChange={(e) =>
                                  setCategoryFilter(e.target.value)
                                }
                                style={{ width: "100%" }}
                              >
                                <option value="">Select Category</option>
                                <option value="SAP">SAP</option>
                                <option value="Web Development">
                                  Web Development
                                </option>
                                <option value="SuprSales">SuprSales</option>
                                <option value="Web Application">
                                  Web Application
                                </option>
                                <option value="DLF">DLF</option>
                                <option value="Noida">Noida</option>
                              </Input> */}
                            </div>
                          </Col>
                          <Col lg="6">
                            <div className="mb-3">
                              <Label for="basicpill-email-input4">
                                Sub Category
                              </Label>
                              <Select
                                options={SubCategoryData}
                                // value={ClickedRowData?.SUB_CATEGORY_ID}
                                value={SubCategoryData.find(
                                  (val) => val.value == subCategoryFilter
                                )}
                                onChange={(e) => {
                                  setSubCategoryFilter(e.value);

                                  // getSubCategory(e.value);
                                }}
                              />
                              {/* <Input
                                type="select"
                                name="SUB_CATEGORY"
                                className="form-control"
                                id="basicpill-email-input4"
                                value={subCategoryFilter}
                                onChange={(e) =>
                                  setSubCategoryFilter(e.target.value)
                                }
                              >
                                <option value="">Select Sub Category</option>
                                <option value="PP">PP</option>
                                <option value="MM">MM</option>
                                <option value="FICO">FICO</option>
                                <option value="ABAP">ABAP</option>
                              </Input> */}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg="6">
                            <div className="mb-3">
                              <Label for="basicpill-email-input4">
                                Assigned Date
                              </Label>
                              <Input
                                type="date"
                                name="ASSIGNED_DATE"
                                className="form-control"
                                id="basicpill-email-input4"
                                value={assignedDateFilter}
                                onChange={(e) =>
                                  setAssignedDateFilter(e.target.value)
                                }
                                placeholder="Select Date"
                              />
                            </div>
                          </Col>
                          {/* 
                          <Col lg="6">
                            <div className="mb-3">
                              <Label for="basicpill-email-input4">
                                Ticket Status
                              </Label>
                              <Input
                                type="select"
                                name="STATUS"
                                className="form-control"
                                id="basicpill-email-input4"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                              >
                                <option value="">Select Status</option>
                                <option value="Open">Open</option>
                                <option value="Pending">Pending</option>
                                <option value="Close">Close</option>
                              </Input>
                            </div>
                          </Col> */}
                        </Row>
                      </Form>
                    </div>
                  </div>
                )}
              </CardBody>
              <div className="row my-4 mx-3">
                <div className="col-md-3">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    // onChange={(e) => }
                  />
                </div>
                <div className="col-md-3 offset-md-6 d-flex justify-content-end">
                  <button
                    style={{
                      marginRight: 10,
                    }}
                    onClick={() => {
                      handleExcelExport();
                    }}
                    className="signup-button"
                  >
                    Excel Export
                  </button>
                  <div className="col-md-6" style={{ marginRight: "10px" }}>
                    <Input
                      type="select"
                      className="form-control"
                      // onChange={(e) => setStatusFilter(e.target.value)}
                      value={statusFilter}
                      onChange={(e) => {
                        handleDashboardCardClick(e.target.value);
                        setStatusFilter(e.target.value);
                      }}
                      style={{ width: "105%" }}
                    >
                      <option value="">All</option>

                      {DashboardCards.map((val) => {
                        return (
                          val.SHOW == true && (
                            <option value={val.FLAG}>{val.TITLE}</option>
                          )
                        );
                      })}

                      {/* <option value={2}>Resolved</option>
                      <option value={3}>Client approval awaited</option>
                      <option value={4}>Close</option>
                      <option value={5}>Open</option>
                      <option value={6}>On hold</option>
                      <option value={7}>Efforts approval awaited</option>
                      <option value={8}>Pending</option>
                      <option value={9}>Work In Progress</option> */}
                    </Input>
                  </div>
                  {/* {props.LOGGED_IN_DATA.USER_TYPE.includes(2) && (
                    <div className="col-md-6">
                      <Input
                        type="select"
                        className="form-control"
                        // onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">Action</option>
                        <option value="Approve">Approve</option>
                        <option value="Reject">Reject</option>
                      </Input>
                    </div>
                  )} */}
                </div>
              </div>
              <TableContainer className="horizontal-scroll-table" stickyHeader>
                <Table aria-label="customized table" stickyHeader>
                  <TableHead className="scroll-effect-header" stickyHeader>
                    <tr
                      style={{
                        backgroundColor: "red",
                        height: 30,
                      }}
                    >
                      {HeaderData.map((col, index) => (
                        <th
                          key={index}
                          className="dashboard-thead-font"
                          style={{
                            textAlign: "center",
                            color: "#fff",
                            backgroundColor: "#219bcc",
                            minWidth: 60,
                          }}
                        >
                          {/* {col.Checkbox ? (
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              // checked={Tbody.length === filteredRows.length}
                            />
                          ) : (
                      
                          )} */}
                          {col.Label}
                        </th>
                      ))}
                    </tr>
                  </TableHead>

                  <TableBody>
                    {Tbody.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {/* <td style={{ textAlign: "center", color: "#31434b" }}>
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange(row["TICKET_ID"])
                            }
                            checked={Tbody.includes(row["TICKET_ID"])}
                          />
                        </td> */}
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 10,
                          }}
                        >
                          {row.TICKET_ID}
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 165,
                          }}
                        >
                          {row.COMPANY_NAME}
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 90,
                          }}
                        >
                          {row.CREATED_BY_NAME}
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 250,
                            maxWidth: 400,
                          }}
                        >
                          {row.SUBJECT}
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 100,
                          }}
                        >
                          {constants.requestType[row.REQUEST]}
                        </td>

                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 100,
                          }}
                        >
                          {new Date(row.LOGGED_DATE).toDateString()}
                        </td>
                        <td style={{ textAlign: "center", minWidth: 60 }}>
                          <span
                            className="badge dashboard-td-font"
                            style={getStatusBadgeStyle(row.FLAG)}
                          >
                            {
                              statusFlag.find(
                                (item) => item.flag == Number(row.FLAG)
                              )?.value
                            }
                          </span>
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 50,
                          }}
                        >
                          {constants.priorityText[row.PRIORITY]}
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 120,
                          }}
                        >
                          {row.PENDING_STRING}
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            cursor: "pointer",
                            textAlign: "center",
                            minWidth: 50,
                          }}
                        >
                          <VisibilityIcon
                            onClick={() => handleIconClick(row)}
                          />
                        </td>

                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "left",
                            minWidth: 155,
                          }}
                        >
                          {row.SUB_CATEGORY_NAME}
                        </td>
                        <td
                          className="dashboard-td-font"
                          style={{
                            textAlign: "center",
                            minWidth: 50,
                          }}
                        >
                          {row.CATEGORY_NAME}
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {isLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignItems: "center",
                    minHeight: "30vh",
                  }}
                >
                  <CircularProgress color="primary" />
                </div>
              )}

              {isLoading == false && Tbody.length <= 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 18,
                    marginBottom: 5,
                  }}
                >
                  No Data Found
                </div>
              )}
            </Card>
          </div>
        </div>
      </MainScreen>
    </>
  );
}

const mapStateToProps = (state) => ({
  ticketsCount: state.ticketCountData.ticketCount,
  allTickets: state.ticketData.allTickets,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {
  TicketCountAction,
  AllTicketDataAction,
})(Dashboard);
