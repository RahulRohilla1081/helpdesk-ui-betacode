import React, { useEffect, useState } from "react";
import "./AddUser.css";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import { Input, Label } from "reactstrap";
import EditIcon from "@mui/icons-material/Edit";
import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  TableRow,
  Box,
  Modal,
  Button,
} from "@mui/material";
import AXIOS from "../../Utils/AXIOS";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { connect } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { ADDUSER } from "../../Utils/Routes";
import { saveAs } from "file-saver";
import ReactDataTable from "../../components/ReactDataTable/ReactDataTable";
import * as XLSX from "xlsx";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
  const importStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };


function AddUser(props) {
  const [Tbody, setTbody] = useState([]);

  const headers = [
    "CUSTOMER_ID",
    "USER_NAME",
    "USER_MOBILE",
    "USER_EMAIL",
  ]; // Example headers
  const [pmClients, setPmClients] = useState([]);
  const [ClickedRowData, setClickedRowData] = useState(null);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const [userData, setUserData] = useState({
    USER_NAME: "",
    USER_MOBILE: "",
    USER_EMAIL: "",
    DESIGNATION: "",
    CLIENT_ID: { label: "", value: "" },
    // DESIGNATION_DESCRIPTION: "",
  });
  const getAllClient = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllClient).then((res) => {
      let temp = [];
      res.data.map((val) => {
        temp.push({ ...val, value: val.CLIENT_ID, label: val.COMPANY_NAME });
      });
      setPmClients(temp);
    });
  };
  const getPmClients = () => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getClientDataByPM +
          props?.LOGGED_IN_DATA?.USER_ID
      )
      .then((res) => {
        let temp = [];
        res.data.map((val) => {
          temp.push({ ...val, value: val.CLIENT_ID, label: val.COMPANY_NAME });
        });

        setPmClients(temp);
      });
  };

  const DesignationArr = [{ label: "Manager", value: "Manager" }];

  useEffect(() => {
    getAllUserData();
    if (props.LOGGED_IN_DATA.USER_TYPE?.includes(0)) {
      getAllClient();
    } else if (props.LOGGED_IN_DATA.USER_TYPE?.includes(3)) {
      getPmClients();
    }
  }, []);
  const DownloadImportFormat = () => {
    // Convert array of objects to CSV string

    const csvContent = [headers.join(",")].join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link element
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Set the download link and filename
    link.href = url;
    link.setAttribute("download", "data.csv");

    // Append the link to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link element
    document.body.removeChild(link);
  };

  const createNewUser = () => {
    //     USER_NAME: "",
    // USER_MOBILE: "",
    // USER_EMAIL: "",
    // DESIGNATION: "",
    // CLIENT_ID: { label: "", value: "" },

    if (userData.CLIENT_ID.label == "") {
      toast.error("Please select customer");
    } else if (userData.USER_NAME == "") {
      toast.error("Please enter Name");
    } else if (userData.USER_MOBILE == "") {
      toast.error("Please enter mobile number");
    } else if (userData.USER_EMAIL == "") {
      toast.error("Please enter email ID");
    }
    let payload = { ...userData };

    console.log("Asdasdsadasd", payload);

    let payloadFormData = new FormData();

    if (payload.CLIENT_ID != "") {
      payload.CLIENT_ID = payload.CLIENT_ID.value;
    }
    // payloadFormData.append(`CLIENT_ID`, payload.CLIENT_ID);
    // payloadFormData.append(`DESIGNATION`, payload.DESIGNATION);
    // payloadFormData.append(`USER_EMAIL`, payload.USER_EMAIL);
    // payloadFormData.append(`USER_MOBILE`, payload.USER_MOBILE);
    // payloadFormData.append(`USER_NAME`, payload.USER_NAME);
    // payloadFormData.append(`USER_LOGO`, payload.USER_LOGO);

    // for (var pair of payloadFormData.entries()) {
    //   console.log("sdasdasdasdasdsad", pair[0] + ", " + pair[1]);
    // }

    axios
      .post(AXIOS.defaultPort + AXIOS.createUser, payload)
      .then((res) => {
        if (res.data.existFlag == true) {
          toast.error("This user already exists");
        } else {
          toast.success("User Created Successfully");
          setUserData({
            USER_NAME: "",
            USER_MOBILE: "",
            USER_EMAIL: "",
            // DESIGNATION: "",
            CLIENT_ID: { label: "", value: "" },
            // DESIGNATION_DESCRIPTION: "",
          });
          getAllUserData();
        }
      })
      .catch((err) => {});
  };
  const handleUserUpdate = () => {
    let payload = { ...ClickedRowData };
    // if (payload.DESIGNATION != "") {
    //   payload.DESIGNATION = payload.DESIGNATION.value;
    // }
    axios
      .post(AXIOS.defaultPort + AXIOS.updateUser, {
        ...payload,
      })
      .then((res) => {
        toast.success("User Updated Successfully");
        getAllUserData();
        handleEditModalClose();
      })
      .catch((err) => {});
  };
  const handleUserDelete = () => {
    let payload = { ...ClickedRowData };
    // if (payload.DESIGNATION != "") {
    //   payload.DESIGNATION = payload.DESIGNATION.value;
    // }
    axios
      .post(AXIOS.defaultPort + AXIOS.deleteUser, {
        USER_ID: payload.USER_ID,
      })
      .then((res) => {
        toast.success("User Deleted");
        getAllUserData();
        handleDeleteModalClose();
      })
      .catch((err) => {});
  };

  const getAllUserData = () => {
    if (props.LOGGED_IN_DATA.USER_TYPE?.includes(0)) {
      axios
        .get(AXIOS.defaultPort + AXIOS.getAllUser)
        .then((res) => {
          setTbody(res.data);

          // setCategory(res.data);
        })
        .catch((err) => {});
    } else if (props.LOGGED_IN_DATA.USER_TYPE?.includes(3)) {
      axios
        .get(
          AXIOS.defaultPort + AXIOS.getUserForPm + props.LOGGED_IN_DATA.USER_ID
        )
        .then((res) => {
          setTbody(res.data);

          // setCategory(res.data);
        })
        .catch((err) => {});
    }
  };
  const CsvHeader = [
    {
      name: "Company ID",
      selector: "CLIENT_ID",
    },
    {
      name: "Company Name",
      selector: "COMPANY_NAME",
    },

    {
      name: "User ID",
      selector: "USER_ID",
    },
    {
      name: "User Name",
      selector: "USER_NAME",
    },
    {
      name: "Mobile",
      selector: "USER_MOBILE",
    },
    {
      name: "Email ID",
      selector: "USER_EMAIL",
    },
  ];

  const [ImportModalOpen, setImportModalOpen] = useState(false);
  const handleImportModalOpen = () => setImportModalOpen(true);
  const handleImportModalClose = () => setImportModalOpen(false);

  const importColumns = [
    {
      name: "Employee Name",
      width: "200px",

      selector: (val) => val.EMP_NAME,
      sortable: false,
    },
    {
      name: "Employee Mobile",
      width: "200px",

      selector: (val) => val.EMP_MOBILE,
      sortable: false,
    },
    {
      name: "Employee Email",
      width: "200px",

      selector: (val) => val.EMP_EMAIL,
      sortable: false,
    },
    {
      name: "Reporting Manager",
      width: "200px",

      selector: (val) => val.REPORTING_MANAGER,
      sortable: false,
    },
    {
      name: "Designation",
      width: "200px",

      selector: (val) => val.DESIGNATION,
      sortable: false,
    },
    {
      name: "Work Location",
      width: "200px",

      selector: (val) => val.WORK_LOCATION,
      sortable: false,
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
      saveAs(blob, "Users.csv"); // Use the saveAs function to download the CSV file
    }
  };
  const [importFieldData, setImportFieldData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    console.log("Asdjkasdjksa", file);

    const reader = new FileReader();

    // Define the expected headers

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Assume the first sheet is the one you want to read
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert the sheet to JSON format (header row is considered as row 1)
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Check if the headers match the expected format
      const fileHeaders = data[0]; // Get the first row, which should be the header

      // Compare headers with the expected headers
      const headersMatch =
        JSON.stringify(fileHeaders) === JSON.stringify(headers);

      // Check if there is at least one data row (i.e., data array length > 1)
      const hasDataRow = data.length > 1;

      if (headersMatch && hasDataRow) {
        // Transform data to array of objects
        const formattedData = data.slice(1).map((row) => {
          return headers.reduce((obj, header, index) => {
            // Set an empty string if no data is present in the cell
            obj[header] = row[index] !== undefined ? row[index] : "";
            return obj;
          }, {});
        });

        // Set the data to state
        setImportFieldData(formattedData);

        handleImportModalOpen();
      } else {
        // If headers do not match or no data row is present, alert the user
        let errorMessage = "Error: ";
        if (!headersMatch)
          errorMessage += "Headers do not match the expected format.";
        if (!hasDataRow) errorMessage += " There is no data row in the file.";
        alert(errorMessage);
      }
    };

    reader.readAsBinaryString(file);
  };
  const handleEmployeeImport = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.deleteEmployeeAndSave, {
        importFieldData,
      })
      .then((res) => {
        console.log("asdkjasndhjasd", res.data);
        toast.success("Employee Deleted");
        getEmployeeList();
        handleDeleteModalClose();
      })
      .catch((err) => {
        console.log("ASdajksbdjghasd", err);
      });
  };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADDUSER}>
      <Toaster />
      <div className="user-input-container">
        <div className="row user-sub-input-container">
          <div
            className="mb-3 "
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <label
              htmlFor="upload"
              className="import-button"
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                borderRadius: 4,
                // marginRight: 5,
                // marginLeft: 5,
                minHeight: 30,
                maxHeight: 30,
                minWidth: 150,
                backgroundColor: "#347928",
              }}
            >
              Import Employees
            </label>
            <input
              type="file"
              name="upload"
              className="form-control"
              hidden={true}
              multiple
              id="upload"
              accept=".csv, .xlsx, .xls"
              style={{
                backgroundColor: "#347928",
              }}
              onChange={(e) => {
                handleFileUpload(e);
                // const fileArray = Array.from(fileList);
                // setSelectedFiles((prevState) => [...prevState, ...fileArray]);
              }}
            />
            <button
              style={{
                marginLeft: 10,
                minWidth: 150,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => {
                DownloadImportFormat();
              }}
              className="signup-button"
            >
              Download format
            </button>
          </div>
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label">
              Customer<span className="required-filed">*</span>
            </Label>
            <Select
              value={userData.CLIENT_ID}
              options={pmClients}
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  CLIENT_ID: e,
                }));
              }}
            />
          </div>
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label">
              User Name<span className="required-filed">*</span>
            </Label>

            <Input
              type="text"
              name="USERNAME"
              className="form-control"
              placeholder="Enter User Name"
              value={userData.USER_NAME}
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  USER_NAME: e.target.value,
                }));
              }}
            />
          </div>
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label">
              User Mobile<span className="required-filed">*</span>
            </Label>
            <Input
              type="number"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Mobile Number"
              value={userData.USER_MOBILE}
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  USER_MOBILE: e.target.value,
                }));
              }}
            />
          </div>
          <div className="col-md-3">
            <Label for="basicpill-email-input4" className="modal-label">
              Email ID<span className="required-filed">*</span>
            </Label>
            <Input
              type="text"
              name="EMIALID"
              className="form-control"
              placeholder="Enter Email id"
              value={userData.USER_EMAIL}
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  USER_EMAIL: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        {/* <div className="row company-sub-input-container">
          <div className="col-md-6">
            <Label for="basicpill-email-input4">DESIGNATION DESCRIPTION</Label>
            <Input
              type="textarea"
              name="DESIGNATION_DESCRIPTION"
              className="form-control"
              placeholder="Enter Description"
              value={userData.DESIGNATION_DESCRIPTION}
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,

                  DESIGNATION_DESCRIPTION: e.target.value,
                }));
              }}
            />
          </div>
        </div> */}

        <div style={{ marginRight: "5px" }} className="row user-inner_div">
          <button
            style={{ backgroundColor: "#219bcc" }}
            className="mx-2 col-2 user-button-style"
            onClick={() => {
              createNewUser();
            }}
          >
            Add
          </button>
        </div>

        <div className="user-table">
          <div className="m-2 d-flex justify-content-end">
            <button
              style={
                {
                  // marginRight: 10,
                }
              }
              onClick={() => {
                handleExcelExport();
              }}
              className="signup-button"
            >
              Excel Export
            </button>
          </div>
          <TableContainer>
            <Table aria-label="customized table" stickyHeader>
              <TableHead className="scroll-effect">
                <tr>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    User ID
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    User Name
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    User Mobile
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    User Email Id
                  </th>

                  {/* <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Designation Description
                  </th> */}
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </TableHead>

              <TableBody>
                {Tbody.map((val) => {
                  return (
                    <tr>
                      <td>{val.COMPANY_NAME}</td>
                      <td>{val.USER_ID}</td>
                      <td>{val.USER_NAME}</td>
                      <td>{val.USER_MOBILE}</td>
                      <td>{val.USER_EMAIL}</td>
                      {/* <td>{val.DESIGNATION_DESCRIPTION}</td> */}
                      <td>
                        <EditIcon
                          sx={{
                            color: "#30344a",
                            cursor: "pointer",
                            height: 20,
                          }}
                          onClick={() => {
                            handleEditModalOpen();

                            let temp = { ...val };
                            // temp.DESIGNATION = DesignationArr.find(
                            //   (item) => item.value == val.DESIGNATION
                            // );
                            setClickedRowData(temp);
                          }}
                        />
                        <DeleteIcon
                          sx={{
                            color: "#30344a",
                            cursor: "pointer",
                            height: 20,
                          }}
                          onClick={() => {
                            handleDeleteModalOpen();

                            // let temp = { ...val };
                            // temp.DESIGNATION = DesignationArr.find(
                            //   (item) => item.value == val.DESIGNATION
                            // );
                            setClickedRowData(val);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Modal
        open={EditModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Update Item</h5>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleEditModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            Company Name
          </Label>
          <Input
            type="text"
            name="USERNAME"
            className="form-control"
            disabled
            placeholder="Enter User Name"
            value={ClickedRowData?.COMPANY_NAME}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            User Name
          </Label>
          <Input
            type="text"
            name="USERNAME"
            className="form-control"
            placeholder="Enter User Name"
            value={ClickedRowData?.USER_NAME}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                USER_NAME: e.target.value,
              }));
            }}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            User Mobile
          </Label>
          <Input
            type="number"
            name="COMPANYNAME"
            className="form-control"
            placeholder="Enter Mobile Number"
            value={ClickedRowData?.USER_MOBILE}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                USER_MOBILE: e.target.value,
              }));
            }}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            Email ID
          </Label>
          <Input
            type="text"
            name="EMIALID"
            className="form-control"
            placeholder="Enter Email id"
            value={ClickedRowData?.USER_EMAIL}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                USER_EMAIL: e.target.value,
              }));
            }}
          />
          {/* <Label for="basicpill-email-input4">Designation</Label>
          <Select
            options={[{ label: "Manager", value: "Manager" }]}
            value={ClickedRowData?.DESIGNATION}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,

                DESIGNATION: e,
              }));
            }}
          /> */}
          {/* <Label for="basicpill-email-input4">DESIGNATION DESCRIPTION</Label>
          <Input
            type="textarea"
            name="DESIGNATION_DESCRIPTION"
            className="form-control"
            placeholder="Enter Description"
            value={ClickedRowData?.DESIGNATION_DESCRIPTION}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,

                DESIGNATION_DESCRIPTION: e.target.value,
              }));
            }}
          /> */}
          <button
            // variant="contained"
            // sx={{ mt: 1 }}
            onClick={(e) => {
              handleUserUpdate();
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
            Update
          </button>
        </Box>
      </Modal>
      <Modal
        open={DeleteModalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Confirmation!</h5>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleEditModalClose}
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
            Are you sure you want delete user?
          </Label>
          <br />

          <button
            onClick={(e) => {
              handleUserDelete();
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
            Delete
          </button>
        </Box>
      </Modal>
      <Modal
        open={ImportModalOpen}
        onClose={handleImportModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={importStyle}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Import Employee</h5>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleImportModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />

          <ReactDataTable columns={importColumns} data={importFieldData} />

          <button
            // variant="contained"
            // sx={{ mt: 1 }}
            onClick={(e) => {
              handleEmployeeImport();
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
            Confirm
          </button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

const mapStateToProps = (state) => ({
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(AddUser);
