import { React, useEffect, useState } from "react";
import MainScreen from "../../components/AppDrawer/MainScreen";
import { DASHBOARD } from "../../Utils/Routes";
import CustomCard from "../../components/Cards/CustomCardUser";
import CustomInput from "../../components/CustomInput/CustomInput";
import axios from "axios";
import { Table, th, tr, TableHead, TableRow, TableCell } from "@mui/material";
import {
  width,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { color, height } from "@mui/system";
import { connect, useDispatch } from "react-redux";
import { TicketDataByFlagAction } from "../../redux/action/TicketDataByFlagAction";
import cogoToast from "cogo-toast";
import constants from "../../Utils/constants";
import AXIOS from "../../Utils/AXIOS";

function CloseUser(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [isFormCollapsed, setIsFormCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [assignedDateFilter, setAssignedDateFilter] = useState("");
  const [filteredRows1, setFilteredRows1] = useState([]);
  const [requestType, setRequestType] = useState("");
  const [rowData, setRowData] = useState([]);
  const [allTickets, setAllTicket] = useState([]);
  const getAllTickets = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllTicket).then((res) => {
      setAllTicket(res.data);
    });
  };
  useEffect(() => {
    getAllTickets();
  }, []);
  const [unassignData, setUnassignData] = useState({
    TICKET_NO: "",
    REQUEST_TYPE: "",
    CATEGORY: "",
    SUB_CATEGORY: "",
    EMPLOYEE_CODE: "",
    ASSIGNED_DATE: "",
    STATUS: "",
    ITEM: "",
    DAYS: "",
  });
  const statusFlag = constants.statusFlag;
  useEffect(() => {
    props
      .TicketDataByFlagAction(4)
      .then((res) => {
        if (res == "success") {
          console.log("success");
        } else {
          cogoToast.error("Something went wrong");
        }
      })
      .catch((err) => {
        cogoToast.error("Something went wrong");
      });
  }, []);
  useEffect(() => {
    // {
    //     "TICKET_ID": "ICL0000002",
    //     "Type of Request": "New Requirment",
    //     Category: "SAP",
    //     "Sub Category": "MM",
    //     "Assigned Date": "01/01/2023",
    //     Status: "Pending",
    //     Priority: "Low",
    //   }
    let tempTickets = [...props.ticketDataByFlag];
    let tempData = [];
    tempTickets.map((val) => {
      let tempObj = {};
      tempObj.TICKET_ID = val.TICKET_ID;
      tempObj["Type of Request"] = val.REQUEST;
      tempObj.Category = val.CATEGORY_ID;
      tempObj["Sub Category"] = val.SUB_CATEGORY;
      tempObj["Assigned Date"] = val.ASSIGNED_DATE;
      let index = statusFlag.findIndex((item) => item.flag == val.FLAG);
      tempObj.Status = statusFlag[index]?.value;
      tempObj.Priority = val.PRIORITY;
      tempData.push(tempObj);
    });
    setRowData(tempData);
  }, [props]);


  const HeaderData = [
    { Label: "Select", Checkbox: true },
    {
      Label: "Ticket ID",
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

  // const rowData = [
  //   {
  //     "Ticket ID": "ICL0000001",
  //     "Type of Request": "Service Request",
  //     Category: "Web Development",
  //     "Sub Category": "PP",
  //     "Assigned Date": "28/03/2024",
  //     Status: "Open",
  //     Priority: "Medium",
  //   },
  //   {
  //     "Ticket ID": "ICL0000002",
  //     "Type of Request": "New Requirment",
  //     Category: "SAP",
  //     "Sub Category": "MM",
  //     "Assigned Date": "01/01/2023",
  //     Status: "Pending",
  //     Priority: "Low",
  //   },
  //   {
  //     "Ticket ID": "ICL0000003",
  //     "Type of Request": "Change Requirment",
  //     Category: "SAP",
  //     "Sub Category": "FICO",
  //     "Assigned Date": "03/04/2024",
  //     Status: "Close",
  //     Priority: "High",
  //   },
  //   ,
  //   {
  //     "Ticket ID": "ICL0000004",
  //     "Type of Request": "Service Request",
  //     Category: "SAP",
  //     "Sub Category": "ABAP",
  //     "Assigned Date": "03/04/2024",
  //     Status: "Pending",
  //     Priority: "Medium",
  //   },
  //   {
  //     "Ticket ID": "ICL0000005",
  //     "Type of Request": "New Requirment",
  //     Category: "SAP",
  //     "Sub Category": "ABAP",
  //     "Assigned Date": "03/04/2024",
  //     Status: "Close",
  //     Priority: "High",
  //   },
  // ];

  useState(() => {
    setFilteredData(rowData);
  }, []);

  const getStatusText = (status) => {
    if (!status) {
      return null; // Handle empty status gracefully
    }
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "open") {
      return (
        <span style={{ width: "60%" }} className="badge bg-primary">
          Open
        </span>
      );
    } else if (lowerStatus === "pending") {
      return (
        <span style={{ width: "60%" }} className="badge bg-warning">
          Pending
        </span>
      );
    } else if (lowerStatus === "close") {
      return (
        <span style={{ width: "60%" }} className="badge bg-success">
          Close
        </span>
      );
    }
    return null;
  };

  const handleCheckboxChange = (ticketId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(ticketId)) {
        return prevSelectedRows.filter((id) => id !== ticketId); // Remove ticketId from selection
      } else {
        return [...prevSelectedRows, ticketId]; // Add ticketId to selection
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allTicketIds = filteredRows.map((row) => row["TICKET_ID"]);
      setSelectedRows(allTicketIds); // Select all rows
    } else {
      setSelectedRows([]); // Deselect all rows
    }
  };

  const filteredRows = rowData
    .filter((row) => {
      if (!statusFilter) return true; // No status filter applied
      return row.Status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter((row) => {
      if (!searchQuery) return true; // No search query
      return Object.values(row)
        .filter((value) => typeof value === "string")
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });

  const handleIconClick = (row) => {
    navigate("/v1/dashboard/ticketdetail", {
      state: {
        row: allTickets?.filter((val) => val.TICKET_ID == row.TICKET_ID),
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnassignData({ ...unassignData, [name]: value });
  };

  //     try {
  //       // Post form data to the API endpoint
  //       const response = await axios.post("api url", unassignData);
  //       console.log("Response:", response.data);
  //       setUnassignData({
  //         TICKET_NO: "",
  //         EMPLOYEE_CODE: "",
  //         LOGGED_DATE: "",
  //         STATUS: "",
  //         ITEM: "",
  //         DAYS: "",
  //       });
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  const toggleFormCollapse = () => {
    setIsFormCollapsed(!isFormCollapsed);
  };

  const validDateString = "2024-03-28"; // Example date string in YYYY-MM-DD format
  const assignedDate = new Date(validDateString);

  const filteredRow = rowData
    .filter((row) => {
      // Check if the ticket ID matches the search query
      if (!searchQuery) return true; // No search query
      return row["TICKET_ID"].toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((row) => {
      // Filter by status
      if (!statusFilter) return true; // No status filter applied
      return row.Status.toLowerCase() === statusFilter.toLowerCase();
    })
    .filter((row) => {
      // Additional filters based on request type, category, subcategory, and assigned date
      const lowerRequestType = row["Type of Request"]?.toLowerCase();
      const lowerCategory = row.Category?.toLowerCase();
      const lowerSubCategory = row["Sub Category"]?.toLowerCase();
      const assignedDate = new Date(row["Assigned Date"]);

      return (
        (!requestType || lowerRequestType === requestType.toLowerCase()) &&
        (!categoryFilter || lowerCategory === categoryFilter.toLowerCase()) &&
        (!subCategoryFilter ||
          lowerSubCategory === subCategoryFilter.toLowerCase()) &&
        (!assignedDateFilter ||
          assignedDateFilter === assignedDate.toISOString())
      );
    })
    .filter((row) => {
      // Filter by assigned date if assignedDateFilter is set
      if (!assignedDateFilter) return true; // No assigned date filter applied
      const assignedDate = new Date(row["Assigned Date"]);
      return assignedDateFilter === assignedDate.toISOString();
    });

  return (
    <MainScreen drawerWidth={282}>
      <div>
        <div >
          <CustomCard data={location.state.data} />
        </div>
        <div className="page-content">
          <Container fluid={true}>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: -15,
                      }}
                    >
                      <h4 style={{ height: "1.5vh" }}>Close Ticket Detail</h4>
                      <Button color="link" onClick={toggleFormCollapse}>
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
                                      value={searchQuery}
                                      onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                      }
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
                                    onChange={(e) =>
                                      setRequestType(e.target.value)
                                    }
                                  >
                                    <option value="">Select Request</option>
                                    <option value="Service Request">
                                      Service Request
                                    </option>
                                    <option value="New Requirment">
                                      New Requirment
                                    </option>
                                    <option value="Change Requirment">
                                      Change Requirment
                                    </option>
                                  </Input>
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-email-input4">
                                    Category
                                  </Label>
                                  <Input
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
                                  </Input>
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-email-input4">
                                    Sub Category
                                  </Label>
                                  <Input
                                    type="select"
                                    name="SUB_CATEGORY"
                                    className="form-control"
                                    id="basicpill-email-input4"
                                    value={subCategoryFilter}
                                    onChange={(e) =>
                                      setSubCategoryFilter(e.target.value)
                                    }
                                  >
                                    <option value="">
                                      Select Sub Category
                                    </option>
                                    <option value="PP">PP</option>
                                    <option value="MM">MM</option>
                                    <option value="FICO">FICO</option>
                                    <option value="ABAP">ABAP</option>
                                  </Input>
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
                                    onChange={(e) =>
                                      setStatusFilter(e.target.value)
                                    }
                                  >
                                    <option value="">Select Status</option>
                                    <option value="Open">Open</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Close">Close</option>
                                  </Input>
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </div>
                    )}
                    <div style={{ marginTop: "2%" }}>
                      <table
                        className="table table-striped table-bordered table-hover table-sm"
                        style={{
                          textAlign: "center",
                          height: "70%",
                          borderRadius: "10%",
                        }}
                      >
                        <thead className="thead-style">
                          <tr>
                            {HeaderData.map((col, index) => (
                              <th
                                key={index}
                                style={{
                                  textAlign: "center",
                                  color: "#31434b",
                                }}
                              >
                                {col.Checkbox ? (
                                  <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={
                                      selectedRows.length ===
                                      filteredRows.length
                                    }
                                  />
                                ) : (
                                  <span>{col.Label}</span>
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRow.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              <td
                                style={{
                                  textAlign: "center",
                                  color: "#31434b",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleCheckboxChange(row["TICKET_ID"])
                                  }
                                  checked={selectedRows.includes(
                                    row["TICKET_ID"]
                                  )}
                                />
                              </td>
                              {Object.keys(row).map((key, colIndex) => (
                                <td
                                  key={colIndex}
                                  style={{ textAlign: "center" }}
                                >
                                  {key === "Status" ? (
                                    <span
                                      className="badge"
                                      style={{ backgroundColor: "#dc3545" }}
                                    >
                                      {row.Status}
                                    </span>
                                  ) : (
                                    row[key]
                                  )}
                                </td>
                              ))}
                              <td
                                style={{
                                  cursor: "pointer",
                                  textAlign: "center",
                                }}
                              >
                                <div onClick={() => handleIconClick(row)}>
                                  <VisibilityIcon />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              {/* <Col lg="12"></Col> */}
            </Row>
          </Container>
        </div>

        <div className="table-container mx-3 my-3"></div>
      </div>
    </MainScreen>
  );
}

const mapStateToProps = (state) => ({
  ticketDataByFlag: state.ticketData.ticketByFlag,
});

export default connect(mapStateToProps, { TicketDataByFlagAction })(CloseUser);
