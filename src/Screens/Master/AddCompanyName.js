import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import "./AddCompanyName.css";

import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  Modal,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import cogoToast from "cogo-toast";
import CloseIcon from "@mui/icons-material/Close";
import { ADDCOMPANY } from "../../Utils/Routes";
import { saveAs } from "file-saver";
import Select from "react-select";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import CustomInput from "../../components/CustomInput/CustomInput";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function AddCompanyName() {
  const [clientData, setClientData] = useState([]);
  const [EmployeeOptions, setEmployeeOptions] = useState([]);
  const [ClickedRowData, setClickedRowData] = useState(null);
  const [validation, setValidation] = useState({
    MOBILE: false,
    EMAIL_ID: false,
  });

  const [EditModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);
  const [CompanyCreateData, setCompanyCreateData] = useState({
    COMPANY_NAME: "",
    COMPANY_CODE: "",
    CLIENT_NAME: "",
    EMAIL_ID: "",
    MOBILE: "",
    AGREEMENT_LAST_DATE: "",
    COMPANY_WEBSITE: "",
    CLIENT_ADDRESS: "",
    WORK_LOCATION: "",
    SCOPE_OF_PROJECT: "",
    CATEGORY: "",
    PROJECT_MANAGER: "",
    ESCALATION1: "",
    ESCALATION2: "",
    ESCALATION3: "",
    COMPANY_NAME_ERROR_FLAG: false,
    COMPANY_CODE_ERROR_FLAG: false,
    CLIENT_NAME_ERROR_FLAG: false,
    EMAIL_ID_ERROR_FLAG: false,
    MOBILE_ERROR_FLAG: false,
    AGREEMENT_LAST_DATE_ERROR_FLAG: false,
    COMPANY_WEBSITE_ERROR_FLAG: false,
    CLIENT_ADDRESS_ERROR_FLAG: false,
    ESCALATION1_ERROR: false,
    ESCALATION2_ERROR: false,
    ESCALATION3_ERROR: false,
  });

  useEffect(() => {
    getAllClient();
    getAllEmployees();
  }, []);

  const getAllClient = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllClient).then((response) => {
      setClientData(response.data);
    });
  };
  const getAllEmployees = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllEmployess).then((response) => {
      console.log("adjhabdhjasd", response.data);
      let tempData = [];
      response.data.map((val) => {
        tempData.push({
          ...val,
          label: `${val.EMP_NAME} (${val.EMP_ID})`,
          value: val.EMP_ID,
        });
      });
      setEmployeeOptions(tempData);
    });
  };
  const contactValidation = (input) => {
    var phoneno = /^\d{10}$/;
    if (input?.match(phoneno)) {
      return true;
    } else {
      return false;
    }
  };
  const emailValidation = (input) => {
    if (input.includes("@") && input.includes(".")) {
      return true;
    } else {
      return false;
    }
  };
  const createNewCompany = () => {
    if (CompanyCreateData.COMPANY_NAME == "") {
      toast.error("Please enter company name");
    } else if (CompanyCreateData.COMPANY_CODE == "") {
      toast.error("Please enter company code");
    } else if (CompanyCreateData.CLIENT_NAME == "") {
      toast.error("Please enter client ");
    } else if (CompanyCreateData.EMAIL_ID == "") {
      toast.error("Please enter email id");
    } else if (CompanyCreateData.MOBILE == "") {
      toast.error("Please enter mobiLe ");
    } else if (CompanyCreateData.AGREEMENT_LAST_DATE == "") {
      toast.error("Please enter agreement last date");
    } else if (CompanyCreateData.COMPANY_WEBSITE == "") {
      toast.error("Please enter company website");
    } else if (CompanyCreateData.CLIENT_ADDRESS == "") {
      toast.error("Please enter client address");
    } else if (
      contactValidation(CompanyCreateData?.MOBILE.toString()) == false ||
      contactValidation(CompanyCreateData?.MOBILE.toString()) == undefined
    ) {
      cogoToast.warn("Enter valid Mobile Number");
    } else if (
      emailValidation(CompanyCreateData.EMAIL_ID) == false ||
      emailValidation(CompanyCreateData.EMAIL_ID) == undefined
    ) {
      cogoToast.warn("Enter valid email");
    } else if (CompanyCreateData.ESCALATION1 == "") {
      cogoToast.warn("Enter escalation 1");
    } else if (CompanyCreateData.ESCALATION2 == "") {
      cogoToast.warn("Enter escalation 2");
    } else if (CompanyCreateData.ESCALATION3 == "") {
      cogoToast.warn("Enter escalation 3");
    } else {
      let payload = {};

      Object.keys(CompanyCreateData).map((key, colIndex) => {
        if (typeof CompanyCreateData[key] != "boolean") {
          payload[key] = CompanyCreateData[key];
        }
      });
      let payloadFormData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        payloadFormData.append(`${key}`, `${value}`);
        console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
      });

      payloadFormData.append(`COMPANY_LOGO`, CompanyCreateData.COMPANY_LOGO);

      for (var pair of payloadFormData.entries()) {
        console.log("sdasdasdasdasdsad", pair[0] + ", " + pair[1]);
      }
      axios
        .post(AXIOS.defaultPort + AXIOS.createClient, payloadFormData)
        .then((res) => {
          toast.success("Company Created");

          setCompanyCreateData({
            COMPANY_NAME: "",
            COMPANY_CODE: "",
            CLIENT_NAME: "",
            EMAIL_ID: "",
            MOBILE: "",
            AGREEMENT_LAST_DATE: "",
            COMPANY_WEBSITE: "",
            CLIENT_ADDRESS: "",
            WORK_LOCATION: "",
            SCOPE_OF_PROJECT: "",
            CATEGORY: "",
            PROJECT_MANAGER: "",

            ESCALATION1: "",
            ESCALATION2: "",
            ESCALATION3: "",
            ESCALATION1_ERROR: false,
            ESCALATION2_ERROR: false,
            ESCALATION3_ERROR: false,
            COMPANY_NAME_ERROR_FLAG: false,
            COMPANY_CODE_ERROR_FLAG: false,
            CLIENT_NAME_ERROR_FLAG: false,
            EMAIL_ID_ERROR_FLAG: false,
            MOBILE_ERROR_FLAG: false,
            AGREEMENT_LAST_DATE_ERROR_FLAG: false,
            COMPANY_WEBSITE_ERROR_FLAG: false,
            CLIENT_ADDRESS_ERROR_FLAG: false,
          });
          getAllClient();

          // setCategory(res.data);
        })
        .catch((err) => {});
    }
  };

  const handleCompanyUpdate = () => {
    if (
      contactValidation(ClickedRowData.MOBILE.toString()) == false ||
      contactValidation(ClickedRowData.MOBILE.toString()) == undefined
    ) {
      cogoToast.warn("Enter valid phone number");
    } else if (
      emailValidation(ClickedRowData.EMAIL_ID) == false ||
      emailValidation(ClickedRowData.EMAIL_ID) == undefined
    ) {
      cogoToast.warn("Enter valid email");
    } else {
      let payloadFormData = new FormData();
      Object.entries(ClickedRowData).forEach(([key, value]) => {
        payloadFormData.append(`${key}`, `${value}`);
        console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
      });

      if (ClickedRowData?.COMPANY_LOGO?.name) {
        payloadFormData.append(`COMPANY_LOGO`, ClickedRowData.COMPANY_LOGO);
      }

      for (var pair of payloadFormData.entries()) {
        console.log("sdasdasdasdasdsad", pair[0] + ", " + pair[1]);
      }
      axios
        .post(AXIOS.defaultPort + AXIOS.updateClient, payloadFormData)
        .then((res) => {
          toast.success("Company Updated");
          handleEditModalClose();
          setCompanyCreateData({
            COMPANY_NAME: "",
            CLIENT_NAME: "",
            EMAIL_ID: "",
            MOBILE: "",
            AGREEMENT_LAST_DATE: "",
            COMPANY_WEBSITE: "",
            CLIENT_ADDRESS: "",
            WORK_LOCATION: "",
            SCOPE_OF_PROJECT: "",
            CATEGORY: "",
            PROJECT_MANAGER: "",
            ESCALATION1: "",
            ESCALATION2: "",
            ESCALATION3: "",
            COMPANY_NAME_ERROR_FLAG: false,
            CLIENT_NAME_ERROR_FLAG: false,
            EMAIL_ID_ERROR_FLAG: false,
            MOBILE_ERROR_FLAG: false,
            AGREEMENT_LAST_DATE_ERROR_FLAG: false,
            COMPANY_WEBSITE_ERROR_FLAG: false,
            CLIENT_ADDRESS_ERROR_FLAG: false,
          });
          getAllClient();

          // setCategory(res.data);
        })
        .catch((err) => {});
    }
  };

  function openInNewTab(url) {
    window.open(url, "_blank").focus();
  }

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
      name: "Company Code",
      selector: "COMPANY_CODE",
    },
    {
      name: "Customer Name",
      selector: "CLIENT_NAME",
    },
    {
      name: "Email ID",
      selector: "EMAIL_ID",
    },
    {
      name: "MOBILE",
      selector: "MOBILE",
    },
    {
      name: "Agreement Last date",
      selector: "AGREEMENT_LAST_DATE",
    },
    {
      name: "Address",
      selector: "CLIENT_ADDRESS",
    },
    {
      name: "Website",
      selector: "COMPANY_WEBSITE",
    },
    {
      name: "Company Logo",
      selector: "COMPANY_LOGO",
    },
    {
      name: "Escalation 1 Name",
      selector: "ESCALATION1_NAME",
    },
    {
      name: "Escalation 1 ID",
      selector: "ESCALATION1",
    },
    {
      name: "Escalation 2 Name",
      selector: "ESCALATION2_NAME",
    },
    {
      name: "Escalation 2 ID",
      selector: "ESCALATION2",
    },
    {
      name: "Escalation 3 Name",
      selector: "ESCALATION3_NAME",
    },
    {
      name: "Escalation 3 ID",
      selector: "ESCALATION3",
    },
  ];
  const handleExcelExport = () => {
    let excelData = [...clientData];

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
              if (column.name == "Company Logo") {
                if (item[column.selector] != undefined) {
                  cellValue =
                    AXIOS.defaultPort +
                    "Support_Portal_api/COMPANY_LOGO/" +
                    item[column.selector];
                } else {
                  cellValue = "";
                }
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
      saveAs(blob, "Company.csv"); // Use the saveAs function to download the CSV file
    }
  };

  useEffect(() => {
    console.log("asdkjbasdghjvaskdas", ClickedRowData);
  }, [ClickedRowData]);
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADDCOMPANY}>
      <Toaster />
      <div className="company-input-container">
        <div className="row company-sub-input-container">
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Company Name<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Company Name"
              value={CompanyCreateData.COMPANY_NAME}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  COMPANY_NAME: e.target.value,
                  COMPANY_NAME_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Customer Name<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Customer Name"
              value={CompanyCreateData.CLIENT_NAME}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  CLIENT_NAME: e.target.value,
                  CLIENT_NAME_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Company Code <span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="COMPANY_CODE"
              className="form-control"
              placeholder="Enter 4-digit code"
              value={CompanyCreateData.COMPANY_CODE}
              maxLength={4}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  COMPANY_CODE: e.target.value,
                  COMPANY_CODE_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Email ID<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Email id"
              value={CompanyCreateData.EMAIL_ID}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  EMAIL_ID: e.target.value,
                  EMAIL_ID_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Logo
            </Label>
            <CustomInput
              type="file"
              name="COMPANLOGO"
              accept="image/png, image/jpeg"
              className="form-control"
              // value={CompanyCreateData.EMAIL_ID}
              onChange={(e) => {
                console.log("Adsakjndhjasd", e.target.files[0]);
                setCompanyCreateData((prev) => ({
                  ...prev,
                  COMPANY_LOGO: e.target.files[0],
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Mobile Number<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="number"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Mobile Number"
              value={CompanyCreateData.MOBILE}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  MOBILE: e.target.value,
                  MOBILE_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Agreement Last Date<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="date"
              name="DATE"
              className="form-control"
              placeholder="Enter date"
              value={CompanyCreateData.AGREEMENT_LAST_DATE}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  AGREEMENT_LAST_DATE: e.target.value,
                  AGREEMENT_LAST_DATE_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Website<span className="required-filed">*</span>
            </Label>
            <CustomInput
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Website"
              value={CompanyCreateData.COMPANY_WEBSITE}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  COMPANY_WEBSITE: e.target.value,
                  COMPANY_WEBSITE_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Escalation 1<span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={EmployeeOptions}
              value={
                CompanyCreateData.ESCALATION1 == ""
                  ? ""
                  : EmployeeOptions.find(
                      (val) => val.value == CompanyCreateData.ESCALATION1
                    )
              }
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  ESCALATION1: e.value,
                  ESCALATION1_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Escalation 2<span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={EmployeeOptions}
              value={
                CompanyCreateData.ESCALATION2 == ""
                  ? ""
                  : EmployeeOptions.find(
                      (val) => val.value == CompanyCreateData.ESCALATION2
                    )
              }
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  ESCALATION2: e.value,
                  ESCALATION2_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Escalation 3<span className="required-filed">*</span>
            </Label>
            <CustomSelect
              options={EmployeeOptions}
              value={
                CompanyCreateData.ESCALATION3 == ""
                  ? ""
                  : EmployeeOptions.find(
                      (val) => val.value == CompanyCreateData.ESCALATION3
                    )
              }
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  ESCALATION3: e.value,
                  ESCALATION3_ERROR: false,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label for="basicpill-email-input4" className="modal-label">
              Address<span className="required-filed">*</span>
            </Label>
            <Input
              type="textarea"
              name="CLIENT_ADDRESS"
              className="form-control"
              placeholder="Enter Address"
              value={CompanyCreateData.CLIENT_ADDRESS}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  CLIENT_ADDRESS: e.target.value,
                  CLIENT_ADDRESS_ERROR_FLAG: false,
                }));
              }}
            />
          </div>
        </div>
        {/* <div className=""></div>

        <div className="row company-sub-input-container">
         
        </div> */}

        <div style={{ marginRight: "5px" }} className="row company-inner_div">
          <button
            style={{ backgroundColor: "#219bcc" }}
            className="mx-2 col-1 company-button-style"
            onClick={() => {
              createNewCompany();
            }}
          >
            Add
          </button>
        </div>

        <div className="company-table">
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
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Company ID
                  </th>

                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Company Name
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Company Code
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Customer Name
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Email Id
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Mobile
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Agreement Last Date
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Escalation 1
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Escalation 2
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Escalation 3
                  </th>
                  <th
                    className="dashboard-thead-font"
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      backgroundColor: "#219bcc",
                      minWidth: 60,
                    }}
                  >
                    Action
                  </th>
                </tr>
              </TableHead>

              <TableBody>
                {clientData.map((val) => {
                  console.log("dsnakjsa");
                  return (
                    <tr>
                      <td className="dashboard-td-font">{val.CLIENT_ID}</td>

                      <td className="dashboard-td-font">{val.COMPANY_NAME}</td>
                      <td className="dashboard-td-font">{val.COMPANY_CODE}</td>

                      <td className="dashboard-td-font">{val.CLIENT_NAME}</td>
                      <td className="dashboard-td-font">{val.EMAIL_ID}</td>
                      <td className="dashboard-td-font">{val.MOBILE}</td>
                      <td className="dashboard-td-font text-center">
                        {val.AGREEMENT_LAST_DATE}
                      </td>
                      <td className="dashboard-td-font">
                        {val.ESCALATION1
                          ? val.ESCALATION1_NAME + "(" + val.ESCALATION1 + ")"
                          : ""}
                      </td>
                      <td className="dashboard-td-font">
                        {val.ESCALATION2
                          ? val.ESCALATION2_NAME + "(" + val.ESCALATION2 + ")"
                          : ""}
                      </td>
                      <td className="dashboard-td-font">
                        {val.ESCALATION3
                          ? val.ESCALATION3_NAME + "(" + val.ESCALATION3 + ")"
                          : ""}
                      </td>

                      <td className="dashboard-td-font">
                        <EditIcon
                          onClick={() => {
                            handleEditModalOpen();
                            setClickedRowData(val);
                            console.log("ASdkajsbdhjkasdasd", val);
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

                {/* <tr>
                  <td>C0001</td>
                  <td>JMDR</td>
                  <td>JMDR_DEMO</td>
                  <td>test@gmail.com</td>
                  <td>987654321</td>
                  <td>24/04/2024</td>
                  <td>edit icon</td>
                </tr> */}
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
            <h4>Update Company Details</h4>
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
          <div className="company-container-scroll">
            <Label for="basicpill-email-input4" className="modal-label">
              Company Name
            </Label>
            <Input
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Company Name"
              value={ClickedRowData?.COMPANY_NAME}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  COMPANY_NAME: e.target.value,
                  COMPANY_NAME_ERROR_FLAG: false,
                }));
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Customer Name
            </Label>
            <Input
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Customer Name"
              value={ClickedRowData?.CLIENT_NAME}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  CLIENT_NAME: e.target.value,
                  CLIENT_NAME_ERROR_FLAG: false,
                }));
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Company Code
            </Label>
            <Input
              type="text"
              name="COMPANYCODE"
              className="form-control"
              placeholder="Enter Company Code"
              value={ClickedRowData?.COMPANY_CODE}
              maxLength={4}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  COMPANY_CODE: e.target.value,
                  COMPANY_CODE_ERROR_FLAG: false,
                }));
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Email ID
            </Label>
            <Input
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Emial id"
              value={ClickedRowData?.EMAIL_ID}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  EMAIL_ID: e.target.value,
                  EMAIL_ID_ERROR_FLAG: false,
                }));
              }}
            />

            <Label for="basicpill-email-input4" className="modal-label">
              Mobile Number
            </Label>
            <Input
              type="number"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Mobile Number"
              value={ClickedRowData?.MOBILE}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  MOBILE: e.target.value,
                  MOBILE_ERROR_FLAG: false,
                }));
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Attach File
            </Label>
            <label
              htmlFor="upload"
              className="signup-button"
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                borderRadius: 4,
                marginRight: 5,
                marginLeft: 5,
                minHeight: 47,
                maxHeight: 47,
              }}
            >
              Upload File
            </label>
            <input
              type="file"
              name="upload"
              id="upload"
              multiple
              hidden={true}
              // onChange={(e) => {
              //   const fileList = e.target.files;
              //   const fileArray = Array.from(fileList);
              //   setFormData((prevState) => ({
              //     ...prevState,
              //     ATTACHMENT: [...prevState.ATTACHMENT, ...fileArray],
              //   }));
              //   setFormDataErrorFlag((prev) => ({
              //     ...prev,
              //     ATTACHMENT: false,
              //   }));
              // }}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  COMPANY_LOGO: e.target.files[0],
                  AGREEMENT_LAST_DATE_ERROR_FLAG: false,
                }));
              }}
            />

            <label
              style={{
                display: "inline-block",
                maxWidth: "80px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {ClickedRowData?.COMPANY_LOGO?.name || (
                <p
                  style={{
                    color: "#219bcc",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    openInNewTab(
                      AXIOS.defaultPort + ClickedRowData?.COMPANY_LOGO
                    );
                  }}
                >
                  {ClickedRowData?.COMPANY_LOGO}
                </p>
              )}
            </label>
            <br />
            <Label for="basicpill-email-input4" className="modal-label">
              Aggriment Last Date
            </Label>
            <Input
              type="date"
              name="DATE"
              className="form-control"
              placeholder="Enter date"
              value={ClickedRowData?.AGREEMENT_LAST_DATE}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  AGREEMENT_LAST_DATE: e.target.value,
                  AGREEMENT_LAST_DATE_ERROR_FLAG: false,
                }));
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Website
            </Label>
            <Input
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Website"
              value={ClickedRowData?.COMPANY_WEBSITE}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  COMPANY_WEBSITE: e.target.value,
                  COMPANY_WEBSITE_ERROR_FLAG: false,
                }));
              }}
            />
            {/* <div className="row company-sub-input-container"> */}
            {/* <div className="col-md-6"> */}
            <Label for="basicpill-email-input4" className="modal-label">
              Address
            </Label>
            <Input
              type="textarea"
              name="CLIENT_ADDRESS"
              className="form-control"
              placeholder="Enter Address"
              value={ClickedRowData?.CLIENT_ADDRESS}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  CLIENT_ADDRESS: e.target.value,
                  CLIENT_ADDRESS_ERROR_FLAG: false,
                }));
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Escalation 1<span className="required-filed">*</span>
            </Label>
            <Select
              options={EmployeeOptions}
              value={EmployeeOptions.find(
                (val) => val.value == ClickedRowData?.ESCALATION1
              )}
              onChange={(e) => {
                console.log("ASdaksbdhasdasd", e);
                setClickedRowData((prev) => ({
                  ...prev,
                  ESCALATION1: e.value,
                }));

                // getSubCategory(e.value);
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Escalation 2<span className="required-filed">*</span>
            </Label>
            <Select
              options={EmployeeOptions}
              value={EmployeeOptions.find(
                (val) => val.value == ClickedRowData?.ESCALATION2
              )}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  ESCALATION2: e.value,
                }));

                // getSubCategory(e.value);
              }}
            />
            <Label for="basicpill-email-input4" className="modal-label">
              Escalation 3<span className="required-filed">*</span>
            </Label>
            <Select
              options={EmployeeOptions}
              value={EmployeeOptions.find(
                (val) => val.value == ClickedRowData?.ESCALATION3
              )}
              onChange={(e) => {
                setClickedRowData((prev) => ({
                  ...prev,
                  ESCALATION3: e.value,
                }));

                // getSubCategory(e.value);
              }}
            />
            {/* </div> */}
            {/* </div> */}
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={(e) => {
                handleCompanyUpdate();
              }}
            >
              Update
            </Button>
          </div>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

export default AddCompanyName;
