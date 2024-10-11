import React, { useState, useEffect } from "react";
import { Input, Label } from "reactstrap";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import "./AddProjectManager.css";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  TableRow,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import cogoToast from "cogo-toast";
import { ADDPROJECTMANAGER } from "../../Utils/Routes";
import { saveAs } from "file-saver";

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
function AddProjectManager() {
  const [allUsers, setAllUsers] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const [ClickedRowData, setClickedRowData] = useState(null);

  const [userSelected, setUserSelected] = useState({
    USER_NAME: "",
    ERROR_FLAG: false,
  });
  const [companySelected, setCompanySelected] = useState({
    CLIENT_NAME: "",
    ERROR_FLAG: false,
  });

  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);
  const getAllUsers = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllEmployess).then((res) => {
      let temp = [...res.data];
      temp.map((val) => {
        val.label = val.EMP_NAME + " (" + val.EMP_ID + ")";
        val.value = val.EMP_ID;
      });
      setAllUsers(temp);
    });
  };
  const getAllClients = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllClient).then((res) => {
      let temp = [...res.data];
      temp.map((val) => {
        val.label = val.COMPANY_NAME;
        val.value = val.CLIENT_ID;
      });
      setAllClients(temp);
    });
  };
  useEffect(() => {
    getAllUsers();
    getAllClients();
  }, []);
  const handleAddPm = () => {
    if (userSelected.USER_NAME != "" && companySelected.CLIENT_NAME != "") {
      
      axios
        .post(AXIOS.defaultPort + AXIOS.addPm, {
          CLIENT_ID: companySelected.value,
          PROJECT_MANAGER: userSelected.value,
        })
        .then((res) => {
          cogoToast.success("Manager Added");
          setCompanySelected({ CLIENT_NAME: "", ERROR_FLAG: false });
          setUserSelected({ USER_NAME: "", ERROR_FLAG: false });
          getAllClients();
        });
    }
    if (userSelected.USER_NAME == "") {
      let temp = { ...userSelected };
      temp.ERROR_FLAG = true;
      setUserSelected(temp);
    }
    if (companySelected.CLIENT_NAME == "") {
      let temp = { ...companySelected };
      temp.ERROR_FLAG = true;
      setCompanySelected(temp);
    }
  };
  const handleManagerUpdate = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.updateCategory, {
        ...ClickedRowData,
      })
      .then((res) => {
        cogoToast.success("Category Updated");
        getAllClients();
        handleEditModalClose();
        // setCategory(res.data);
      })
      .catch((err) => {});
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
       name: "Project Manager Name",
       selector: "PROJECT_MANAGER_NAME",
     },
     {
       name: "Employee ID",
       selector: "PROJECT_MANAGER",
     },
     
   ];
    const handleExcelExport = () => {

      let tempData=[]
      allClients.map((val)=>{
        if(val.PROJECT_MANAGER){
          tempData.push({...val});
        }
      });
      let excelData = [...tempData];




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
        saveAs(blob, "Project Manager.csv"); // Use the saveAs function to download the CSV file
      }
    };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADDPROJECTMANAGER}>
      <div
        style={{ marginTop: "3%", marginLeft: "1%", padding: "1%" }}
        className="row manager-input-container"
      >
        <div className="col-md-6">
          <Label for="basicpill-email-input4" className="modal-label">
            Company Name<span className="required-filed">*</span>
          </Label>
          <Select
            value={companySelected}
            options={allClients}
            onChange={(e) => {
              setCompanySelected(e);
            }}
          />
          {companySelected?.ERROR_FLAG && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Company Name{" "}
            </p>
          )}
        </div>
        <div className="col-md-6">
          <Label for="basicpill-email-input4" className="modal-label">
            Project Manager<span className="required-filed">*</span>
          </Label>
          <Select
            value={userSelected}
            options={allUsers}
            onChange={(e) => {
              setUserSelected(e);
            }}
          />
          {userSelected.ERROR_FLAG && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Manager Name{" "}
            </p>
          )}
        </div>

        <div
          style={{ marginRight: "5px", marginTop: "3%" }}
          className="row manager-inner_div"
        >
          <button
            style={{ backgroundColor: "#219bcc" }}
            className="mx-2 col-2 manager-button-style"
            onClick={handleAddPm}
          >
            Add
          </button>
        </div>

        <div style={{ marginTop: "5%" }} className="manager-table">
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
                    Company Name
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Project Manager
                  </th>
                  {/* <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Edit
                  </th> */}
                </tr>
              </TableHead>

              <TableBody>
                {allClients.map((val) => {
                  return (
                    <>
                      {val.PROJECT_MANAGER && (
                        <tr>
                          <td>{val.COMPANY_NAME}</td>
                          <td>
                            {val.PROJECT_MANAGER_NAME} ({val.PROJECT_MANAGER})
                          </td>
                          {/* <td
                        onClick={() => {
                          handleEditModalOpen();
                          let temp = { ...val };
                          let projManager = allUsers.find(
                            (user) => user.USER_ID == val.PROJECT_MANAGER
                          );
                          temp.label = projManager?.USER_NAME;
                          temp.value = projManager?.USER_ID;
                          setClickedRowData(temp);
                        }}
                      >
                        {" "}
                        <EditIcon
                          sx={{ color: "#30344a", cursor: "pointer" }}
                        />
                      </td> */}
                        </tr>
                      )}
                    </>
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
          <Box>{ClickedRowData?.COMPANY_NAME}</Box>
          <div className="col-md-6">
            <Label for="basicpill-email-input4">Project Manager</Label>
            <Select
              value={ClickedRowData}
              options={allUsers}
              onChange={(e) => {
                // setClickedRowData(e);
              }}
            />
            {ClickedRowData?.ERROR_FLAG && (
              <p
                style={{
                  color: "red",
                }}
              >
                Please select Company Name{" "}
              </p>
            )}
          </div>
          {/* <Label for="basicpill-email-input4">Project Manager</Label>
          <Input
            type="text"
            // name="CATEGORY"
            className="form-control"
            placeholder="Enter Category"
            value={ClickedRowData?.PROJECT_MANAGER}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                PROJECT_MANAGER: e.target.value,
              }));
            }}
          /> */}
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={(e) => {
              handleManagerUpdate();
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

export default AddProjectManager;
