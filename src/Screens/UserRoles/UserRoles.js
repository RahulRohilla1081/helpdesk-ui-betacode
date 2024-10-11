import React, { useEffect, useState } from "react";
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
import { ADDUSER, USER_ROLES } from "../../Utils/Routes";
import { saveAs } from "file-saver";
import CustomInput from "../../components/CustomInput/CustomInput";

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

function UserRoles(props) {
  const RolesArr = [
    { label: "Admin", value: 0 },
    { label: "User", value: 1 },
    { label: "Review", value: 2 },
  ];
  const [Tbody, setTbody] = useState([]);
  const [TbodyCopy, setTbodyCopy] = useState([]);
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
    let tempRolesPayload = [];
    payload.ROLES.map((val) => {
      tempRolesPayload.push(val.value);
    });

    console.log("Adaskbhdasdasd", tempRolesPayload);

    axios
      .post(AXIOS.defaultPort + AXIOS.updateUser, {
        USER_ID: payload.USER_ID,
        USER_TYPE: tempRolesPayload,
      })
      .then((res) => {
        console.log("asdkjasndhjasd", res.data);
        toast.success("User role Updated Successfully");
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
          setTbodyCopy(res.data);

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
          setTbodyCopy(res.data);


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

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (value) => {
        const tempData = TbodyCopy.filter((row) => {
          if (!value) return true; // No search query
          return Object.values(row)
            .filter((value) => typeof value === "string")
            .join(" ")
            .toLowerCase()
            .includes(value.toLowerCase());
        });

        setTbody(tempData);
    setSearchInput(value);
  };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={USER_ROLES}>
      <Toaster />

      <div
        className=""
        style={{
          // padding:5,
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            width: 300,
          }}
        >
          <CustomInput
            placeholder={"Search"}
            value={searchInput}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
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

        <div className="">
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
                            console.log("ASdasdnasjkdas", temp);
                            // temp.DESIGNATION = DesignationArr.find(
                            //   (item) => item.value == val.DESIGNATION
                            // );
                            let tempUserTypes = [];
                            val.USER_TYPE.map((val) => {
                              let data = RolesArr.find(
                                (item) => Number(item.value) == Number(val)
                              );
                              if (data) {
                                let isExist = tempUserTypes.findIndex(
                                  (item) => item.value == val
                                );
                                if (isExist == -1) {
                                  tempUserTypes.push(data);
                                }
                              }
                            });

                            temp.ROLES = tempUserTypes;
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
            disabled
            className="form-control"
            placeholder="Enter User Name"
            value={ClickedRowData?.COMPANY_NAME}
          />
          <Label for="basicpill-email-input4" className="modal-label">
            User Name
          </Label>
          <Input
            type="text"
            name="USERNAME"
            disabled
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
            disabled
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
            disabled
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
          <Label for="basicpill-email-input4">Designation</Label>
          <Select
            isMulti
            //   0: admin, 1: user, 2: reviewer
            options={RolesArr}
            value={ClickedRowData?.ROLES}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,

                ROLES: e,
              }));
            }}
          />{" "}
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
    </MainScreenEmployee>
  );
}

const mapStateToProps = (state) => ({
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(UserRoles);
