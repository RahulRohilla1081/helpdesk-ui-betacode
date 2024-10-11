import React, { useEffect, useState } from "react";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import { Label } from "reactstrap";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import CustomInput from "../../components/CustomInput/CustomInput";
import { ADD_TASK } from "../../Utils/Routes";
import toast, { Toaster } from "react-hot-toast";
import { connect } from "react-redux";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import ReactDataTable from "../../components/ReactDataTable/ReactDataTable";
import { saveAs } from "file-saver";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  Modal,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
function AddTask(props) {
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
  const [formData, setFormData] = useState({
    CLIENT_ID: "",
    CLIENT_ID_ERROR: false,
    DATE: "",
    DATE_ERROR: false,
    CONSULTANT: "",
    CONSULTANT_ERROR: false,
    DETAILS: "",
    DETAILS_ERROR: false,
    TIME: "",
    TIME_ERROR: false,
    TIME_UNIT: "",
    TIME_UNIT_ERROR: false,
    REMARKS: "",
    REMARKS_ERROR: false,
  });
  const [Tbody, setTbody] = useState([]);
  const [AllClients, setAllClients] = useState([]);
  const [AllEmpList, setAllEmpList] = useState([]);

  const [selectedTask, setSelectedTask] = useState(null);

  const NumberInputOnly = (inputString) => {
    let result = inputString.replace(/[^0-9]/g, "");
    return result;
  };

  const timeUnitArr = [
    {
      label: "Minutes",
      value: "MINUTES",
    },
    {
      label: "Hours",
      value: "HOURS",
    },

    {
      label: "Days",
      value: "DAYS",
    },
    {
      label: "Month",
      value: "MONTH",
    },
  ];

  useEffect(() => {
    getAllClients();
    getAllEmployeeList();
  }, []);

  const getAllEmployeeList = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllEmployess)
      .then((response) => {
        console.log("asdkashkdsad", response.data);

        let temp = [];
        response.data.map((val) => {
          temp.push({
            label: `${val.EMP_NAME} (${val.EMP_ID})`,
            value: val.EMP_ID,
            ...val,
          });
        });
        setAllEmpList(temp);
      })
      .catch((err) => {});
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
    axios.get(url).then((res) => {
      let temp = [...res.data];
      temp.map((val) => {
        val.label = val.COMPANY_NAME;
        val.value = val.CLIENT_ID;
      });
      setAllClients(temp);
    });
  };

  useEffect(() => {
    getAllTaskList();
  }, []);

  const [TaskModalOpen, setFindTktModalOpen] = useState(false);
  const handleTaskUpdateModalOpen = () => setFindTktModalOpen(true);
  const handleTaskUpdateModalClose = () => setFindTktModalOpen(false);

  const convertIndianStandardIntoYMD = (date) => {
    var date = new Date(date),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("/");
  };

  const getAllTaskList = () => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getAllTaskMaster +
          props.LOGGED_IN_DATA.USER_ID
      )
      .then((res) => {
        console.log("asdasdasdas", res.data);
        setTbody(res.data);
      })
      .catch((err) => {
        console.log("sadjnasjdkas", err);
      });
  };

  const handleSubmit = () => {
    let tempFormData = { ...formData };

    let payload = {};

    let ErrorFoundFlag = false;
    Object.keys(tempFormData).map((key, colIndex) => {
      if (typeof tempFormData[key] != "boolean") {
        if (tempFormData[key] == "") {
          tempFormData[key + "_ERROR"] = true;
          ErrorFoundFlag = true;
        }
      }
    });

    if (ErrorFoundFlag == false) {
      payload = { ...tempFormData };
      Object.keys(tempFormData).map((key, colIndex) => {
        if (typeof tempFormData[key] == "boolean") {
          delete payload[key];
        }
      });

      axios
        .post(AXIOS.defaultPort + AXIOS.taskCreate, {
          COMPANY: payload.CLIENT_ID,
          CONSULTANT: payload.CONSULTANT,
          DETAILS: payload.DETAILS,
          DATE: payload.DATE,
          TIME: payload.TIME,
          REMARKS: payload.REMARKS,
          TIME_UNIT: payload.TIME_UNIT,
          CREATED_BY: props.LOGGED_IN_DATA.USER_ID,
        })
        .then((response) => {
          toast.success("Task Created");
          getAllTaskList();

          Object.keys(tempFormData).map((key, colIndex) => {
            if (typeof tempFormData[key] != "boolean") {
              tempFormData[key] = "";
            }
          });
        })
        .catch(() => {});
    }
    setFormData(tempFormData);
  };
  const handleUpdate = () => {
    let tempFormData = { ...selectedTask };

    let payload = {};

    // let ErrorFoundFlag = false;
    // Object.keys(tempFormData).map((key, colIndex) => {
    //   if (typeof tempFormData[key] != "boolean") {
    //     if (tempFormData[key] == "") {
    //       tempFormData[key + "_ERROR"] = true;
    //       ErrorFoundFlag = true;
    //     }
    //   }
    // });

    payload = { ...tempFormData };
    Object.keys(tempFormData).map((key, colIndex) => {
      if (typeof tempFormData[key] == "boolean") {
        delete payload[key];
      }
    });

    axios
      .post(AXIOS.defaultPort + AXIOS.updateTaskMaster, {
        TASK_ID: selectedTask.TASK_ID,
        COMPANY: payload.CLIENT_ID,
        CONSULTANT: payload.CONSULTANT,
        DETAILS: payload.DETAILS,
        DATE: payload.DATE,
        TIME: payload.TIME,
        REMARKS: payload.REMARKS,
        TIME_UNIT: payload.TIME_UNIT,
        CREATED_BY: props.LOGGED_IN_DATA.USER_ID,
      })
      .then((response) => {
        console.log("Asdaksjndjksadas", response.data);
        toast.success("Task Updated");
        handleTaskUpdateModalClose();
        getAllTaskList();
      })
      .catch((err) => {});
    setSelectedTask(tempFormData);
  };
  let timeUnit = { MINUTES: "Min", HOURS: "Hrs", DAYS: "Days", MONTH: "Month" };
  const columns = [
    {
      name: "Task ID",
      selector: (val) => val.TASK_ID,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <p>
          <span>{val.TASK_ID}</span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Company",
      selector: (val) => val.COMPANY_NAME,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <p>
          <span>{val.COMPANY_NAME}</span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Consultant",
      selector: (val) => val.CONSULTANT_NAME,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <p>
          <span>{val.CONSULTANT_NAME}</span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Details",
      selector: (val) => val.DETAILS,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <p>
          <span>{val.DETAILS}</span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Date",
      selector: (val) => val.DATE,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <p>
          <span>{new Date(val.DATE).toDateString()}</span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Time",
      selector: (val) => val.TIME,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <p>
          <span>
            {val.TIME} {timeUnit[val.TIME_UNIT]}
          </span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Remarks",
      selector: (val) => val.REMARKS,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <p>
          <span>{val.REMARKS}</span>
        </p>
      ),
      // width: "80px",
    },
    {
      name: "Edit",
      selector: (val) => val.TIME,
      sortable: false,
      // width: "300px",
      cell: (val) => (
        <EditIcon
          sx={{
            color: "#30344a",
            cursor: "pointer",
            height: 20,
          }}
          onClick={() => {
            handleTaskUpdateModalOpen();
            setSelectedTask({ ...val, CLIENT_ID: val.COMPANY });
            console.log("ASdakjsdas", convertIndianStandardIntoYMD(val.DATE));
          }}
        />
      ),
      // width: "80px",
    },
    // {
    //   name: "Time Unit",
    //   selector: (val) => val.TIME_UNIT,
    //   sortable: false,
    //   // width: "300px",
    //   cell: (val) => (
    //     <p>
    //       <span>{val.TIME_UNIT}</span>
    //     </p>
    //   ),
    //   // width: "80px",
    // },
  ];

  const CsvHeader = [
    {
      name: "Task ID",
      selector: "TASK_ID",
    },
    {
      name: "Company Name",
      selector: "COMPANY_NAME",
    },
    {
      name: "Company ID",
      selector: "COMPANY",
    },
    {
      name: "Consultant Name",
      selector: "CONSULTANT_NAME",
    },

    {
      name: "Consultant ID",
      selector: "CONSULTANT",
    },
    {
      name: "Date",
      selector: "DATE",
    },
    {
      name: "Details",
      selector: "DETAILS",
    },
    {
      name: "Remarks",
      selector: "REMARKS",
    },
    {
      name: "Time",
      selector: "TIME",
    },
    {
      name: "Time Unit",
      selector: "TIME_UNIT",
    },

    {
      name: "Created By Name",
      selector: "EMPLOYEE_NAME",
    },
    {
      name: "Created By ID",
      selector: "CREATED_BY",
    },
  ];
  // COMPANY: "Samishti";
  // CONSULTANT: "Suman";
  // DATE: "2024-07-29T04:45:55.019Z";
  // DETAILS: "Test";
  // REMARKS: "Testing";
  // TASK_ID: "T00001";
  // TIME: "5";
  // TIME_UNIT: "7";

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
              if (column.name == "Date") {
                cellValue = new Date(item[column.selector]).toDateString();
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
      saveAs(blob, "Tasks.csv"); // Use the saveAs function to download the CSV file
    }
  };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADD_TASK}>
      <Toaster />
      <div className="item-input-container">
        <div className="row item-sub-input-container">
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Customer <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={AllClients}
              value={
                formData?.CLIENT_ID == ""
                  ? ""
                  : AllClients.find((val) => val.value == formData?.CLIENT_ID)
              }
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
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Date <span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="date"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Date"
              value={formData?.DATE}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  DATE: e.target.value,
                  DATE_ERROR: false,
                }));
              }}
            />
            {formData?.DATE_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please enter date{" "}
              </p>
            )}
          </div>
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Consultant <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={AllEmpList}
              value={
                formData?.CONSULTANT == ""
                  ? ""
                  : AllEmpList.find((val) => val.value == formData?.CONSULTANT)
              }
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  CONSULTANT: e.value,
                  CONSULTANT_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
            {formData?.CONSULTANT_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Consultant
              </p>
            )}
          </div>
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Time<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Time"
              value={formData?.TIME}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  TIME: NumberInputOnly(e.target.value),
                  TIME_ERROR: false,
                }));
              }}
            />
            {formData?.TIME_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please enter time
              </p>
            )}
          </div>
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Time Unit <span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={timeUnitArr}
              value={
                formData?.TIME_UNIT == ""
                  ? ""
                  : timeUnitArr.find((val) => val.value == formData?.TIME_UNIT)
              }
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  TIME_UNIT: e.value,
                  TIME_UNIT_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
            {formData?.TIME_UNIT_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select time unit
              </p>
            )}
          </div>
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Remarks <span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Remarks"
              value={formData?.REMARKS}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  REMARKS: e.target.value,
                  REMARKS_ERROR: false,
                }));
              }}
            />
            {formData?.REMARKS_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Time UOM
              </p>
            )}
          </div>{" "}
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Details<span className="required-filed">*</span>
            </Label>
            <textarea
              type="text"
              style={{
                width: "100%",
              }}
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Details"
              value={formData?.DETAILS}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  DETAILS: e.target.value,
                  DETAILS_ERROR: false,
                }));
              }}
            />
            {formData?.DETAILS_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please enter details
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

        {/* <div className="m-2 d-flex justify-content">
          <button
            style={{
              marginBottom: -40,
              marginRight: 300,
            }}
            className="signup-button"
          ></button>
        </div> */}
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
        <ReactDataTable columns={columns} data={Tbody} loading={true} />
      </div>
      <Modal
        open={TaskModalOpen}
        onClose={handleTaskUpdateModalClose}
        disableAutoFocus
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Find ticket!</h5>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleTaskUpdateModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <Label className="modal-label" for="basicpill-email-input4">
            Customer <span className="required-filed">*</span>
          </Label>
          <CustomSelect
            options={AllClients}
            value={
              selectedTask?.CLIENT_ID == ""
                ? ""
                : AllClients.find((val) => val.value == selectedTask?.CLIENT_ID)
            }
            onChange={(e) => {
              setSelectedTask((prev) => ({
                ...prev,
                CLIENT_ID: e.value,
                CLIENT_ID_ERROR: false,
              }));
            }}
          />
          {selectedTask?.CLIENT_ID_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Customer
            </p>
          )}
          <Label className="modal-label" for="basicpill-email-input4">
            Date <span className="required-filed">*</span>
          </Label>
          <CustomInput
            type="date"
            name="SUBCATEGORY"
            className="form-control"
            placeholder="Enter Date"
            value={selectedTask?.DATE}
            onChange={(e) => {
              setSelectedTask((prev) => ({
                ...prev,
                DATE: e.target.value,
                DATE_ERROR: false,
              }));
            }}
          />
          {selectedTask?.DATE_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please enter date{" "}
            </p>
          )}
          <Label className="modal-label" for="basicpill-email-input4">
            Consultant <span className="required-filed">*</span>
          </Label>
          <CustomSelect
            options={AllEmpList}
            value={
              selectedTask?.CONSULTANT == ""
                ? ""
                : AllEmpList.find(
                    (val) => val.value == selectedTask?.CONSULTANT
                  )
            }
            onChange={(e) => {
              setSelectedTask((prev) => ({
                ...prev,
                CONSULTANT: e.value,
                CONSULTANT_ERROR: false,
              }));

              // getSubCategory(e.value);
            }}
          />
          {selectedTask?.CONSULTANT_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Consultant
            </p>
          )}
          <Label className="modal-label" for="basicpill-email-input4">
            Details<span className="required-filed">*</span>
          </Label>
          <CustomInput
            type="text"
            name="SUBCATEGORY"
            className="form-control"
            placeholder="Enter Details"
            value={selectedTask?.DETAILS}
            onChange={(e) => {
              setSelectedTask((prev) => ({
                ...prev,
                DETAILS: e.target.value,
                DETAILS_ERROR: false,
              }));
            }}
          />
          {selectedTask?.DETAILS_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please enter details
            </p>
          )}

          <Label className="modal-label" for="basicpill-email-input4">
            Time<span className="required-filed">*</span>
          </Label>
          <CustomInput
            type="text"
            name="SUBCATEGORY"
            className="form-control"
            placeholder="Enter Time"
            value={selectedTask?.TIME}
            onChange={(e) => {
              setSelectedTask((prev) => ({
                ...prev,
                TIME: NumberInputOnly(e.target.value),
                TIME_ERROR: false,
              }));
            }}
          />
          {selectedTask?.TIME_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please enter time
            </p>
          )}
          <Label className="modal-label" for="basicpill-email-input4">
            Time Unit <span className="required-filed">*</span>
          </Label>
          <CustomSelect
            options={timeUnitArr}
            value={
              selectedTask?.TIME_UNIT == ""
                ? ""
                : timeUnitArr.find(
                    (val) => val.value == selectedTask?.TIME_UNIT
                  )
            }
            onChange={(e) => {
              setSelectedTask((prev) => ({
                ...prev,
                TIME_UNIT: e.value,
                TIME_UNIT_ERROR: false,
              }));

              // getSubCategory(e.value);
            }}
          />
          {selectedTask?.TIME_UNIT_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select time unit
            </p>
          )}
          <Label className="modal-label" for="basicpill-email-input4">
            Remarks <span className="required-filed">*</span>
          </Label>
          <CustomInput
            type="text"
            name="SUBCATEGORY"
            className="form-control"
            placeholder="Enter Remarks"
            value={selectedTask?.REMARKS}
            onChange={(e) => {
              setSelectedTask((prev) => ({
                ...prev,
                REMARKS: e.target.value,
                REMARKS_ERROR: false,
              }));
            }}
          />
          {selectedTask?.REMARKS_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Time UOM
            </p>
          )}

          <button
            onClick={(e) => {
              handleUpdate();
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
            Update
          </button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

// export default AddTask
const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(AddTask);
