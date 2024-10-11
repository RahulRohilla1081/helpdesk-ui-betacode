import React, { useState, useEffect } from "react";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import { Input, Label } from "reactstrap";
import "./AddApprover.css";
import Lottie from "react-lottie";
import ApproverLottie from "../../assets/LottieAnimations/ApproverLottie.json";
import { margin } from "@mui/system";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";
import Select from "react-select";
import { APPROVER } from "../../Utils/Routes";
import cogoToast from "cogo-toast";
import EditIcon from "@mui/icons-material/Edit";
import { saveAs } from "file-saver";

import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  TableRow,
} from "@mui/material";
import { connect } from "react-redux";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";

function AddApprover(props) {
  const [allUsers, setAllUsers] = useState([]);

  const [CategoryData, setCategoryData] = useState([]);
  const [SubCategoryData, setSubCategoryData] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [allClientsOptions, setAllClientsOptions] = useState([]);
  const [userByClient, setUserByClient] = useState([]);
  const [companySelected, setCompanySelected] = useState({
    CLIENT_NAME: "",
    ERROR_FLAG: false,
  });
  const [approver1, setApprover1] = useState({
    USER_NAME: "",
    ERROR_FLAG: false,
  });
  const [approver2, setApprover2] = useState({
    USER_NAME: "",
    ERROR_FLAG: false,
  });
  const [formData, setFormData] = useState({
    CATEGORY: "",
    CATEGORY_ERROR: false,
    SUB_CATEGORY: "",
    SUB_CATEGORY_ERROR: false,
  });
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ApproverLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const getAllUsers = (id) => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllUser).then((res) => {
      let temp = [...res.data];
      temp.map((val) => {
        val.label = val.USER_NAME;
        val.value = val.USER_ID;
      });
      setAllUsers(temp);
    });
  };
  const getUserByClient = (id) => {
    axios.get(AXIOS.defaultPort + AXIOS.getUserByClientId + id).then((res) => {
      let temp = [...res.data];
      temp.map((val) => {
        val.label = `${val.USER_NAME} (${val.USER_ID})`;
        val.value = val.USER_ID;
      });
      setUserByClient(temp);
    });
  };

  const handleAddApprover = () => {
    if (companySelected.CLIENT_NAME == "") {
      let temp = { ...companySelected };
      temp.ERROR_FLAG = true;
      setCompanySelected(temp);
    }

    if (approver1.USER_NAME == "") {
      let temp = { ...approver1 };
      temp.ERROR_FLAG = true;
      setApprover1(temp);
    }

    if (approver2.USER_NAME == "") {
      let temp = { ...approver2 };
      temp.ERROR_FLAG = true;
      setApprover2(temp);
    }

    if (formData.CATEGORY == "") {
      // formData.CATEGORY_ERROR=true

      setFormData((prev) => ({
        ...prev,
        CATEGORY_ERROR: true,
      }));
    }
    if (formData.SUB_CATEGORY == "") {
      setFormData((prev) => ({
        ...prev,
        SUB_CATEGORY_ERROR: true,
      }));
    }
    // setFormData(formData);

    console.log("sadkbadjhasdasd", {
      CLIENT_ID: companySelected.CLIENT_ID,
      APPROVER1: approver1.USER_ID,
      APPROVER2: approver2.USER_ID,
      CATEGORY: formData.CATEGORY,
      SUBCATEGORY: formData.SUB_CATEGORY,
    });
    if (
      companySelected.CLIENT_NAME != "" &&
      approver1.USER_NAME != "" &&
      approver2.USER_NAME != "" &&
      formData.CATEGORY != "" &&
      formData.SUB_CATEGORY != ""
    ) {
      // console.log("sadkbadjhasdasd", {
      //   CLIENT_ID: companySelected.CLIENT_ID,
      //   APPROVER1: approver1.USER_ID,
      //   APPROVER2: approver2.USER_ID,
      //   CATEGORY: formData.CATEGORY,
      //   SUBCATEGORY: formData.SUB_CATEGORY,
      // });
      axios
        .post(AXIOS.defaultPort + AXIOS.addApprover, {
          CLIENT_ID: companySelected.CLIENT_ID,
          APPROVER1: approver1.USER_ID,
          APPROVER2: approver2.USER_ID,
          CATEGORY: formData.CATEGORY,
          SUBCATEGORY: formData.SUB_CATEGORY,
        })
        .then((res) => {
          cogoToast.success("Approvers assigned");
          setCompanySelected({ CLIENT_NAME: "", ERROR_FLAG: false });
          setApprover1({ USER_NAME: "", ERROR_FLAG: false });
          setApprover2({ USER_NAME: "", ERROR_FLAG: false });
          setFormData({ CATEGORY: "", SUB_CATEGORY: "" });
          getAllClients();
        });
    }
  };
  const getAllClients = () => {
    let url = "";
    if (
      (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
        props.LOGGED_IN_DATA.USER_TYPE?.includes(0)) ||
      (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
        props.LOGGED_IN_DATA.USER_TYPE?.includes(3))
    ) {
      url = AXIOS.defaultPort + AXIOS.getAllClient;
    } else if (
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
      props.LOGGED_IN_DATA.USER_TYPE?.includes(1)
    ) {
      url =
        AXIOS.defaultPort +
        AXIOS.getClientForTechnicianMap +
        props.LOGGED_IN_DATA.USER_ID;
    }

    axios
      .get(
        url
        // + props.LOGGED_IN_DATA.USER_ID
      )
      .then(async (res) => {
        let temp = [];

        console.log("ASdashbdasd basbdjas", res.data, url);
        if (
          (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
            props.LOGGED_IN_DATA.USER_TYPE?.includes(3)) == true
        ) {
          const response = await axios.get(
            AXIOS.defaultPort +
              AXIOS.getClientByPM +
              props.LOGGED_IN_DATA.USER_ID
          );
          if (response) {
            response.data.map((val) => {
              let FoundData = res.data.filter(
                (item) => val.CLIENT_ID == item.CLIENT_ID
              );

              // console.log("SAdjhasbdhasdasd", FoundData);

              if (FoundData.length > 0) {
                FoundData.map((val) => {
                  val.APPROVERS.map((item) => {
                    temp.push({ ...val, ...item });
                  });
                });
              }

              let Options = [];
               response.data.map((val) => {
                let opt = Options.findIndex(
                  (item) => item.CLIENT_ID == val.CLIENT_ID
                );
                if (opt == -1) {
                  Options.push({
                    ...val,
                    label: val.COMPANY_NAME,
                    value: val.CLIENT_ID,
                  });
                }
              });

              console.log("ASdasdhsadsa", temp);

              setAllClientsOptions(Options);
              setAllClients(temp);
            });
          }
        } else {
          // temp = [];
          res.data.map((val) => {
            // val.label = val.COMPANY_NAME;
            // val.value = val.CLIENT_ID;
            val.APPROVERS.map((item) => {
              temp.push({ ...val, ...item });
            });
          });
          console.log("ASdasdasjhdasd", temp);

          let Options = [];
          res.data.map((val) => {
            let opt = Options.findIndex(
              (item) => item.CLIENT_ID == val.CLIENT_ID
            );
            if (opt == -1) {
              Options.push({
                ...val,
                label: val.COMPANY_NAME,
                value: val.CLIENT_ID,
              });
            }
          });

          setAllClientsOptions(Options);
          setAllClients(temp);

          console.log("sadkbasdhjsadsa", temp);
        }
      });
  };

  useEffect(() => {
    // getAllUsers();
    getAllClients();
    getAllCategory();
  }, []);

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
      name: "Approver 1",
      selector: "APPROVER1_NAME",
    },

    {
      name: "Approver 1 EMP ID",
      selector: "APPROVER1",
    },
    {
      name: "Approver 2",
      selector: "APPROVER2_NAME",
    },
    {
      name: "Approver 2 EMP ID",
      selector: "APPROVER1",
    },
  ];
  const handleExcelExport = () => {
    let tempData = [];

    allClients.map((val) => {
      if (val.APPROVER1 || val.APPROVER2) {
        tempData.push({ ...val });
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
      saveAs(blob, "Approver.csv"); // Use the saveAs function to download the CSV file
    }
  };

  const getAllCategory = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllCategory).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({
          label: val.CATEGORY_NAME,
          value: val.CATEGORY_ID,
          ...val,
        });
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

  return (
    <MainScreenEmployee drawerWidth={282} Activekey={APPROVER}>
      <div
        style={{ marginTop: "1%", marginLeft: "1%" }}
        className="row approver-input-container"
      >
        <div className="col-md-4">
          <Label for="basicpill-email-input4" className="modal-label">
            Customer<span className="required-filed">*</span>
          </Label>
          <CustomSelect
            value={companySelected}
            options={allClientsOptions}
            onChange={(e) => {
              setCompanySelected(e);
              getUserByClient(e.value);
            }}
          />
          {companySelected?.ERROR_FLAG && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Client{" "}
            </p>
          )}
        </div>
        <div className="col-md-4">
          <Label className="modal-label" for="basicpill-email-input4">
            Category Name<span className="required-filed">*</span>
            {JSON.stringify(formData.CATEGORY)}
          </Label>
          <CustomSelect
            options={CategoryData}
            value={
              formData?.CATEGORY == ""
                ? ""
                : CategoryData.find((val) => val.value == formData?.CATEGORY)
            }
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                CATEGORY: e.value,
                CATEGORY_ERROR: false,
              }));

              getSubCategory(e.value);
            }}
          />
          {formData?.CATEGORY_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Category{" "}
            </p>
          )}
        </div>

        <div className="col-md-4">
          <Label className="modal-label" for="basicpill-email-input4">
            Sub Category<span className="required-filed">*</span>
          </Label>
          <CustomSelect
            options={SubCategoryData}
            value={formData?.SUB_CATEGORY==""?"":SubCategoryData.find(
              (val) => val.value == formData?.SUB_CATEGORY
            )}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                SUB_CATEGORY: e.value,
                SUB_CATEGORY_ERROR: false,
              }));

              // getSubCategory(e.value);
            }}
          />
          {formData?.SUB_CATEGORY_ERROR && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Sub Category{" "}
            </p>
          )}
        </div>
        <div className="col-md-4">
          <Label for="basicpill-email-input4" className="modal-label">
            Approver 1 <span className="required-filed">*</span>
          </Label>
          <CustomSelect
            value={approver1}
            options={userByClient}
            onChange={(e) => {
              setApprover1(e);
            }}
          />
          {approver1.ERROR_FLAG && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Approver 1{" "}
            </p>
          )}
        </div>

        <div className="col-md-4">
          <Label for="basicpill-email-input4" className="modal-label">
            Approver 2<span className="required-filed">*</span>
          </Label>
          <CustomSelect
            value={approver2}
            options={userByClient}
            onChange={(e) => {
              setApprover2(e);
            }}
          />
          {approver2.ERROR_FLAG && (
            <p
              style={{
                color: "red",
              }}
            >
              Please select Approver 2{" "}
            </p>
          )}
        </div>
        <div className="col-md-4"></div>

        <div
          style={{ marginRight: "5px", marginTop: "3%" }}
          className="row approver-inner_div"
        >
          <button
            style={{ backgroundColor: "#219bcc" }}
            className="mx-2 col-2 approver-button-style"
            onClick={handleAddApprover}
          >
            Submit
          </button>
        </div>
        <div style={{ marginTop: "5%" }} className="approver-table">
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
                    Client ID
                  </th>
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
                    Approver 1
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Approver 2
                  </th>
                  {/* <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Action
                  </th> */}
                </tr>
              </TableHead>

              <TableBody>
                {allClients.map((val) => {
                  return (
                    <>
                      {(val.APPROVER1 || val.APPROVER2) && (
                        <tr>
                          <td>{val.CLIENT_ID}</td>
                          <td>{val.COMPANY_NAME}</td>
                          <td>
                            {val.CATEGORY_NAME}({val.CATEGORY})
                          </td>
                          <td>
                            {val.SUBCATEGORY_NAME}({val.SUBCATEGORY})
                          </td>
                          <td>
                            {val.APPROVER1_NAME}{" "}
                            {val.APPROVER1 ? `(${val.APPROVER1})` : ""}
                          </td>
                          <td>
                            {val.APPROVER2_NAME}{" "}
                            {val.APPROVER2 ? `(${val.APPROVER2})` : ""}
                          </td>
                          {/* <td>
                            <EditIcon sx={{ color: "#30344a" }} />
                          </td> */}
                        </tr>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {allClients.length == 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 18,
                width: "100%",
                marginBottom: 5,
              }}
            >
              No Data Found
            </div>
          )}
        </div>
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

export default connect(mapStateToProps, {})(AddApprover);
