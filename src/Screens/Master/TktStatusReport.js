import React, { useEffect, useState } from "react";
import MainScreen from "../../components/AppDrawer/MainScreen";
import { TICKET_STATUS_REPORT } from "../../Utils/Routes";
import { Label } from "reactstrap";
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

function TktStatusReport(props) {
  const [formData, setFormData] = useState({
    CLIENT_ID: "",
    CLIENT_ID_ERROR: false,
    START_DATE: "",
    START_DATE_ERROR: false,
    END_DATE: "",
    END_DATE_ERROR: false,
  });

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
      name: "Sub Category ID",
      selector: "SUB_CATEGORY",
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
              Search
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <button
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
            </button>
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
                        {val.SUBCATEGORY_NAME}
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
