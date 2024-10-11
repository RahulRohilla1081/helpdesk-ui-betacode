import React, { useEffect, useState } from "react";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import { Input, Label } from "reactstrap";
import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  TableRow,
  Modal,
  Button,
  Box,
  Tooltip,
  Divider,
} from "@mui/material";
import "./AddTechnician.css";

import DeleteIcon from "@mui/icons-material/Delete";

import Select from "react-select";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import toast, { Toaster } from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import { connect } from "react-redux";
import { ADDTECHNICIAN } from "../../Utils/Routes";
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

function AddTechnician() {
  const [ClientData, setClientData] = useState([]);
  const [SelectedEmployees, setSelectedEmployees] = useState(null);

  const [selectedOption, setSelectedOption] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);
  const [SubCategoryData, setSubCategoryData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [Tbody, setTbody] = useState([]);
  useEffect(() => {
    getAllClient();
    getAllCategory();
    getAllUser();
    getAllEmployees();
    getTechnicians();
  }, []);

  const technicianArr = [
    { label: "Technician-1", value: "Technician-1" },
    { label: "Technician-2", value: "Technician-2" },
  ];

  const [technicianData, setTechnicianData] = useState({
    CLIENT_ID: "",
    CATEGORY_ID: "",
    SUB_CATEGORY_ID: "",
    EMP_ID: "",
  });

  const [ClickedRowData, setClickedRowData] = useState(null);

  const [EditModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);
  const getAllClient = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllClient).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.CLIENT_NAME, value: val.CLIENT_ID, ...val });
      });
      setClientData(temp);
    });
  };
  const getAllUser = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllUser).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.USER_NAME, value: val.USER_ID, ...val });
      });

      setUserData(temp);
    });
  };
  const getTechnicians = () => {
    //correct API
    axios.get(AXIOS.defaultPort + AXIOS.getAllTechnician).then((response) => {
      let temp = [];

      response.data.map((val) => {
        temp.push({ label: val.EMP_ID, value: val.EMP_NAME, ...val });
      });
      console.log("ASdashbdhjasdas", temp);

      setTechnician(temp);
    });
  };
  const getAllEmployees = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllEmployess).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({
          label: `${val.EMP_NAME} (${val.EMP_ID})`,
          value: val.EMP_ID,
          ...val,
        });
      });

      setEmployees(temp);
    });
  };
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

  const handleSubmit = () => {
    //     CLIENT_ID: "",
    // CATEGORY_ID: "",
    // SUB_CATEGORY_ID: "",
    // EMP_ID: "",
    if (technicianData?.CATEGORY_ID == "") {
      toast.error("Please select category");
    } else if (technicianData?.SUB_CATEGORY_ID == "") {
      toast.error("Please select sub category");
    } else if (technicianData?.EMP_ID == "") {
      toast.error("Please select consultant");
    } else {
      let payload = {
        // CLIENT_ID: technicianData?.CLIENT_ID?.value,
        CATEGORY_ID: technicianData?.CATEGORY_ID?.value,
        SUBCATEGORY_ID: technicianData.SUB_CATEGORY_ID.value,
        EMP_ID: technicianData.EMP_ID.value,
      };

      axios
        .post(AXIOS.defaultPort + AXIOS.technicianMapping, {
          ...payload,
        })
        .then((response) => {
          setTechnicianData({
            CLIENT_ID: "",
            CATEGORY_ID: "",
            SUB_CATEGORY_ID: "",
            EMP_ID: "",
          });
          if (response.data.existFlag == true) {
            toast.error(
              "This consultant already mapped for this category and subcategory"
            );
          } else {
            toast.success("Consultant mapped");
          }
          getTechnicians();
        });
    }
  };
  const handleTechnicianUpdate = (ClickedRowData) => {
    axios
      .post(AXIOS.defaultPort + AXIOS.deleteTechnician, {
        ...ClickedRowData,
      })
      .then((response) => {
        toast.success("Deleted");
        getTechnicians();
      });
  };
  const handleTechnicianSMEUpdate = () => {
    console.log("ASdaksbdjhasdas", SelectedEmployees);

    axios
      .post(AXIOS.defaultPort + AXIOS.smeRoleUpdate, {
        ...SelectedEmployees,
      })
      .then((response) => {
        handleEditModalClose();
        toast.success("SME Updated");
        getTechnicians();
      });
  };

  const handleClickRow = (data) => {
    // delete tempData.SUBCATEGORY_ID
    getSubCategory(data.CATEGORY_ID).then((response) => {
      let tempData = { ...data };

      const subCatData = response.find((val) => {
        return val.value === data.SUBCATEGORY_ID;
      });
      tempData.SUBCATEGORY_ID = subCatData.value;
      setClickedRowData(tempData);
    });
  };
  const CsvHeader = [
    {
      name: "Category ID",
      selector: "CATEGORY_ID",
    },
    {
      name: "Category Name",
      selector: "CATEGORY_NAME",
    },
    {
      name: "Sub Category ID",
      selector: "SUBCATEGORY_ID",
    },
    {
      name: "Sub Category Name",
      selector: "SUB_CATEGORY_NAME",
    },
    {
      name: "Employee ID",
      selector: "EMP_ID",
    },
    {
      name: "Employee Name",
      selector: "EMP_NAME",
    },
  ];
  const handleExcelExport = () => {
    let excelData = [...technician];

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
      saveAs(blob, "Consultant.csv"); // Use the saveAs function to download the CSV file
    }
  };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADDTECHNICIAN}>
      <Toaster />
      <div className="technician-input-container">
        <div className="row technician-sub-input-container">
          {/* <div className="col-md-4">
            <Label for="basicpill-email-input4">Client</Label>
            <Select
              options={ClientData}
              value={technicianData.CLIENT_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  CLIENT_ID: e,
                }));
              }}
            />
          </div> */}
          <div className="col-md-4">
            <Label for="basicpill-email-input4">
              Category Name<span className="required-filed">*</span>
            </Label>
            <Select
              options={CategoryData}
              value={technicianData.CATEGORY_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  CATEGORY_ID: e,
                }));

                getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4">
              Sub Category<span className="required-filed">*</span>
            </Label>
            <Select
              options={SubCategoryData}
              value={technicianData.SUB_CATEGORY_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  SUB_CATEGORY_ID: e,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4">
              Consultant<span className="required-filed">*</span>
            </Label>
            <Select
              options={employees}
              value={technicianData.EMP_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  EMP_ID: e,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4 form-check mt-2 ">
            <Label for="basicpill-email-input4">
              SME(Subject Matter Expert)
              <span className="required-filed">*</span>
            </Label>
            <div className="form-group" id="TypeRequirement">
              <div
                className="d-flex "
                id="select1"
                style={{ gap: 10, marginLeft: 20 }}
              >
                <div className="" id="ServiceRequest">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="statusOfFeed"
                    id="status1"
                    value={1}
                    checked={selectedOption == "1" ? true : false}
                    // onChange={handleOptionChange}
                    onChange={(e) => {
                      setSelectedOption("1");
                      setTechnicianData((prev) => ({
                        ...prev,
                        SME: true,
                      }));

                      // getSubCategory(e.value);
                    }}
                  />
                  <label className="form-check-label" htmlFor="status1">
                    Yes
                  </label>
                </div>
                <div className="form-check" id="NewRequirement">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="statusOfFeed"
                    id="status2"
                    value={2}
                    checked={selectedOption == "2" ? true : false}
                    // onChange={handleOptionChange}
                    onChange={(e) => {
                      setSelectedOption("2");
                      setTechnicianData((prev) => ({
                        ...prev,
                        SME: false,
                      }));
                    }}
                  />
                  <label className="form-check-label" htmlFor="status2">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row company-sub-input-container">
          {/* <div className="col-md-4">
            <Label for="basicpill-email-input4">Technician</Label>
            <Select
              options={employees}
              value={technicianData.EMP_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  EMP_ID: e,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div> */}
        </div>

        <div
          style={{ marginRight: "5px" }}
          className="row technician-inner_div"
        >
          <button
            style={{ backgroundColor: "#219bcc" }}
            className="mx-2 col-2 technician-button-style"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
        </div>

        <div className="technician-table">
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
                  {/* <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Client
                  </th> */}
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Category
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Sub category
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Consultant
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    SME
                  </th>
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
                {technician?.map((item) => {
                  return (
                    <tr className="tr">
                      {/* <td>{item.CLIENT_ID}</td> */}
                      <td>
                        {item.CATEGORY_NAME} ({item.CATEGORY_ID})
                      </td>
                      <td>
                        {item.SUB_CATEGORY_NAME}({item.SUBCATEGORY_ID})
                      </td>
                      <td>
                        {item.EMP_NAME} ({item.EMP_ID})
                      </td>
                      <td>
                        {item.USER_ROLE && item.USER_ROLE.includes(7) ? (
                          <div
                            style={{
                              height: 10,
                              width: 10,
                              backgroundColor: "green",
                              borderRadius: 5,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              height: 10,
                              width: 10,
                              backgroundColor: "red",
                              borderRadius: 5,
                            }}
                          />
                        )}
                      </td>
                      <td>
                        <EditIcon
                          onClick={() => {
                            handleEditModalOpen();
                            console.log("ASdasdkasdas", {
                              ...item,
                              SME: item.USER_ROLE.includes(7),
                            });

                            setSelectedEmployees({
                              ...item,
                              SME: item.USER_ROLE.includes(7),
                            });
                            // setClickedRowData(val);
                            // handleClickRow(item);
                          }}
                          style={{
                            cursor: "pointer",
                            height: 20,
                          }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            handleTechnicianUpdate(item);
                            // setClickedRowData(val);
                            // handleClickRow(item);
                          }}
                          style={{
                            cursor: "pointer",
                            height: 20,
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
          <Label
            for="basicpill-email-input4"
            style={{
              fontWeight: 500,
              fontSize: 20,
            }}
          >
            SME Update
          </Label>
          <br />
          <Divider />
          <Label for="basicpill-email-input4">SME(Subject Matter Expert)</Label>
          <div className="form-group" id="TypeRequirement">
            <div className="d-flex" id="select1" style={{ gap: 10 }}>
              <div className="form-check" id="ServiceRequest">
                <input
                  className="form-check-input"
                  type="radio"
                  name="statusOfFeed"
                  id="status1"
                  value={1}
                  checked={SelectedEmployees?.SME == true}
                  // onChange={handleOptionChange}
                  onChange={(e) => {
                    setSelectedEmployees((prev) => ({
                      ...prev,
                      SME: true,
                    }));

                    // getSubCategory(e.value);
                  }}
                />
                <label className="form-check-label" htmlFor="status1">
                  Yes
                </label>
              </div>
              <div className="form-check" id="NewRequirement">
                <input
                  className="form-check-input"
                  type="radio"
                  name="statusOfFeed"
                  id="status2"
                  value={2}
                  checked={SelectedEmployees?.SME == false}
                  // onChange={handleOptionChange}
                  onChange={(e) => {
                    setSelectedEmployees((prev) => ({
                      ...prev,
                      SME: false,
                    }));
                  }}
                />
                <label className="form-check-label" htmlFor="status2">
                  No
                </label>
              </div>
            </div>
          </div>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={(e) => {
              handleTechnicianSMEUpdate();
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

const mapStateToProps = (state) => ({
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(AddTechnician);
