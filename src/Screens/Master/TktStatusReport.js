import React, { useEffect, useRef, useState } from "react";
import MainScreen from "../../components/AppDrawer/MainScreen";
import { TICKET_STATUS_REPORT, UNASSIGNED } from "../../Utils/Routes";
import {
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  UncontrolledDropdown,
} from "reactstrap";
import Select from "react-select";
import { connect } from "react-redux";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactDataTable from "../../components/ReactDataTable/ReactDataTable";
import toast, { Toaster } from "react-hot-toast";
import { saveAs } from "file-saver";
import { Table, TableBody, TableContainer, TableHead } from "@mui/material";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Card, CardContent, CircularProgress } from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import DateRangePickerComponent from "../../components/DateRangePicker/DateRangePicker";
import constants from "../../Utils/constants";
// import { requestType } from "../../Utils/constants";
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

function TktStatusReport(props) {
  const tktStatusModuleWise = useRef(null); // Create a reference to the chart
  const lastTwoWeekAcmlishmnt = useRef(null); // Create a reference to the chart
  const upcomingTasks = useRef(null); // Create a reference to the chart

  const requestType = {
    1: "SR",
    2: "NR",
    3: "CR",
  };
  const downloadChart = (ref) => {
    const chart = ref.current; // Get the chart instance
    if (chart) {
      const url = chart.toBase64Image(); // Convert the chart to a Base64 image
      const link = document.createElement("a");
      link.href = url;
      link.download = "chart.png"; // Set the download filename
      link.click(); // Trigger the download
    }
  };

  const [GraphDateRange, setGraphDateRange] = useState({
    START_DATE: null,
    END_DATE: null,
  });

  console.log("ASdahbdjhasdas", GraphDateRange);

  const [formData, setFormData] = useState({
    CLIENT_ID: "",
    CLIENT_ID_ERROR: false,
    START_DATE: "",
    START_DATE_ERROR: false,
    END_DATE: "",
    END_DATE_ERROR: false,
  });

  const [tktStatusModuleWiseTBody, setTktStatusModuleWiseTbody] = useState({
    NEW_REQUIREMENT: [],
    CHANGE_REQUIREMENT: [],
    SERVICE_REQUIREMENT: [],
    LABELS: [],
  });
  const [tktResolveClosedTbody, setTktResolveClosedTbody] = useState({
    RESOLVED: [],
    CLOSED: [],

    LABELS: [],
  });
  const [upComingTaskTbody, setUpComingTaskTbody] = useState({
    UNDER_PROCESS_BY_SAMISHTI: [],
    CUSTOMER_ACTION: [],
    UNASSIGNED: [],

    LABELS: [],
  });
  useEffect(() => {
    getGraphsData();
  }, [GraphDateRange]);

  const getGraphsData = () => {
    console.log(
      "ASdasjndasjd",
      ` ${AXIOS.defaultPort + AXIOS.ticketsStatusModuleWise}start_date=${
        GraphDateRange.START_DATE
      }&end_date=${GraphDateRange.END_DATE}`
    );

    axios
      .get(
        ` ${AXIOS.defaultPort + AXIOS.ticketsStatusModuleWise}start_date=${
          GraphDateRange.START_DATE
        }&end_date=${GraphDateRange.END_DATE}`
      )
      .then((response) => {
        let temp = response.data;

        let TktStatusModuleNew = [];
        let TktResolveClosed = [];
        let UpComingTkt = [];
        temp.map((val) => {
          TktResolveClosed.push({
            SUB_CATEGORY: val.SUB_CATEGORY,
            SUB_CATEGORY_NAME: val.SUB_CATEGORY_NAME,
            RESOLVED:
              val.NEW_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "2") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.CHANGE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "2") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.SERVICE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "2") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0),
            CLOSED:
              val.NEW_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "4") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.CHANGE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "4") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.SERVICE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "4") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0),
          });
          UpComingTkt.push({
            SUB_CATEGORY: val.SUB_CATEGORY,
            SUB_CATEGORY_NAME: val.SUB_CATEGORY_NAME,
            UNDER_PROCESS_BY_SAMISHTI:
              val.NEW_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "5") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.CHANGE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "5") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.SERVICE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "5") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0),
            UNASSIGNED:
              val.NEW_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "0") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.CHANGE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "0") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.SERVICE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "0") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0),
            CUSTOMER_ACTION:
              val.NEW_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "12") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.CHANGE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "12") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0) +
              val.SERVICE_REQUIREMENT.reduce((acc, obj) => {
                if (obj.STATUS == "12") {
                  return acc + obj.COUNT;
                } else {
                  return acc;
                }
              }, 0),
          });

          TktStatusModuleNew.push({
            SUB_CATEGORY: val.SUB_CATEGORY,
            SUB_CATEGORY_NAME: val.SUB_CATEGORY_NAME,
            NEW_REQUIREMENT: val.NEW_REQUIREMENT.reduce(
              (acc, obj) => acc + obj.COUNT,
              0
            ),
            CHANGE_REQUIREMENT: val.CHANGE_REQUIREMENT.reduce(
              (acc, obj) => acc + obj.COUNT,
              0
            ),
            SERVICE_REQUIREMENT: val.SERVICE_REQUIREMENT.reduce(
              (acc, obj) => acc + obj.COUNT,
              0
            ),
          });
        });

        console.log("ASdasjdnjaskd", TktResolveClosed);

        setTktStatusModuleWiseTbody({
          NEW_REQUIREMENT: TktStatusModuleNew.map((item, index) => {
            return item?.NEW_REQUIREMENT;
          }),
          CHANGE_REQUIREMENT: TktStatusModuleNew.map((item, index) => {
            return item?.CHANGE_REQUIREMENT;
          }),
          SERVICE_REQUIREMENT: TktStatusModuleNew.map((item, index) => {
            return item?.SERVICE_REQUIREMENT;
          }),
          LABELS: TktStatusModuleNew.map((item, index) => {
            return item?.SUB_CATEGORY_NAME;
          }),
        });
        setTktResolveClosedTbody({
          RESOLVED: TktResolveClosed.map((item, index) => {
            return item?.RESOLVED;
          }),
          CLOSED: TktResolveClosed.map((item, index) => {
            return item?.CLOSED;
          }),
          LABELS: TktResolveClosed.map((item, index) => {
            return item?.SUB_CATEGORY_NAME;
          }),
        });
        setUpComingTaskTbody({
          UNASSIGNED: UpComingTkt.map((item, index) => {
            return item?.UNASSIGNED;
          }),
          UNDER_PROCESS_BY_SAMISHTI: UpComingTkt.map((item, index) => {
            return item?.UNDER_PROCESS_BY_SAMISHTI;
          }),
          CUSTOMER_ACTION: UpComingTkt.map((item, index) => {
            return item?.CUSTOMER_ACTION;
          }),
          LABELS: UpComingTkt.map((item, index) => {
            return item?.SUB_CATEGORY_NAME;
          }),
        });
      });
  };
  let statusFlag = [
    { flag: 0, value: "Unassigned" },
    { flag: 1, value: "TR Movement Pending" },
    { flag: 2, value: "Resolved" },
    { flag: 3, value: "Client Approval Pndg" },
    { flag: 4, value: "Closed" },
    { flag: 5, value: "Under Process by Samishti" },
    { flag: 6, value: "On Hold" },
    { flag: 7, value: "Effort Approval Pndg" },
    { flag: 8, value: "Appr Pndg" },
    { flag: 9, value: "TR Approval Pending" },
    { flag: 10, value: "Ticket Rejected" },
    { flag: 11, value: "Proposed Soln." },
    { flag: 12, value: "Cust. Action" },
    { flag: 13, value: "TR to SAP" },
  ];

  const barGraphLabels = statusFlag.map((val) => val.value);

  const convertIndianStandardIntoYMD = (date) => {
    var date = new Date(date),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  };
  const [AllClients, setAllClients] = useState([]);

  const [Tbody, setTbody] = useState([]);

  useEffect(() => {
    getAllClients();
  }, []);

  const getTicketStatusData = () => {
    let tempFormData = { ...formData };
    let ErrorFoundFlag = false;
    Object.keys(tempFormData).map((key, colIndex) => {
      if (typeof tempFormData[key] != "boolean") {
        if (tempFormData[key] == "") {
          tempFormData[key + "_ERROR"] = true;
          ErrorFoundFlag = true;
        }
      }
    });
    let timeDiff = new Date(formData.START_DATE) - new Date(formData.END_DATE);
    if (timeDiff > 0) {
      toast.error("Please select date in correct format");
      ErrorFoundFlag = true;
    }
    if (ErrorFoundFlag == false) {
      axios
        .get(
          `${
            AXIOS.defaultPort + AXIOS.ticketStatusReport + formData.CLIENT_ID
          }&START_DATE=${convertIndianStandardIntoYMD(
            formData.START_DATE
          )}&STOP_DATE=${convertIndianStandardIntoYMD(formData.END_DATE)}`
        )
        .then((response) => {
          if (response.data.length > 0) {
            let tempRes = [];
            console.log("ASdajnsdjasd", response.data);

            response.data.map((val) => {
              tempRes.push({
                ...val,
                SUBCATEGORY_NAME: `${val.SUBCATEGORY_NAME}`,
                REQUEST_TYPE: requestType[val.REQUEST],
                TOTAL_TICKETS: val.OPEN + val.ISSUE_RECEIPT,
                IN_PROGRESS: val.OPEN + val.ISSUE_RECEIPT - val.RESOLVED,
              });
            });

            tempRes.push({
              SUB_CATEGORY: "",
              SUBCATEGORY_NAME: "Grand Total",
              OPEN: tempRes.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.OPEN;
              }, 0),
              TOTAL_TICKETS: tempRes.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.TOTAL_TICKETS;
              }, 0),
              IN_PROGRESS: tempRes.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.IN_PROGRESS;
              }, 0),
              ISSUE_RECEIPT: tempRes.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.ISSUE_RECEIPT;
              }, 0),
              RESOLVED: tempRes.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.RESOLVED;
              }, 0),
            });
            console.log("Asdasdaskasdnkadkhajs", tempRes);

            setTbody(tempRes);
          } else {
            toast.error("No data found");
          }
        })
        .catch((err) => {
          console.log("adasd", err);
        });
    }
    setFormData(tempFormData);
  };
  const getAllClients = () => {
    let url = "";
    if (
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
      props.LOGGED_IN_DATA.USER_TYPE?.includes(0)
    ) {
      url = AXIOS.defaultPort + AXIOS.getAllClient;
    } else {
      if (
        props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
        props.LOGGED_IN_DATA.USER_TYPE?.includes(1)
      ) {
        url =
          AXIOS.defaultPort +
          AXIOS.getClientForTechnicianMap +
          props.LOGGED_IN_DATA.USER_ID;
      }
      if (
        props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
        props.LOGGED_IN_DATA.USER_TYPE?.includes(1)
      ) {
        url =
          AXIOS.defaultPort +
          AXIOS.getClientForTechnicianMap +
          props.LOGGED_IN_DATA.USER_ID;
      }
      if (
        props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
        props.LOGGED_IN_DATA.USER_TYPE?.includes(3)
      ) {
        url =
          AXIOS.defaultPort +
          AXIOS.getClientByPM +
          props.LOGGED_IN_DATA.USER_ID;
      }
    }
    axios
      .get(
        url
        // + props.LOGGED_IN_DATA.USER_ID
      )
      .then((res) => {
        let temp = [...res.data];
        temp.map((val) => {
          val.label = val.COMPANY_NAME;
          val.value = val.CLIENT_ID;
        });
        setAllClients(temp);
      });
  };
  const columns = [
    {
      name: "Module",
      selector: (val) => val.SUB_CATEGORY,
      sortable: false,
      cell: (val) => (
        <>
          <span>{val.SUBCATEGORY_NAME}</span>
          {val.SUB_CATEGORY != "" && <span>({val.SUB_CATEGORY})</span>}
        </>
      ),
      // width: "80px",
    },
    {
      name: "Open",
      selector: (val) => val.OPEN,
      sortable: false,
      cell: (val) => <span>{val.OPEN}</span>,
      // width: "80px",
    },
    {
      name: "Issue Receipt",
      selector: (val) => val.ISSUE_RECEIPT,
      sortable: false,

      cell: (val) => <span>{val.ISSUE_RECEIPT}</span>,
      // width: "80px",
    },
    {
      name: "Total Tickets",
      selector: (val) => val.TOTAL_TICKETS,
      sortable: false,

      cell: (val) => <span>{val.TOTAL_TICKETS}</span>,
      // width: "80px",
    },
    {
      name: "Resolved",
      selector: (val) => val.RESOLVED,
      sortable: false,

      cell: (val) => <span>{val.RESOLVED}</span>,
      // width: "80px",
    },
    {
      name: "In Progress",
      selector: (val) => val.IN_PROGRESS,
      sortable: false,

      cell: (val) => <span>{val.IN_PROGRESS}</span>,
      // width: "80px",
    },
  ];
  const CsvHeader = [
    {
      name: "Sub Category",
      selector: "SUBCATEGORY_NAME",
    },

    {
      name: "Request Type",
      selector: "REQUEST_TYPE",
    },

    {
      name: "Open",
      selector: "OPEN",
    },

    {
      name: "Issue Receipt",
      selector: "ISSUE_RECEIPT",
    },
    {
      name: "Total Ticket",
      selector: "TOTAL_TICKETS",
    },
    {
      name: "Resolved",
      selector: "RESOLVED",
    },
    {
      name: "In Progress",
      selector: "IN_PROGRESS",
    },
  ];

  const handleExcelExport = () => {
    let excelData = [...Tbody];

    console.log("Asdhasdbhjsadasd", excelData);

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
                  item[column.selector] == true ? "Active" : "Inactive";
              } else {
                cellValue = item[column.selector];
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
      saveAs(blob, "Ticket Status Report.csv"); // Use the saveAs function to download the CSV file
    }
  };

  const CsvHeaderTktDetails = [
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
    // {
    //   name: "Created By Contact",
    //   selector: "CREATED_BY_CONTACT",
    // },
    // {
    //   name: "Created By Email",
    //   selector: "CREATED_BY_EMAIL",
    // },
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
      selector: "ASSIGNED_DATE",
    },
    {
      name: "Flag",
      selector: "FLAG",
    },
    {
      name: "Status",
      selector: "STATUS",
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
      name: "Created Date",
      selector: "LOGGED_DATE",
    },
    {
      name: "Resolved Date",
      selector: "RESOLVED_TIME",
    },
  ];
  const handleTktDetailExport = (Type) => {
    axios
      .get(
        `${
          AXIOS.defaultPort + AXIOS.ticketStatusDetails + formData.CLIENT_ID
        }&START_DATE=${convertIndianStandardIntoYMD(
          formData.START_DATE
        )}&STOP_DATE=${convertIndianStandardIntoYMD(
          formData.END_DATE
        )}&TYPE=${Type}`
      )
      .then((res) => {
        let tempResponse = [...res.data];

        tempResponse.map((val) => {
          if (val.PENDING_WITH_NAME) {
            val.PENDING_WITH = val.PENDING_WITH_NAME.join(", ");
          }
          if (val.CC_EMAIL) {
            val.CC_EMAIL = val.CC_EMAIL.map((item) => item.EMAIL_ID).join(", ");
          }
          if (val.LOGGED_DATE) {
            val.LOGGED_DATE = new Date(val.LOGGED_DATE).toDateString();
          }
          if (val.ASSIGNED_DATE) {
            val.ASSIGNED_DATE = new Date(val.ASSIGNED_DATE).toDateString();
          }
          if (val.RESOLVED_TIME) {
            val.RESOLVED_TIME = new Date(val.RESOLVED_TIME).toDateString();
          }

          if (val.PRIORITY) {
            val.PRIORITY = constants.priorityText[val.PRIORITY];
          }
          if (val.STATUS) {
            val.STATUS =
              constants.statusFlag.find((item) => item.flag == val.FLAG)
                .value || "";
          }

          // delete val.PENDING_WITH;
        });

        let excelData = [...tempResponse];

        console.log("Asdhasdbhjsadasd", excelData);

        if (excelData.length > 0) {
          // Exclude the "Action" column from csvColumns
          const csvColumns = CsvHeaderTktDetails.filter(
            (column) => column.name !== "Action"
          ).map((column) => column.name);

          const csvRows = excelData.map((item) =>
            csvColumns.map((columnName) => {
              const column = CsvHeaderTktDetails.find(
                (col) => col.name === columnName
              );
              if (column) {
                let cellValue = "";
                if (typeof column.name === "function") {
                  cellValue = column.selector(item);
                } else {
                  cellValue = item[column.selector] || "";
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
          saveAs(blob, Type + " Ticket Status Report.csv"); // Use the saveAs function to download the CSV file
        }

        console.log("ASdasndjksa", tempResponse);
      });
  };
  return (
    <MainScreen drawerWidth={282} Activekey={TICKET_STATUS_REPORT}>
      <Toaster />
      <div className="user-input-container">
        <div className="row user-sub-input-container">
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label">
              Customer<span className="required-filed">*</span>
            </Label>
            <CustomSelect
              value={
                formData.CLIENT_ID == ""
                  ? ""
                  : AllClients.find((val) => val.value == formData.CLIENT_ID)
              }
              options={AllClients}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  CLIENT_ID: e.value,
                  CLIENT_ID_ERROR: false,
                }));
              }}
            />
            {formData?.CLIENT_ID_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Customer
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label">
              Start Date<span className="required-filed">*</span>
            </Label>
            <br />
            <DatePicker
              className="form-control"
              placeholderText="Select Start Date"
              selected={
                formData && formData.START_DATE
                  ? new Date(formData.START_DATE)
                  : ""
              }
              onChange={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  START_DATE: date,
                  START_DATE_ERROR: false,
                }));
              }}
            />
            {formData?.START_DATE_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select start Date
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label">
              End Date<span className="required-filed">*</span>
            </Label>
            <br />
            <DatePicker
              className="form-control"
              selected={
                formData && formData.END_DATE ? new Date(formData.END_DATE) : ""
              }
              placeholderText="Select End Date"
              onChange={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  END_DATE: date,
                  END_DATE_ERROR: false,
                }));
                //   setStartDate(
                //     (prevStartDate) => ({
                //       ...prevStartDate,
                //       BEAT_PLAN_DATE: date,
                //     }),
                //     setShowDate(date)
                //   );
              }}
            />
            {formData?.END_DATE_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select end Date
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label"></Label>
            <br />
            <button
              onClick={(e) => {
                getTicketStatusData();
              }}
              style={{
                backgroundColor: "#219bcc",
                marginTop: 15,
                padding: "2%",
                margin: "2%",
                width: "30%",
              }}
              className="col adduser-button-style"
            >
              View
            </button>
            <ButtonGroup>
              <UncontrolledDropdown>
                <DropdownToggle
                  caret
                  style={{
                    backgroundColor: "#219bcc",
                  }}
                >
                  Export{" "}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Select Export Type</DropdownItem>
                  <DropdownItem divider />

                  <DropdownItem
                    onClick={() => {
                      handleExcelExport();
                    }}
                  >
                    Overall summery
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      handleTktDetailExport("OPEN");
                    }}
                  >
                    Open Tickets detail
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      handleTktDetailExport("ISSUE_RECEIPT");
                    }}
                  >
                    Issue receipt Tickets detail
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      handleTktDetailExport("RESOLVED");
                    }}
                  >
                    Resolved Tickets detail
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </ButtonGroup>
          </div>
          <div style={{ position: "relative" }}>
            {/* <button
              style={{
                position: "absolute",
                top: "0px",
                right: "200px",
                width: "100px",
                height: "35px",
                cursor: "pointer",
                backgroundColor: "#219bcc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                zIndex: 0,
                fontSize: 13,
              }}
              // onClick={handleExport}
              onClick={() => {
                handleExcelExport();
              }}
            >
              Excel Export
            </button> */}
          </div>
          {/* <ReactDataTable
            columns={columns}
            data={Tbody}
            loading={true}
            pageCount={50}
          /> */}
          <TableContainer
            className="horizontal-scroll-table"
            stickyHeader
            style={{
              marginTop: 50,
            }}
          >
            <Table aria-label="customized table" stickyHeader>
              <TableHead className="scroll-effect-header" stickyHeader>
                <tr
                  style={{
                    backgroundColor: "red",
                    height: 30,
                  }}
                >
                  {columns.map((col, index) => (
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
                      {col.name}
                    </th>
                  ))}
                </tr>
              </TableHead>
              <TableBody>
                {Tbody.map((val, rowIndex) => {
                  return (
                    <tr
                      key={rowIndex}
                      style={{
                        backgroundColor:
                          val.SUB_CATEGORY == "" ? "#219bcc" : null,
                        color: val.SUB_CATEGORY == "" ? "#fff" : null,
                      }}
                    >
                      <td
                        className="dashboard-td-font"
                        style={{
                          textAlign: "center",
                          minWidth: 10,
                          color: val.SUB_CATEGORY == "" ? "#fff" : null,
                        }}
                      >
                        {val.SUBCATEGORY_NAME}- {val.REQUEST_TYPE}
                      </td>
                      <td
                        className="dashboard-td-font"
                        style={{
                          textAlign: "center",
                          minWidth: 10,
                          color: val.SUB_CATEGORY == "" ? "#fff" : null,
                        }}
                      >
                        {val.OPEN}
                      </td>
                      <td
                        className="dashboard-td-font"
                        style={{
                          textAlign: "center",
                          minWidth: 10,
                          color: val.SUB_CATEGORY == "" ? "#fff" : null,
                        }}
                      >
                        {val.ISSUE_RECEIPT}
                      </td>
                      <td
                        className="dashboard-td-font"
                        style={{
                          textAlign: "center",
                          minWidth: 10,
                          color: val.SUB_CATEGORY == "" ? "#fff" : null,
                        }}
                      >
                        {val.TOTAL_TICKETS}
                      </td>
                      <td
                        className="dashboard-td-font"
                        style={{
                          textAlign: "center",
                          minWidth: 10,
                          color: val.SUB_CATEGORY == "" ? "#fff" : null,
                        }}
                      >
                        {val.RESOLVED}
                      </td>
                      <td
                        className="dashboard-td-font"
                        style={{
                          textAlign: "center",
                          minWidth: 10,
                          color: val.SUB_CATEGORY == "" ? "#fff" : null,
                        }}
                      >
                        {val.IN_PROGRESS}
                      </td>
                    </tr>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 17,
                fontWeight: "bold",
                padding: 10,
              }}
            >
              Select Date Range
            </p>
            <DateRangePickerComponent
              dateRange={GraphDateRange}
              setDateRange={setGraphDateRange}
            />
          </div>
        </div>
        <Card sx={{ m: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
              }}
            >
              Ticket Status Module wise
            </p>
            <button
              onClick={() => {
                downloadChart(tktStatusModuleWise);
              }}
              style={{ marginTop: "20px" }}
              className="signup-button"
            >
              Download
            </button>
          </div>
          <Bar
            ref={tktStatusModuleWise}
            data={{
              labels: tktStatusModuleWiseTBody.LABELS,
              datasets: [
                {
                  label: "New Requirement",
                  backgroundColor: "#024CAA",
                  borderWidth: 1,
                  hoverBackgroundColor: "#024CAA",
                  hoverBorderColor: "#024CAA",
                  data: tktStatusModuleWiseTBody.NEW_REQUIREMENT,
                },
                {
                  label: "Service Request",
                  backgroundColor: "#F3C623",
                  borderWidth: 1,
                  hoverBackgroundColor: "#F3C623",
                  hoverBorderColor: "#F3C623",
                  data: tktStatusModuleWiseTBody.SERVICE_REQUIREMENT,
                },
                {
                  label: "Change Request",
                  backgroundColor: "#72BF78",
                  borderWidth: 1,
                  hoverBackgroundColor: "#72BF78",
                  hoverBorderColor: "#72BF78",
                  data: tktStatusModuleWiseTBody.CHANGE_REQUIREMENT,
                },
              ],
            }}
            options={{
              plugins: {
                datalabels: {
                  anchor: "end", // Anchors the label
                  align: "top", // Aligns it to the top
                  color: "#000", // Text color
                  font: {
                    weight: "bold",
                  },
                  formatter: (value) => value, // Display the value as is
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Card>

        <Card sx={{ m: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
              }}
            >
              Last Two Weeks Accomplishment
            </p>
            <button
              onClick={() => {
                downloadChart(lastTwoWeekAcmlishmnt);
              }}
              style={{ marginTop: "20px" }}
              className="signup-button"
            >
              Download
            </button>
          </div>

          <Bar
            ref={lastTwoWeekAcmlishmnt}
            data={{
              labels: tktResolveClosedTbody.LABELS,
              datasets: [
                {
                  label: "Resolved",
                  backgroundColor: "#024CAA",
                  borderWidth: 1,
                  hoverBackgroundColor: "#024CAA",
                  hoverBorderColor: "#024CAA",
                  data: tktResolveClosedTbody.RESOLVED,
                },
                {
                  label: "Closed",
                  backgroundColor: "#EC8305",
                  borderWidth: 1,
                  hoverBackgroundColor: "#EC8305",
                  hoverBorderColor: "#EC8305",
                  data: tktResolveClosedTbody.CLOSED,
                },
              ],
            }}
            options={{
              plugins: {
                datalabels: {
                  anchor: "end", // Anchors the label
                  align: "top", // Aligns it to the top
                  color: "#000", // Text color
                  font: {
                    weight: "bold",
                  },
                  formatter: (value) => value, // Display the value as is
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Card>

        <Card sx={{ m: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: "bold",
                padding: 10,
              }}
            >
              Upcoming Task
            </p>
            <button
              onClick={() => {
                downloadChart(upcomingTasks);
              }}
              style={{ marginTop: "20px" }}
              className="signup-button"
            >
              Download
            </button>
          </div>

          <Bar
            ref={upcomingTasks}
            data={{
              labels: upComingTaskTbody.LABELS,
              datasets: [
                {
                  label: "Unassigned",
                  backgroundColor: "#024CAA",
                  borderWidth: 1,
                  hoverBackgroundColor: "#024CAA",
                  hoverBorderColor: "#024CAA",
                  data: upComingTaskTbody.UNASSIGNED,
                },
                {
                  label: "Cust. Action",
                  backgroundColor: "#EC8305",
                  borderWidth: 1,
                  hoverBackgroundColor: "#EC8305",
                  hoverBorderColor: "#EC8305",
                  data: upComingTaskTbody.CUSTOMER_ACTION,
                },
                {
                  label: "Under Process by samishti",
                  backgroundColor: "#EC8305",
                  borderWidth: 1,
                  hoverBackgroundColor: "#EC8305",
                  hoverBorderColor: "#EC8305",
                  data: upComingTaskTbody.UNDER_PROCESS_BY_SAMISHTI,
                },
              ],
            }}
            options={{
              plugins: {
                datalabels: {
                  anchor: "end", // Anchors the label
                  align: "top", // Aligns it to the top
                  color: "#000", // Text color
                  font: {
                    weight: "bold",
                  },
                  formatter: (value) => value, // Display the value as is
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Card>
      </div>
    </MainScreen>
  );
}

const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(TktStatusReport);
