import React, { useEffect, useState } from "react";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import toast, { Toaster } from "react-hot-toast";
import ReactDataTable from "../../components/ReactDataTable/ReactDataTable";
import { ADD_EMPLOYEES } from "../../Utils/Routes";
import { Label } from "reactstrap";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import CustomInput from "../../components/CustomInput/CustomInput";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { saveAs } from "file-saver";




function AddEmployees() {
  const [Tbody, setTbody] = useState([]);
  const [formData, setFormData] = useState({
    EMP_ID: "",
    EMP_ID_ERROR: false,
    EMP_NAME: "",
    EMP_NAME_ERROR: false,
    EMP_MOBILE: "",
    EMP_MOBILE_ERROR: false,
    EMP_EMAIL: "",
    EMP_EMAIL_ERROR: false,
  });
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

    const [ClickedRowData, setClickedRowData] = useState(null);
    const [EditModalOpen, setEditModalOpen] = useState(false);
    const handleEditModalOpen = () => setEditModalOpen(true);
    const handleEditModalClose = () => setEditModalOpen(false);


    const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
    const handleDeleteModalOpen = () => setDeleteModalOpen(true);
    const handleDeleteModalClose = () => setDeleteModalOpen(false);

  const columns = [
    {
      name: "Employee ID",
      selector: (val) => val.EMP_ID,
      sortable: false,
      //   cell: (val) => (
      //     <p>
      //       <span>
      //         {val.COMPANY_NAME} ({val.CLIENT_ID})
      //       </span>
      //     </p>
      //   ),
      // width: "80px",
    },
    {
      name: "Employee Name",
      selector: (val) => val.EMP_NAME,
      sortable: false,
      //   cell: (val) => (
      //     <p>
      //       <span>
      //         {val.COMPANY_NAME} ({val.CLIENT_ID})
      //       </span>
      //     </p>
      //   ),
      // width: "80px",
    },
    {
      name: "Mobile Number",
      selector: (val) => val.EMP_MOBILE,
      sortable: false,
      //   cell: (val) => (
      //     <p>
      //       <span>
      //         {val.COMPANY_NAME} ({val.CLIENT_ID})
      //       </span>
      //     </p>
      //   ),
      // width: "80px",
    },
    {
      name: "Email ID",
      selector: (val) => val.EMP_EMAIL,
      sortable: false,
      //   cell: (val) => (
      //     <p>
      //       <span>
      //         {val.COMPANY_NAME} ({val.CLIENT_ID})
      //       </span>
      //     </p>
      //   ),
      // width: "80px",
    },
    {
      name: "Edit",
      selector: (val) => val.EMP_EMAIL,
      sortable: false,
      cell: (val) => (
        <span>
          <EditIcon
            sx={{
              color: "#30344a",
              cursor: "pointer",
              height: 20,
            }}
            onClick={() => {
              handleEditModalOpen();

              let temp = { ...val };

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

              let temp = { ...val };

              setClickedRowData(temp);
            }}
          />
        </span>
      ),
      width: "80px",
    },
  ];

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

      console.log("asdhbaghdbasdas", payload);
      axios
        .post(AXIOS.defaultPort + AXIOS.createEmployee, payload)
        .then((response) => {
          toast.success("Employee Created");
          getEmployeeList();

          Object.keys(tempFormData).map((key, colIndex) => {
            if (typeof tempFormData[key] != "boolean") {
              tempFormData[key] = "";
            }
          });
        })
        .catch(() => {});
    }

    setFormData(tempFormData);

    // console.log("Adkabsdhjasd",tempTATData);
  };

  useEffect(()=>{
getEmployeeList();
  },[])

  const getEmployeeList = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getEmployee)
      .then((response) => {
console.log("ASdaskjdaas", response.data);
        setTbody(response.data);
      })
      .catch((err) => {
        console.log("Asdkjabdhjasd", err);
      });
    // console.log("Adkabsdhjasd",tempTATData);
  };

  const handleEmployeeUpdate = () => {

    // if (payload.DESIGNATION != "") {
    //   payload.DESIGNATION = payload.DESIGNATION.value;
    // }



    console.log("Adaskbhdasdasd", ClickedRowData);

    axios
      .post(AXIOS.defaultPort + AXIOS.updateEmployee, ClickedRowData)
      .then((res) => {
        console.log("asdkjasndhjasd", res.data);
        toast.success("Employee details Updated Successfully");
        getEmployeeList();
        handleEditModalClose();
      })
      .catch((err) => {});
  };
  const handleEmployeeDelete = () => {

    // if (payload.DESIGNATION != "") {
    //   payload.DESIGNATION = payload.DESIGNATION.value;
    // }



    axios
      .post(AXIOS.defaultPort + AXIOS.deleteEmployeeAndSave+ ClickedRowData.EMP_ID)
      .then((res) => {
        console.log("asdkjasndhjasd", res.data);
        toast.success("Employee Deleted");
        getEmployeeList();
        handleDeleteModalClose();
      })
      .catch((err) => {
        console.log("ASdajksbdjghasd",err);
      });
  };
   const CsvHeader = [
     {
       name: "Employee ID",
       selector: "EMP_ID",
     },
     {
       name: "Employee Name",
       selector: "EMP_NAME",
     },
     {
       name: "Mobile Number",
       selector: "EMP_MOBILE",
     },

     {
       name: "Email ID",
       selector: "EMP_EMAIL",
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
        saveAs(blob, "Employees.csv"); // Use the saveAs function to download the CSV file
      }
    };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADD_EMPLOYEES}>
      <Toaster />
      <div className="item-input-container">
        <div className="row item-sub-input-container">
          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Employee ID<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Employee ID"
              value={formData.EMP_ID}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  EMP_ID: e.target.value,
                  EMP_ID_ERROR: false,
                }));
              }}
            />
            {formData?.EMP_ID_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please enter employee ID
              </p>
            )}
          </div>

          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Employee Name <span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Employee Name"
              value={formData.EMP_NAME}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  EMP_NAME: e.target.value,
                  EMP_NAME_ERROR: false,
                }));
              }}
            />
            {formData?.EMP_NAME_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please enter Employee Name
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Email ID <span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Email ID"
              value={formData.EMP_EMAIL}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  EMP_EMAIL: e.target.value,
                  EMP_EMAIL_ERROR: false,
                }));
              }}
            />
            {formData?.EMP_EMAIL_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please enter email
              </p>
            )}
          </div>
          <div className="col-md-3">
            <Label className="modal-label" for="basicpill-email-input4">
              Mobile Number<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Mobile"
              value={formData.EMP_MOBILE}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  EMP_MOBILE: e.target.value,
                  EMP_MOBILE_ERROR: false,
                }));
              }}
            />
            {formData?.EMP_MOBILE_ERROR && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please enter mobile number
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

      <Modal
        open={EditModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>Update Employee</h5>
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
            Employee ID
          </Label>
          <CustomInput
            type="text"
            name="USERNAME"
            disabled={true}
            className="form-control"
            placeholder="Enter Employee ID"
            value={ClickedRowData?.EMP_ID}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                EMP_ID: e.target.value,
              }));
            }}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            Employee Name
          </Label>
          <CustomInput
            type="text"
            name="USERNAME"
            className="form-control"
            placeholder="Enter Employee Name"
            value={ClickedRowData?.EMP_NAME}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                EMP_NAME: e.target.value,
              }));
            }}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            Email ID
          </Label>
          <CustomInput
            type="text"
            name="COMPANYNAME"
            className="form-control"
            placeholder="Enter Email ID"
            value={ClickedRowData?.EMP_EMAIL}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                EMP_EMAIL: e.target.value,
              }));
            }}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            Email ID
          </Label>
          <CustomInput
            type="text"
            name="EMIALID"
            className="form-control"
            placeholder="Enter Mobile Number"
            value={ClickedRowData?.EMP_MOBILE}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                EMP_MOBILE: e.target.value,
              }));
            }}
          />

          {/* <Label for="basicpill-email-input4">Designation</Label>
        
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
              handleEmployeeUpdate();
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
            <h5>Delete Employee</h5>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleDeleteModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <p>
            <h5>Are you sure, you want to delete this employee?</h5>
          </p>

          {/* <Label for="basicpill-email-input4">Designation</Label>
        
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
              handleEmployeeDelete();
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

export default AddEmployees;
