import React, { useEffect, useState } from "react";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import { Input, Label } from "reactstrap";
import DeleteIcon from "@mui/icons-material/Delete";

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
} from "@mui/material";
// import "./AddTechnician.css";

import Select from "react-select";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import toast, { Toaster } from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import { connect } from "react-redux";
import cogoToast from "cogo-toast";
import { ADDTECHNICIAN } from "../../Utils/Routes";
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

function AddTechnicianManager(props) {
  const [ClientData, setClientData] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);
  const [SubCategoryData, setSubCategoryData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [ClientTechnicianOptions, setClientTechnicianOptions] = useState([]);
  const [techOptions, setTechOptions] = useState([]);
  const [employeesByPM, setEmployeesByPM] = useState([]);
  const [Tbody, setTbody] = useState([]);
  useEffect(() => {
    getAllClient();
    getAllCategory();
    getAllUser();
    getAllEmployees();
    getTechnicians();
    getProjectsData();
    getEmpbyPM();
  }, [props.LOGGED_IN_DATA.USER_ID]);

  const technicianArr = [
    { label: "Technician-1", value: "Technician-1" },
    { label: "Technician-2", value: "Technician-2" },
  ];

  const [technicianData, setTechnicianData] = useState({
    CLIENT_ID: "",
    CATEGORY_ID: "",
    SUB_CATEGORY_ID: "",
    EMP_ID: "",
    PROJECT_ID: "",
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
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getTechnicianMap +
          props.LOGGED_IN_DATA.USER_ID
      )
      .then((response) => {
        let temp = [];

        // response.data.map((val) => {
        //   val.TECHNICIANS.map((item) => {
        //     item.value = item.EMP_ID;
        //     item.label = item.EMP_NAME;
        //     temp.push({
        //       CLIENT_ID: val.CLIENT_ID,
        //       COMPANY_NAME: val.COMPANY_NAME,
        //       EMP_NAME: item.EMP_NAME,
        //       EMP_ID: item.EMP_ID,
        //     });
        //   });
        // });
        setTechnician(response.data);
      });
  };
  const getAllEmployees = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllEmployess).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.EMP_NAME, value: val.EMP_ID, ...val });
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
  const getProjectsData = () => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getProjectClient +
          props.LOGGED_IN_DATA.USER_ID
      )
      .then((response) => {
        let temp = [];
        response.data.map((val) => {
          temp.push({ label: val.COMPANY_NAME, value: val.CLIENT_ID, ...val });
        });
        setProjectData(temp);
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

  const getEmpbyPM = () => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getEmployeesByPM +
          props.LOGGED_IN_DATA.USER_ID
      )
      .then((res) => {
        const uniqueEmpIds = [
          ...new Set(
            res.data.flatMap((item) => item.EMPLOYEES.map((emp) => emp.EMP_ID))
          ),
        ];

        setEmployeesByPM(uniqueEmpIds);
      });
  };

  const handleSubmit = () => {
    let payload = {
      CLIENT_ID: technicianData.PROJECT_ID.value,
      EMP_ID: technicianData.EMP_ID.value,
      SUB_CATEGORY_ID: technicianData.SUB_CATEGORY_ID.value,
      CATEGORY_ID: technicianData.CATEGORY_ID.value,
    };

    axios
      .post(AXIOS.defaultPort + AXIOS.createTechnicianMap, {
        ...payload,
      })
      .then((response) => {
        setTechnicianData({
          PROJECT_ID: "",
          CATEGORY_ID: "",
          SUB_CATEGORY_ID: "",
          EMP_ID: "",
        });
        if (response.data.existFlag == true) {
          toast.error("This technician already mapped for this client");
        } else {
          toast.success("Technician mapped");
        }
        getTechnicians();
      });
  };
  const handleTechnicianUpdate = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.createTechnicianMap, {
        ...ClickedRowData,
      })
      .then((response) => {
        toast.success("Updated");
      });
  };

  const handleClickRow = (data) => {
    // let tempData = { ...data };
    // getSubCategory(data.CATEGORY_ID).then((response) => {
    //   const subCatData = response.find((val) => {
    //     return val.value === data.SUBCATEGORY_ID;
    //   });
    //   // tempData.SUBCATEGORY_ID = subCatData;
    // });

    // setClickedRowData(data);
    axios
      .post(
        AXIOS.defaultPort +
          AXIOS.deleteTechnicianMP +
          data.EMP_ID +
          "&cId=" +
          data.CLIENT_ID +
          "&cat=" +
          data.CATEGORY_ID +
          "&subCat=" +
          data.SUB_CATEGORY_ID
      )
      .then((res) => {
        cogoToast.success("Deleted");
        getTechnicians();
      });
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
          {/* <div className="col-md-4">
            <Label for="basicpill-email-input4">Category Name</Label>
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
          </div> */}
          <div className="col-md-4">
            <Label for="basicpill-email-input4">
              Company<span className="required-filed">*</span>
            </Label>
            <Select
              options={projectData}
              value={technicianData.PROJECT_ID}
              onChange={(e) => {
                // let tempTechnician=[...technicianData]
                let tempTechnician = technician.filter(
                  (item) => item.PROJECT_ID === e.value
                );

                if (tempTechnician.length > 0) {
                  let temp = [...technician];

                  let option = temp?.filter(
                    (val) => val.PROJECT_ID == e.value
                  )?.EMPLOYEES;
                  option?.map((val) => {
                    val.label = val.EMP_NAME;
                    val.value = val.EMP_ID;
                  });
                  setClientTechnicianOptions(option);
                }

                setTechnicianData((prev) => ({
                  ...prev,
                  PROJECT_ID: e,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4">Category Name</Label>
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
            <Label for="basicpill-email-input4">Sub Category</Label>
            <Select
              options={SubCategoryData}
              value={technicianData.SUB_CATEGORY_ID}
              // onChange={(e) => {
              //   setTechnicianData((prev) => ({
              //     ...prev,
              //     SUB_CATEGORY_ID: e,
              //   }));
              //   axios
              //     .get(
              //       AXIOS.defaultPort +
              //         AXIOS.getTechinicianByCatSubCat +
              //         technicianData.CATEGORY_ID +
              //         "SUBCATEGORY_ID=" +
              //         e.value
              //     )
              //     .then((res) => {
              //       const filteredArray = res.data.filter((obj) =>
              //         employeesByPM.includes(obj.EMP_ID)
              //       );

              //       setTechOptions(filteredArray);
              //     });
              //   // getSubCategory(e.value);
              // }}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  SUB_CATEGORY_ID: e,
                }));
                axios
                  .get(
                    AXIOS.defaultPort +
                      AXIOS.getTechinicianByCatSubCat +
                      technicianData.CATEGORY_ID.value +
                      "&SUBCATEGORY_ID=" +
                      e.value
                  )
                  .then((res) => {
                    // let filteredArray = res.data.filter((obj) =>
                    //   employeesByPM.includes(obj.EMP_ID)
                    // );

                    let tempArr = [];
                    let filteredArray = [...res.data];

                    filteredArray.map((val) => {
                      // (val.label = val.EMP_NAME), (val.value = val.EMP_ID);

                      let data = tempArr.findIndex(
                        (item) => item.EMP_ID == val.EMP_ID
                      );
                      if (data == -1) {
                        tempArr.push({
                          ...val,
                          label: `${val.EMP_NAME} (${val.EMP_ID})`,
                          value: val.EMP_ID,
                        });
                      }
                    });

                    setTechOptions(tempArr);
                  });
                // getSubCategory(e.value);
              }}
              has
              context
              menu
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4">Consultant</Label>
            <Select
              options={techOptions}
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
                    Category
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Sub Category
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
                    Action
                  </th>
                </tr>
              </TableHead>

              <TableBody>
                {technician?.map((item) => {
                  return (
                    <tr className="tr">
                      <td>{item.COMPANY_NAME}</td>

                      <td>
                        {item.CATEGORY_NAME} ({item.CATEGORY_ID})
                      </td>
                      <td>
                        {item.SUB_CATEGORY_NAME} ({item.SUB_CATEGORY_ID})
                      </td>
                      <td>
                        {item.EMP_NAME} ({item.EMP_ID})
                      </td>
                      <td>
                        <DeleteIcon
                          onClick={() => {
                            // handleEditModalOpen();
                            // setClickedRowData(val);
                            handleClickRow(item);
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
          {/* <Label for="basicpill-email-input4">Client</Label>
          <Select
            options={ClientData}
            value={ClickedRowData?.CLIENT_ID}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                CLIENT_ID: e,
              }));
            }}
          /> */}
          <Label for="basicpill-email-input4">Category Name</Label>
          <Select
            options={CategoryData}
            value={CategoryData.find(
              (val) => val.value == ClickedRowData?.CATEGORY_ID
            )}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                CATEGORY_ID: e,
              }));

              getSubCategory(e.value);
            }}
          />
          <Label for="basicpill-email-input4">Sub Category</Label>
          <Select
            options={SubCategoryData}
            // value={ClickedRowData?.SUB_CATEGORY_ID}
            value={SubCategoryData.find(
              (val) => val.value === ClickedRowData?.SUB_CATEGORY_ID
            )}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                SUB_CATEGORY_ID: e,
              }));

              // getSubCategory(e.value);
            }}
          />
          <Label for="basicpill-email-input4">Technician</Label>

          <Select
            options={userData}
            value={userData.find(
              (item) => item.value == ClickedRowData?.EMP_ID
            )}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                EMP_ID: e,
              }));

              // getSubCategory(e.value);
            }}
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={(e) => {
              handleTechnicianUpdate();
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

// export default AddTechnicianManager;

const mapStateToProps = (state) => ({
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(AddTechnicianManager);
