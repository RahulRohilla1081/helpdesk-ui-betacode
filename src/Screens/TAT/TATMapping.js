import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import Select from "react-select";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import toast, { Toaster } from "react-hot-toast";
import { TURN_AROUND_TIME } from "../../Utils/Routes";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import ReactDataTable from "../../components/ReactDataTable/ReactDataTable";
import { connect } from "react-redux";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import CustomInput from "../../components/CustomInput/CustomInput";
import { saveAs } from "file-saver";

function TATMapping(props) {


  const priorityArr = [
    { label: "P1-Very high", value: "P1" },
    { label: "P2-High", value: "P2" },
    { label: "P3-Medium", value: "P3" },
    { label: "P4-Low", value: "P4" },
  ];

  const RequestArr = [
    {
      label: "Service Request",
      value: "SR",
    },
    {
      label: "New Request",
      value: "NR",
    },
    {
      label: "Change Request",
      value: "CR",
    },
  ];

  const TimeUOMAr = [
    {
      label: "Minutes",
      value: "MINUTES",
    },
    {
      label: "Hours",
      value: "HOURS",
    },
    {
      label: "Day",
      value: "DAY",
    },
  ];
  const [TATData, setTATData] = useState({
    TICKET_TYPE: "",
    PRIORITY: "",
    RESPONSE_TIME: "",
    RESPONSE_TIME_UOM: "",
    RESOLUTION_TIME: "",
    RESOLUTION_TIME_UOM: "",
    TICKET_TYPE_ERROR: false,
    CLIENT_ID_ERROR: false,
    PRIORITY_ERROR: false,
    RESPONSE_TIME_ERROR: false,
    RESPONSE_TIME_UOM_ERROR: false,
    RESOLUTION_TIME_ERROR: false,
    RESOLUTION_TIME_UOM_ERROR: false,
  });

  const handleSubmit = () => {
    let tempTATData = { ...TATData };

    let payload = {};

    let ErrorFoundFlag = false;
    Object.keys(tempTATData).map((key, colIndex) => {
      if (typeof tempTATData[key] != "boolean") {
        if (tempTATData[key] == "") {
          tempTATData[key + "_ERROR"] = true;
          ErrorFoundFlag = true;
        }
      }
    });

    if (ErrorFoundFlag == false) {
      payload = { ...tempTATData };
      Object.keys(tempTATData).map((key, colIndex) => {
        if (typeof tempTATData[key] == "boolean") {
          delete payload[key];
        }
      });

      console.log("asdhbaghdbasdas", payload);
        axios
          .post(AXIOS.defaultPort + AXIOS.createTatMapping, payload)
          .then((response) => {
            toast.success("TAT created");
            getTATMappingData();

            Object.keys(tempTATData).map((key, colIndex) => {
              if (typeof tempTATData[key] != "boolean") {
                tempTATData[key] = "";
              }
            });
          })
          .catch(() => {});
    }

    setTATData(tempTATData);
    console.log("Asdasbdhjasd", tempTATData);

    // console.log("Adkabsdhjasd",tempTATData);
  };

  useEffect(() => {
    getTATMappingData();
    getAllClients();
  }, []);

   const NumberInputOnly = (inputString) => {
    let result = inputString.replace(/[^0-9]/g, "");
    return result;
  };

  const [Tbody, setTbody] = useState([]);
  const [AllClients, setAllClients] = useState([]);
  const getTATMappingData = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllTatMapping)
      .then((response) => {
        console.log("Asdkjabdhjasd", response.data);

        setTbody(response.data);
      })
      .catch((err) => {
        console.log("Asdkjabdhjasd", err);
      });
    // console.log("Adkabsdhjasd",tempTATData);
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
      name: "Customer",
      selector: (val) => val.CLIENT_ID,
      sortable: false,
      width: "300px",
      cell: (val) => (
        <p>
          <span>
            {val.COMPANY_NAME} ({val.CLIENT_ID})
          </span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Ticket Type",
      selector: (val) => val.TICKET_TYPE,
      cell: (val) => (
        <>{RequestArr.find((item) => item.value == val.TICKET_TYPE)?.label}</>
      ),
      sortable: false,
      // width: "80px",
    },
    {
      name: "Priority",
      selector: (val) => val.PRIORITY,
      sortable: false,
      cell: (val) => (
        <>{priorityArr.find((item) => item.value == val.PRIORITY)?.label}</>
      ),
      // width: "80px",
    },
    {
      name: "Response Time",
      selector: (val) => val.RESPONSE_TIME,
      sortable: false,
      // width: "80px",
    },
    {
      name: "Response Time UOM",
      selector: (val) => val.RESPONSE_TIME_UOM,
      sortable: false,
      // width: "80px",
    },
    {
      name: "Resolution Time ",
      selector: (val) => val.RESOLUTION_TIME,
      sortable: false,
      // width: "80px",
    },
    {
      name: "Resolution Time UOM",
      selector: (val) => val.RESOLUTION_TIME_UOM,
      sortable: false,
      // width: "80px",
    },
  ];
    const CsvHeader = [
      {
        name: "Customer ID",
        selector: "CLIENT_ID",
      },
      {
        name: "Company Name",
        selector: "COMPANY_NAME",
      },
      {
        name: "Ticket Type",
        selector: "TICKET_TYPE",
      },

      {
        name: "Priority",
        selector: "PRIORITY",
      },
      {
        name: "Response Time",
        selector: "RESPONSE_TIME",
      },
      {
        name: "Response Time UOM",
        selector: "RESPONSE_TIME_UOM",
      },
      {
        name: "Resolution Time",
        selector: "RESOLUTION_TIME",
      },
      {
        name: "Resolution Time UOM",
        selector: "RESOLUTION_TIME_UOM",
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
        saveAs(blob, "Customer TAT.csv"); // Use the saveAs function to download the CSV file
      }
    };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={TURN_AROUND_TIME}>
      <Toaster />
      <div className="item-input-container">
        <div className="row item-sub-input-container">
          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Customer <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={AllClients}
              value={
                TATData.CLIENT_ID == ""
                  ? ""
                  : AllClients.find((val) => val.value == TATData.CLIENT_ID)
              }
              onChange={(e) => {
                setTATData((prev) => ({
                  ...prev,
                  CLIENT_ID: e.value,
                  CLIENT_ID_ERROR: false,
                }));
              }}
            />
            {TATData?.CLIENT_ID_ERROR && (
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
            <Label className="modal-label" for="basicpill-email-input4">
              Ticket Type <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={RequestArr}
              value={
                TATData.TICKET_TYPE == ""
                  ? ""
                  : RequestArr.find((val) => val.value == TATData.TICKET_TYPE)
              }
              onChange={(e) => {
                setTATData((prev) => ({
                  ...prev,
                  TICKET_TYPE: e.value,
                  TICKET_TYPE_ERROR: false,
                }));
              }}
            />
            {TATData?.TICKET_TYPE_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Ticket Type{" "}
              </p>
            )}
          </div>
          <div className="col-md-6">
            <Label className="modal-label" for="basicpill-email-input4">
              Priority <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={priorityArr}
              value={
                TATData.PRIORITY == ""
                  ? ""
                  : priorityArr.find((val) => val.value == TATData.PRIORITY)
              }
              onChange={(e) => {
                setTATData((prev) => ({
                  ...prev,
                  PRIORITY: e.value,
                  PRIORITY_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
            {TATData?.PRIORITY_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Priority
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Response Time<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Response"
              value={TATData.RESPONSE_TIME}
              onChange={(e) => {
                setTATData((prev) => ({
                  ...prev,
                  RESPONSE_TIME: NumberInputOnly(e.target.value),
                  RESPONSE_TIME_ERROR: false,
                }));
              }}
            />
            {TATData?.RESPONSE_TIME_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Response Time
              </p>
            )}
          </div>

          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Time UOM <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={TimeUOMAr}
              value={
                TATData.RESPONSE_TIME_UOM == ""
                  ? ""
                  : TimeUOMAr.find(
                      (val) => val.value == TATData.RESPONSE_TIME_UOM
                    )
              }
              onChange={(e) => {
                setTATData((prev) => ({
                  ...prev,
                  RESPONSE_TIME_UOM: e.value,
                  RESPONSE_TIME_UOM_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
            {TATData?.RESPONSE_TIME_UOM_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Time UOM
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Resolution Time <span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Item"
              value={TATData.RESOLUTION_TIME}
              onChange={(e) => {
                setTATData((prev) => ({
                  ...prev,
                  RESOLUTION_TIME: NumberInputOnly(e.target.value),
                  RESOLUTION_TIME_ERROR: false,
                }));
              }}
            />
            {TATData?.RESOLUTION_TIME_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Resolution Time
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Time UOM <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={TimeUOMAr}
              value={
                TATData.RESOLUTION_TIME_UOM == ""
                  ? ""
                  : TimeUOMAr.find(
                      (val) => val.value == TATData.RESOLUTION_TIME_UOM
                    )
              }
              onChange={(e) => {
                setTATData((prev) => ({
                  ...prev,
                  RESOLUTION_TIME_UOM: e.value,
                  RESOLUTION_TIME_UOM_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
            {TATData?.RESOLUTION_TIME_UOM_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Time UOM
              </p>
            )}
          </div>
          <div style={{ marginTop: 10 }} className="row item-inner_div">
            <button
              style={{ backgroundColor: "#219bcc" }}
              className="mx-2 col-1 item-button-style"
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </button>
          </div>
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
        {/* <div className="m-2 d-flex justify-content">
          <button
            style={{
              marginBottom: -40,
              marginRight: 300,
            }}
            className="signup-button"
          ></button>
        </div> */}
        <ReactDataTable columns={columns} data={Tbody} loading={true} />
      </div>
    </MainScreenEmployee>
  );
}


// export default AddApprover;
const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(TATMapping);
