import {
  Box,
  Card,
  Modal,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MainScreen from "../../components/AppDrawer/MainScreen";
import { TICKET_REPORT, TICKET_REPORT_VIEW } from "../../Utils/Routes";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import { saveAs } from "file-saver";
import constants from "../../Utils/constants";
import { Label } from "reactstrap";

import CloseIcon from "@mui/icons-material/Close";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import cogoToast from "cogo-toast";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactDataTable from "../../components/ReactDataTable/ReactDataTable";
import { connect } from "react-redux";

function TicketReport(props) {
  const [Tbody, setTbody] = useState([]);

  const navigate = useNavigate();

  const [FindTktModalOpen, setFindTktModalOpen] = useState(false);
  const handleFindTktModalOpen = () => setFindTktModalOpen(true);
  const handleFindTktModalClose = () => setFindTktModalOpen(false);
  const [SearchByClientModalOpen, setSearchByClientModalOpen] = useState(false);
  const handleSearchByClientModalOpen = () => setSearchByClientModalOpen(true);
  const handleSearchByClientModalClose = () =>
    setSearchByClientModalOpen(false);

  const [clientOptions, setClientOptions] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState(null);
  const [ClientTktData, setClientTktData] = useState([]);

  const [findTktID, setFindTktId] = useState({
    TICKER_ID: "",
    ERROR_FLAG: false,
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  function removeHtmlTags(str) {
    if (str) {
      return str.replace(/<\/?[^>]+(>|$)/g, "");
    }
  }

  let statusFlag = [
    { flag: 0, value: "Unassigned" },
    { flag: 1, value: "Pending for TR Movement" },
    { flag: 2, value: "Resolved" },
    { flag: 3, value: "Client Approval Pndg" },
    { flag: 4, value: "Closed" },
    { flag: 5, value: "Under Process by Samishti" },
    { flag: 6, value: "On Hold" },
    { flag: 7, value: "Effort Approval Pndg" },
    { flag: 8, value: "Appr Pndg" },
    { flag: 9, value: "TR Approval Pending" },
    { flag: 10, value: "Ticket Rejected" },
    { flag: 11, value: "Propsd Soln." },
    { flag: 12, value: "Cust. Action" },
    { flag: 13, value: "TR to SAP" },
  ];
  const HeaderData = [
    { Label: "Select", Checkbox: true },
    {
      Label: "Ticket ID",
    },
    {
      Label: "Customer",
    },
    {
      Label: "Type of Request",
    },
    {
      Label: "Category",
    },
    {
      Label: "Sub Category",
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
      Label: "View",
    },
  ];

  const HeaderDataClientTkt = [
    // { Label: "Select", Checkbox: true },
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

  const getStatusBadgeStyle = (statusName) => {
    switch (statusName) {
      case "Assigned":
      case "Work In Progress":
        return { backgroundColor: "#013220", color: "#fff" }; // blue
      case "On Hold":
      case "Pending":
        return { backgroundColor: "#dc3545", color: "#fff" }; // yellow
      case "Resolved":
      case "Open":
        return { backgroundColor: "#28a745", color: "#fff" }; // green
      case "Unassigned":
        return { backgroundColor: "#E49B0F", color: "#fff" }; // green
      case "Closed":
        return { backgroundColor: "#28a745", color: "#fff" }; // red
      case "Client Approval Awaited":
        return { backgroundColor: "#6c757d", color: "#fff" }; // gray
      case "Effort Approval Awaited":
        return { backgroundColor: "#dc3545", color: "#fff" }; // gray
      default:
        return { backgroundColor: "#6c757d", color: "#fff" }; // default gray
    }
  };

  const searchTktID = () => {
    if (findTktID.TICKER_ID == "") {
      setFindTktId((prev) => ({
        ...prev,
        ERROR_FLAG: true,
      }));
    } else {
      axios
        .get(AXIOS.defaultPort + AXIOS.getTicketById + findTktID.TICKER_ID)
        .then((res) => {
          console.log("ASdkhasbdjahd", res.data);
          if (res.data.length > 0) {
            navigate(TICKET_REPORT_VIEW, {
              state: {
                row: [{ ...res.data[0], ROLE: [] }],
              },
            });
          }
        });
    }
  };

  const columns = [
    {
      name: "Ticket ID",
      selector: (val) => val.TICKET_ID,
      sortable: false,
      width: "90px",

      // cell: (val) => (
      //   <p>
      //     <span>{val.TICKET_ID}</span>
      //   </p>
      // ),
      // width: "80px",
    },
    {
      name: "Created By",
      width: "120px",

      selector: (val) => val.CREATED_BY_NAME,
      sortable: false,
    },
    {
      name: "Created Email",
      selector: (val) => val.CREATED_BY_EMAIL,
      sortable: false,
      width: "200px",
    },
    {
      name: "Company Name",
      selector: (val) => val.COMPANY_NAME,
      sortable: false,
      width: "220px",
    },
    {
      name: "Request",
      selector: (val) => val.TYPE_OF_REQUEST,
      sortable: false,
      width: "150px",
    },
    // {
    //   name: "Request",
    //   selector: (val) => val.TYPE_OF_REQUEST,
    //   sortable: false,
    //   cell: (val) => (
    //     <VisibilityIcon
    //       onClick={() => {
    //         navigate(TICKET_REPORT_VIEW, {
    //           state: {
    //             row: [{ ...val, ROLE: [] }],
    //           },
    //         });
    //       }}
    //     />
    //   ),
    // },
    {
      name: "Category Name",
      selector: (val) => val.CATEGORY_NAME,
      sortable: false,
      width: "100px",
    },
    {
      name: "Sub Category Name",
      selector: (val) => val.SUB_CATEGORY_NAME,
      sortable: false,
      width: "180px",
    },
    {
      name: "Assigned Date",
      selector: (val) => val.ASSIGNED_DATE,
      cell: (val) => (
        <span>
          {val.ASSIGNED_DATE && new Date(val.ASSIGNED_DATE).toDateString()}
        </span>
      ),
      width: "150px",
      sortable: false,
    },
    {
      name: "Flag",
      selector: (val) => val.FLAG,
      sortable: false,
      width: "60px",
    },
    {
      name: "Status",
      selector: (val) => val.STATUS,
      sortable: false,
      width: "200px",
    },
    {
      name: "Priority",
      selector: (val) => val.PRIORITY,
      sortable: false,
      width: "80px",
    },
    {
      name: "Pending With",
      selector: (val) => val.PENDING_WITH,
      sortable: false,
      width: "140px",
    },
    {
      name: "Requirement Approved By",
      selector: (val) => val.APPROVAL1_BY,
      sortable: false,
      width: "140px",
    },
    {
      name: "Requirement Approved On",
      selector: (val) => val.APPROVAL1_ON,
      sortable: false,
      cell: (val) => (
        <span>
          {val.APPROVAL1_ON && new Date(val.APPROVAL1_ON).toDateString()}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Requirement Approved At",
      selector: (val) => val.APPROVAL1_AT,
      sortable: false,
      width: "140px",
    },
    {
      name: "Requirement Remarks",
      selector: (val) => val.APPROVAL1_REMARKS,
      sortable: false,
      width: "400px",

      cell: (val) => <span>{removeHtmlTags(val.APPROVAL1_REMARKS)}</span>,
    },
    {
      name: "Efforts",
      selector: (val) => val.EFFORTS,
      sortable: false,
      width: "80px",
    },
    {
      name: "Efforts Approved By",
      selector: (val) => val.APPROVAL2_BY,
      sortable: false,
      width: "160px",
    },
    {
      name: "Efforts Approved On",
      selector: (val) => val.APPROVAL2_ON,
      width: "150px",

      cell: (val) => (
        <span>
          {val.APPROVAL2_ON && new Date(val.APPROVAL2_ON).toDateString()}
        </span>
      ),
      sortable: false,
    },
    {
      name: "Efforts Approved At",
      selector: (val) => val.APPROVAL2_AT,
      sortable: false,
    },
    {
      name: "Efforts Remarks",
      selector: (val) => val.APPROVAL2_REMARKS,
      sortable: false,
      width: "220px",
      width: "400px",

      cell: (val) => <span>{removeHtmlTags(val.APPROVAL1_REMARKS)}</span>,
    },
  ];

  const CsvHeader = [
    {
      name: "Ticket ID",
      selector: "TICKET_ID",
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
      name: "Type of Request",
      selector: "TYPE_OF_REQUEST",
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
      name: "Requirement Approved By",
      selector: "APPROVAL1_BY",
    },
    {
      name: "Requirement Approved On",
      selector: "APPROVAL1_ON",
    },
    {
      name: "Requirement Approved At",
      selector: "APPROVAL1_AT",
    },
    {
      name: "Requirement Remarks",
      selector: "APPROVAL1_REMARKS",
    },
    {
      name: "Efforts",
      selector: "EFFORTS",
    },
    {
      name: "Efforts Approved By",
      selector: "APPROVAL2_BY",
    },
    {
      name: "Efforts Approved On",
      selector: "APPROVAL2_ON",
    },
    {
      name: "Efforts Approved At",
      selector: "APPROVAL2_AT",
    },
    {
      name: "Efforts Remarks",
      selector: "APPROVAL2_REMARKS",
    },
  ];
  const handleExcelExport = () => {
    let excelData = [...Tbody];
    // excelData.map((val) => {
    //   val.REQUEST_DESCRIPTION = constants.requestType[val.REQUEST];

    //   let pending = [];
    //   val.PRIORITY = constants.priorityText[val.PRIORITY];
    //   val.PENDING_WITH.map((pendg) => {
    //     pending.push(pendg.USER_NAME);
    //   });
    //   val.PENDING_WITH = pending;
    // });

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
              } else if (column.selector == "APPROVAL2_REMARKS") {
                cellValue = removeHtmlTags(item[column.selector]);
                console.log("Asdhasdbhjsadasd", cellValue);
              } else if (column.selector == "APPROVAL1_REMARKS") {
                cellValue = removeHtmlTags(item[column.selector]);
              } else if (column.selector == "ASSIGNED_DATE") {
                if (
                  item[column.selector] != "" &&
                  item[column.selector] != undefined
                ) {
                  cellValue = new Date(item[column.selector]).toDateString();
                } else {
                  cellValue = "";
                }
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
      saveAs(blob, "Approval-Report.csv"); // Use the saveAs function to download the CSV file
    }
  };

  useEffect(() => {
    getApprovalReportData();
    getAllClientData();
  }, []);
  const getApprovalReportData = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.approvalReport)
      .then((response) => {
        let temp = [...response.data];
        temp.map((val) => {
          val.REQUEST_DESCRIPTION = constants.requestType[val.REQUEST];

          let pending = [];
          val.PRIORITY = constants.priorityText[val.PRIORITY];
          val.PENDING_WITH.map((pendg) => {
            pending.push(pendg.USER_NAME);
          });
          val.PENDING_WITH = pending;
        });

        temp.sort((a, b) => b.TICKET_ID - a.TICKET_ID);

        setTbody(temp);
      })
      .catch((err) => {
        console.log("ASdasdasd", err);
      });
  };
  const getAllClientData = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllClient)
      .then((response) => {
        let temp = [];
        response.data.map((val) => {
          temp.push({
            ...val,
            value: val.CLIENT_ID,
            label: val.COMPANY_NAME,
          });
        });
        setClientOptions(temp);
      })
      .catch((err) => {
        console.log("ASdasdasd", err);
      });
  };

  const getClientTktData = () => {
    if (selectedClientID) {
      axios
        .get(AXIOS.defaultPort + AXIOS.getTicketbyClient + selectedClientID)
        .then((response) => {
          console.log("Asdkbadjhasdasd", response.data);
          // setClientOptions(temp);
          setClientTktData(response.data);
        })
        .catch((err) => {
          console.log("ASdasdasd", err);
        });
    } else {
      cogoToast.error("Please select customer");
    }
  };
  return (
    <MainScreen drawerWidth={282} Activekey={TICKET_REPORT}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: 1,
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <button
              style={{
                // position: "absolute",
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
                handleFindTktModalOpen();
              }}
            >
              Find Ticket
            </button>
            {(props.LOGGED_IN_DATA.USER_TYPE?.includes(0) ||
              props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
              props.LOGGED_IN_DATA.USER_TYPE?.includes(5)) && (
              <button
                style={{
                  // position: "absolute",
                  top: "0px",
                  right: "200px",
                  width: "150px",
                  height: "35px",
                  cursor: "pointer",
                  backgroundColor: "#219bcc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  zIndex: 0,
                  fontSize: 13,
                  marginLeft: 10,
                }}
                // onClick={handleExport}
                onClick={() => {
                  handleSearchByClientModalOpen();
                }}
              >
                Search By Client
              </button>
            )}
          </div>
          {(props.LOGGED_IN_DATA.USER_TYPE?.includes(0) ||
            props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
            props.LOGGED_IN_DATA.USER_TYPE?.includes(5)) && (
            <button
              style={{
                // position: "absolute",
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
            </button>
          )}
        </div>
        {(props.LOGGED_IN_DATA.USER_TYPE?.includes(0) ||
          props.LOGGED_IN_DATA.USER_TYPE?.includes(3) ||
          props.LOGGED_IN_DATA.USER_TYPE?.includes(5)) && (
          <Card>
            <ReactDataTable columns={columns} data={Tbody} loading={true} />
          </Card>
        )}
      </div>
      <Modal
        open={FindTktModalOpen}
        onClose={handleFindTktModalClose}
        disableAutoFocus
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Find ticket!</h5>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleFindTktModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <Label
            for="basicpill-email-input4"
            style={{
              fontSize: 18,
            }}
          >
            Ticket ID<span className="required-filed">*</span>
          </Label>
          <CustomInput
            type="text"
            name="USERNAME"
            className="form-control"
            placeholder="Enter Ticket ID"
            value={findTktID.TICKER_ID}
            onChange={(e) => {
              setFindTktId((prev) => ({
                ...prev,
                TICKER_ID: e.target.value,
                ERROR_FLAG: false,
              }));
            }}
          />
          {findTktID.ERROR_FLAG && (
            <p
              style={{
                color: "red",
              }}
            >
              Please enter Ticket ID{" "}
            </p>
          )}

          <button
            onClick={(e) => {
              searchTktID();
            }}
            style={{
              backgroundColor: "#323449",
              marginTop: 15,
              padding: "2%",
              margin: "2%",
              width: "30%",
            }}
            className="col adduser-button-style"
          >
            Search
          </button>
        </Box>
      </Modal>
      <Modal
        open={SearchByClientModalOpen}
        onClose={handleSearchByClientModalClose}
        disableAutoFocus
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Search Ticket!</h5>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleSearchByClientModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <Label
            for="basicpill-email-input4"
            style={{
              fontSize: 18,
            }}
          >
            Customer<span className="required-filed">*</span>
          </Label>
          <CustomSelect
            options={clientOptions}
            value={clientOptions.find((val) => val.value == selectedClientID)}
            onChange={(e) => {
              setSelectedClientID(e.value);
            }}
          />
          <button
            onClick={(e) => {
              getClientTktData();
            }}
            style={{
              backgroundColor: "#323449",
              marginTop: 15,
              padding: "2%",
              margin: "2%",
              width: "30%",
            }}
            className="col adduser-button-style"
          >
            Search
          </button>

          <TableContainer className="horizontal-scroll-table">
            <Table aria-label="customized table" stickyHeader>
              <TableHead
                className="scroll-effect-header"
                style={{
                  zIndex: 0,
                }}
              >
                <tr
                  style={
                    {
                      // backgroundColor: "red",
                      // height: 60,
                    }
                  }
                >
                  {HeaderDataClientTkt.map((col, index) => (
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
                {ClientTktData.map((row, rowIndex) => (
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
                      {row.REQUEST_DESCRIPTION}
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
                    <td style={{ textAlign: "center", minWidth: 120 }}>
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
                        onClick={() => {
                          navigate(TICKET_REPORT_VIEW, {
                            state: {
                              row: [{ ...row, ROLE: [] }],
                            },
                          });
                        }}
                      />
                    </td>

                    <td
                      className="dashboard-td-font"
                      style={{
                        textAlign: "center",
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
        </Box>
      </Modal>
    </MainScreen>
  );
}

const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(TicketReport);
