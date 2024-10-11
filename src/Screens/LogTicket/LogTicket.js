import { React, useState } from "react";
import MainScreen from "../../components/AppDrawer/MainScreen";
import { DASHBOARD, EMPLOYEEDASHBOARD, LOGTICKET } from "../../Utils/Routes";
import "./LogTicket.css";
import CustomCard from "../../components/Cards/CustomCardUser";
import { Box, Modal } from "@mui/material";
import axios from "axios";
import { CategoryAction } from "../../redux/action/CategoryAction";
import { SubCategoryAction } from "../../redux/action/SubCategoryAction";
import { connect, useDispatch } from "react-redux";
import cogoToast from "cogo-toast";
import ReactQuill from "react-quill";

import {
  width,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AXIOS from "../../Utils/AXIOS";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import EmployeeDashboard from "../Dashboard/EmployeeDashboard";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import CustomInput from "../../components/CustomInput/CustomInput";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";
import JoditEditor from "jodit-react";
import JoditEditorCustom from "./JoditEditorCustom";

function LogTicket(props) {
  const navigate = useNavigate();

  const [selectedCat, setSelectedCat] = useState();
  const [selectedSubCat, setSelectedSubCat] = useState();
  const [category, setCategory] = useState([]);
  const [SubCategoryData, setSubCategoryData] = useState([]);
  const [allClients, setAllClients] = useState([]);

  const [projectData, setProjectData] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [allMappedTech, setAllMappedTech] = useState([]);
  const [techMappedFlag, setTechMappedFlag] = useState(true);
  const [approverFlag, setApproverFlag] = useState(true);
  const [approverModalFlag, setApproverModalFlag] = useState(false);
  const [selectedOption, setSelectedOption] = useState("1");
  const [allUsers, setAllUsers] = useState([]);
  const [customerOption, setCustomerOption] = useState([]);

  const [empUserOptions, setEmpUserOptions] = useState([]);

  useEffect(() => {
    if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
      getEmpOptions();
    } else {
      getUsersOptions();
    }
  }, []);
  const getEmpOptions = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllEmployess)
      .then((response) => {
        let options = [];
        response.data.map((val) => {
          options.push({
            label: `${val.EMP_NAME}(${val.EMP_ID})`,
            value: val.EMP_ID,
            ...val,
          });
        });
        setEmpUserOptions(options);
      })
      .catch((err) => {});
  };
  const getUsersOptions = () => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getUserByClientId +
          props.LOGGED_IN_DATA.CLIENT_ID
      )
      .then((response) => {
        let tempOptions = [];
        response.data.map((val) => {
          tempOptions.push({
            label: `${val.USER_NAME}(${val.USER_ID})`,
            value: val.USER_ID,
            ...val,
          });
        });
        setEmpUserOptions(tempOptions);
      })
      .catch((err) => {});
  };

  const [allItems, setAllItems] = useState([]);
  const getAllMappedTech = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllMappedTech).then((res) => {
      setAllMappedTech(res.data);
    });
  };
  const getAllItems = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getItem).then((res) => {
      let temp = [...res.data];
      temp.map((val) => {
        val.label = val.ITEM_NAME;
        val.value = val.ITEM_ID;
      });
      setAllItems(temp);
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
          temp.push({
            label: val.COMPANY_NAME,
            value: val.CLIENT_ID,
            ...val,
          });
        });
        setProjectData(temp);
      });
  };
  // const [clientID, setClientId] = useState("");
  useEffect(() => {
    getProjectsData();
    getAllItems();
    getAllMappedTech();
    getAllUserData();
    getAllClients();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.TICKET_REFERENCE) {
      let temp = { ...formData };
      console.log("Asdjhasdgasdasd", location.state);

      temp.REFERENCE = location.state.TICKET_REFERENCE;
      temp.CLIENT_ID = location.state.CLIENT_ID;
      temp.CATEGORY_ID = location.state.CATEGORY_ID;

      getSubCategory(location.state.CATEGORY_ID);

      setFormData(temp);
      setFormDataErrorFlag((prev) => ({
        ...prev,
        REFERENCE: false,
      }));
    }

    console.log("ASdkhjabsdgjhasd", projectData);
    // allClients.find((val) =>{
    //   console.log("ASdakhbdgasdas",val);
    //  return val.value == formData.CLIENT_ID})
  }, [location, allClients]);
  let editorRef;
  const getAllUserData = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllUser).then((res) => {
      setAllUsers(res.data);
    });
  };

  const getAllClients = () => {
    if (
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
      props.LOGGED_IN_DATA.USER_TYPE?.includes(0)
    ) {
      axios.get(AXIOS.defaultPort + AXIOS.getAllClient).then((res) => {
        let data = [...res.data];

        data.map((val) => {
          val.label = val.COMPANY_NAME;
          val.value = val.CLIENT_ID;
        });
        setAllClients(data);
      });
    } else if (
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
      props.LOGGED_IN_DATA.USER_TYPE?.includes(1)
    ) {
      axios
        .get(
          AXIOS.defaultPort +
            AXIOS.getClientForTechnicianMap +
            props.LOGGED_IN_DATA.USER_ID
        )
        .then((res) => {
          console.log("ASdkhjasbdghasd", res.data);
          let data = [...res.data];

          data.map((val) => {
            val.label = val.COMPANY_NAME;
            val.value = val.CLIENT_ID;
          });
          setAllClients(data);
        });
    } else if (
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
      props.LOGGED_IN_DATA.USER_TYPE?.includes(3)
    ) {
      axios
        .get(
          AXIOS.defaultPort + AXIOS.getClientByPM + props.LOGGED_IN_DATA.USER_ID
        )
        .then((res) => {
          let data = [...res.data];

          data.map((val) => {
            val.label = val.COMPANY_NAME;
            val.value = val.CLIENT_ID;
          });
          setAllClients(data);
        });
    }
  };
  useEffect(() => {
    if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
      // setClientId(props.LOGGED_IN_DATA.CLIENT_ID);
      setFormData((prev) => ({
        ...prev,
        CLIENT_ID: props.LOGGED_IN_DATA.CLIENT_ID,
        DELEGATE_CREATED_BY: props.LOGGED_IN_DATA.USER_ID,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        DELEGATE_CREATED_BY: props.LOGGED_IN_DATA.USER_ID,
      }));
    }
  }, [props.LOGGED_IN_DATA]);

  const [formData, setFormData] = useState({
    CLIENT_ID: "",
    CATEGORY_ID: "",
    CATEGORY_NAME: "",
    SUB_CATEGORY: "",
    ITEMS: "",
    SUBJECT: "",
    PRIORITY: "",
    REQUEST_DURATION: "Permanent",
    REQUEST: "1",
    BUSSINESS_JUSTIFICATION: "",
    CC_EMAIL: [],
    DESCRIPTION: "",
    ATTACHMENT: [],
    ASSET_NAME: "",
    REASON_FOR_CHANGE: "",
    CHANGE_TYPE: 1,
    CHANGE_IMPACT: 3,
    LOGGED_DATE: "",
    OPTIONS: "",
    REFERENCE: "",
    OBJECT: "",
    DELEGATE_CREATED_BY: "",
  });

  const [RequiredFields, setRequiredFields] = useState([]);

  useEffect(() => {
    if (Number(selectedOption) == 1) {
      let tempFields = [
        {
          FIELD_NAME: "CLIENT_ID",
        },
        {
          FIELD_NAME: "CATEGORY_ID",
        },
        {
          FIELD_NAME: "SUB_CATEGORY",
        },
        {
          FIELD_NAME: "PRIORITY",
        },
        {
          FIELD_NAME: "ITEMS",
        },
        {
          FIELD_NAME: "SUBJECT",
        },
        {
          FIELD_NAME: "REQUEST_DURATION",
        },
        {
          FIELD_NAME: "BUSSINESS_JUSTIFICATION",
        },
        // {
        //   FIELD_NAME: "CC_EMAIL",
        // },
        // {
        //   FIELD_NAME: "ATTACHMENT",
        // },
        // {
        //   FIELD_NAME: "REFERENCE",
        // },
        // {
        //   FIELD_NAME: "OBJECT",
        // },
        {
          FIELD_NAME: "DESCRIPTION",
        },
      ];

      setRequiredFields(tempFields);
    } else if (Number(selectedOption) == 2) {
      let tempFields = [
        {
          FIELD_NAME: "CLIENT_ID",
        },
        {
          FIELD_NAME: "CATEGORY_ID",
        },
        {
          FIELD_NAME: "SUB_CATEGORY",
        },
        {
          FIELD_NAME: "PRIORITY",
        },
        {
          FIELD_NAME: "ITEMS",
        },
        {
          FIELD_NAME: "SUBJECT",
        },
        // {
        //   FIELD_NAME: "ASSET_NAME",
        // },
        {
          FIELD_NAME: "REASON_FOR_CHANGE",
        },
        {
          FIELD_NAME: "CHANGE_TYPE",
        },
        {
          FIELD_NAME: "PRIORITY",
        },
        {
          FIELD_NAME: "CHANGE_IMPACT",
        },
        {
          FIELD_NAME: "REQUEST_DURATION",
        },
        {
          FIELD_NAME: "BUSSINESS_JUSTIFICATION",
        },
        // {
        //   FIELD_NAME: "CC_EMAIL",
        // },
        // {
        //   FIELD_NAME: "ATTACHMENT",
        // },
        // {
        //   FIELD_NAME: "REFERENCE",
        // },

        // {
        //   FIELD_NAME: "OBJECT",
        // },
        {
          FIELD_NAME: "DESCRIPTION",
        },
      ];

      setRequiredFields(tempFields);
    } else if (Number(selectedOption) == 3) {
      let tempFields = [
        {
          FIELD_NAME: "CLIENT_ID",
        },
        {
          FIELD_NAME: "CATEGORY_ID",
        },
        {
          FIELD_NAME: "SUB_CATEGORY",
        },
        {
          FIELD_NAME: "PRIORITY",
        },
        {
          FIELD_NAME: "ITEMS",
        },
        {
          FIELD_NAME: "SUBJECT",
        },
        // {
        //   FIELD_NAME: "ASSET_NAME",
        // },
        {
          FIELD_NAME: "REASON_FOR_CHANGE",
        },
        {
          FIELD_NAME: "CHANGE_TYPE",
        },
        {
          FIELD_NAME: "CHANGE_IMPACT",
        },
        {
          FIELD_NAME: "REQUEST_DURATION",
        },
        {
          FIELD_NAME: "BUSSINESS_JUSTIFICATION",
        },
        // {
        //   FIELD_NAME: "BUSSINESS_JUSTIFICATION",
        // },
        // {
        //   FIELD_NAME: "CC_EMAIL",
        // },
        // {
        //   FIELD_NAME: "ATTACHMENT",
        // },
        // {
        //   FIELD_NAME: "REFERENCE",
        // },
        // {
        //   FIELD_NAME: "OBJECT",
        // },
        {
          FIELD_NAME: "DESCRIPTION",
        },
      ];

      setRequiredFields(tempFields);
    }
  }, [selectedOption]);
  const [formDataErrorFlag, setFormDataErrorFlag] = useState({
    CLIENT_ID: "",
    CATEGORY_ID: "",
    CATEGORY_NAME: "",
    SUB_CATEGORY: "",
    ITEMS: "",
    SUBJECT: "",
    PRIORITY: "",
    REQUEST_DURATION: "",
    REQUEST: "",
    BUSSINESS_JUSTIFICATION: "",
    CC_EMAIL: [],
    DESCRIPTION: "",
    ATTACHMENT: [],
    ASSET_NAME: "",
    REASON_FOR_CHANGE: "",
    CHANGE_TYPE: "",
    CHANGE_IMPACT: "",
    LOGGED_DATE: "",
    OPTIONS: "",
    REFERENCE: "",
  });

  const getCategoryData = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllCategory).then((res) => {
      let data = [...res.data];
      data.map((val) => {
        val.value = val.CATEGORY_ID;
        val.label = val.CATEGORY_NAME;
      });
      setCategory(data);
    });
  };
  const getSubCategory = (Category) => {
    axios
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
        setSubCategoryData(temp);
      });
  };
  useEffect(() => {
    getCategoryData();
    props
      .CategoryAction()
      .then((res) => {
        if (res == "success") {
          console.log("success");
        } else {
          cogoToast.error("Something went wrong");
        }
      })
      .catch((err) => {
        cogoToast.error("Something went wrong");
      });
  }, []);

  const handleChange = (e) => {
    setSelectedCat(e.target.value);
    let temp = { ...formData };
    temp["CATEGORY_ID"] = e.target.value;
    temp["CATEGORY_NAME"] = props.categoryData.find(
      (val) => val.CategoryId == e.target.value
    )?.CategoryName;

    setFormData(temp);
    props
      .SubCategoryAction(e.target.value)
      .then((res) => {
        if (res == "success") {
          console.log("success");
        } else {
          cogoToast.error("Something went wrong");
        }
      })
      .catch((err) => {
        cogoToast.error("Something went wrong1", err);
      });
  };

  const handleInputChange = (e, input) => {
    let temp = { ...formData };
    temp[input] = e.target.value;
    setFormData(temp);
    setFormDataErrorFlag((prev) => ({
      ...prev,
      [input]: false,
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
console.log("submit called")
    let tempErrorsData = {};

    RequiredFields.map((val) => {
      if (formData[val.FIELD_NAME] == "") {
        // tempErrorsData.push([val.FIELD_NAME]:);

        tempErrorsData = {
          ...tempErrorsData,
          [val.FIELD_NAME]: true,
        };
      }
    });

    if (formData.PRIORITY != "P1" && formData.PRIORITY != "P2") {
      tempErrorsData.BUSSINESS_JUSTIFICATION = false;
    }

    let IsErrorFound = false;
    Object.keys(tempErrorsData).map((key, colIndex) => {
      if (tempErrorsData[key] == true) {
        IsErrorFound = true;
      }
    });

    if (
      formData.PRIORITY == "P1" &&
      formData.BUSSINESS_JUSTIFICATION.length < 40
    ) {
      IsErrorFound = true;
      toast.error(
        "Minimum 40 Characters business justification required to log a ticket under Very High Priority"
      );
    }
    if (
      formData.PRIORITY == "P2" &&
      formData.BUSSINESS_JUSTIFICATION.length < 30
    ) {
      IsErrorFound = true;
      toast.error(
        "Minimum 30 Characters business justification required to log a ticket under High Priority"
      );
    }

    setFormDataErrorFlag(tempErrorsData);

    if (IsErrorFound == false) {
      // Post form data to the API endpoint
      let temp = { ...formData };
      temp.LOGGED_DATE = new Date();
      let ccTempArray = [];
      if (temp.CC_EMAIL != "" && temp.CC_EMAIL) {
        ccTempArray = temp?.CC_EMAIL?.split(/[\;,]+/);
      }
      let finalCc = [];
      ccTempArray.map((val) => {
        if (val.includes("@") && val.includes(".com")) {
          finalCc.push(val.trim());
        }
      });
      temp.CC_EMAIL = finalCc;
      let payloadFormData = new FormData();
      Object.keys(temp).forEach(function (key, index) {
        if (key == "CC_EMAIL") {
          payloadFormData.set(key, JSON.stringify(temp[key]));
        } else if (key == "REQUEST") {
          payloadFormData.set("REQUEST_ID", selectedOption);
        }

        // else if (key == "DESCRIPTION") {
        //   payloadFormData.set("DESCRIPTION", editorRef.getEditor().getText());
        // }
        // else if (key == "ATTACHMENT") {
        //   payloadFormData.append(
        //     "ATTACHMENT",
        //     JSON.stringify(temp["ATTACHMENT"])
        //   );
        // }
        else {
          payloadFormData.append(key, temp[key]);
        }
      });
      payloadFormData.append("TICKET_ACTION", 1);
      payloadFormData.set("CREATED_BY", temp.DELEGATE_CREATED_BY);
      payloadFormData.set("DELEGATE_CREATED_BY", props.LOGGED_IN_DATA.USER_ID);
      payloadFormData.append(
        "CATEGORY_NAME",
        category.find((val) => val.CATEGORY_ID == formData.CATEGORY_ID)
          ?.CATEGORY_NAME
      );
      // if (formData.REQUEST == 2 || formData.REQUEST == 3) {
      //   payloadFormData.append("FLAG", 8);
      // } else {
      //   payloadFormData.append("FLAG", 0);
      // }
      temp.ATTACHMENT.forEach((file, index) => {
        // updatePayload.append(`ATTACHMENT`, file);
        payloadFormData.append(`ATTACHMENT`, file);
      });
      // payloadFormData.append("CLIENT_ID", props.LOGGED_IN_DATA?.CLIENT_ID);

      if (formData.REQUEST == 1) {
        let responseData = await axios.get(
          AXIOS.defaultPort + AXIOS.getTechnicianForClient + formData.CLIENT_ID
        );
        let techData = responseData?.data;
        techData = techData.filter(
          (val) =>
            val.CATEGORY_ID == formData.CATEGORY_ID &&
            val.SUB_CATEGORY_ID == formData.SUB_CATEGORY
        );
        let pendingWith = [];
        techData.map((val) => {
          pendingWith.push(val.EMP_ID);
        });
        pendingWith = [...new Set(pendingWith)];
        payloadFormData.append("PENDING_WITH", JSON.stringify(pendingWith));
      } else if (formData.REQUEST == 2 || formData.REQUEST == 3) {
        if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
          let responseData = await axios.get(
            AXIOS.defaultPort +
              AXIOS.getApprover +
              formData.CLIENT_ID +
              "&cat=" +
              formData.CATEGORY_ID +
              "&sub=" +
              formData.SUB_CATEGORY
          );
          let approverData = responseData?.data;
          let pendingWith = [];
          pendingWith.push(approverData.APPROVER1);

          payloadFormData.append("PENDING_WITH", JSON.stringify(pendingWith));
        } else if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
          let client = await axios.get(
            AXIOS.defaultPort + AXIOS.clientData + formData.CLIENT_ID
          );
          let pendingWith = [];
          if (client.data.length > 0) {
            pendingWith = [client.data[0].PROJECT_MANAGER];
            payloadFormData.append("PENDING_WITH", JSON.stringify(pendingWith));
          }
        }
      }
      for (var pair of payloadFormData.entries()) {
        console.log("sdasdasdasdasdsad", pair[0] + ", " + pair[1]);
      }
      axios
        .post(AXIOS.defaultPort + AXIOS.createTicket, payloadFormData)
        .then((response) => {
          cogoToast.success(`Ticket ${response.data.TICKET_ID} created`);
          // ---------timeline------------
          let timelinePayload = new FormData();

          timelinePayload.append("TICKET_ID", response.data.TICKET_ID);
          timelinePayload.append("TICKET_ACTION", 1);
          timelinePayload.append("REMARKS", formData.DESCRIPTION);
          if (formData.REQUEST == "1") {
            timelinePayload.append("STATUS", 0);
          } else {
            timelinePayload.append("STATUS", 8);
          } // timelinePayload.append("STATUS", "Pending for TR approval");
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          formData.ATTACHMENT.forEach((file, index) => {
            // updatePayload.append(`ATTACHMENT`, file);
            timelinePayload.append(`FILE_NAME`, {
              FILE_NAME: file.name,
              FILE_TYPE: file.name?.split(".")[1],
            });
          });
          // axios
          //   .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
          //   .then((res) => {
          //     console.log("Timeline created");
          //   })
          //   .catch((err) => {
          //     console.log("timeline create err 625463", err);
          //   });
          // -----------------uncomment-----------------------------
          if (formData.REQUEST == 2 || formData.REQUEST == 3) {
            axios
              .get(
                AXIOS.defaultPort +
                  AXIOS.getApprover +
                  formData.CLIENT_ID +
                  "&cat=" +
                  formData.CATEGORY_ID +
                  "&sub=" +
                  formData.SUB_CATEGORY
              )
              .then((resp) => {
                let email = allUsers.find(
                  (val) => val.USER_ID == resp.data.APPROVER1
                )?.USER_EMAIL;
                let approverMailFormdata = new FormData();
                approverMailFormdata.append(
                  "TICKET_ID",
                  response.data.TICKET_ID
                );
                approverMailFormdata.append("TO_EMAIL", [email]);
                approverMailFormdata.append("CC_EMAIL", formData.CC_EMAIL);
                formData.ATTACHMENT.forEach((file, index) => {
                  approverMailFormdata.append(`ATTACHMENTS`, file);
                });
                axios
                  .post(
                    AXIOS.defaultPort + AXIOS.mailToApproval,
                    approverMailFormdata
                  )
                  .then((ress) => {
                    console.log("mail sent to approver");
                  });
              });
          } else if (formData.REQUEST == 1) {
            axios
              .post(AXIOS.defaultPort + AXIOS.getAssignToDd, {
                CLIENT_ID: formData.CLIENT_ID,
                CATEGORY_ID: formData.CATEGORY_ID,
                SUB_CATEGORY_ID: formData.SUB_CATEGORY,
              })
              .then((resData) => {
                let email = [];
                resData.data.map((val) => {
                  email.push(val.EMP_EMAIL);
                });
                let consultantMailFormdata = new FormData();
                consultantMailFormdata.append(
                  "TICKET_ID",
                  response.data.TICKET_ID
                );
                consultantMailFormdata.append("TO_EMAIL", email);
                consultantMailFormdata.append("CC_EMAIL", formData.CC_EMAIL);
                formData.ATTACHMENT.forEach((file, index) => {
                  consultantMailFormdata.append(`ATTACHMENTS`, file);
                });

                axios
                  .post(
                    AXIOS.defaultPort + AXIOS.mailToConsultant,
                    consultantMailFormdata
                  )
                  .then((mailRes) => {
                    console.log("mail sent to consultant");
                  });
              })
              .catch((err) => {
                cogoToast.error("Email could not be sent to consultant");
              });
          }
          if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
            let email = props.LOGGED_IN_DATA.USER_EMAIL;
            let ackMailFormdata = new FormData();
            ackMailFormdata.append("TICKET_ID", response.data.TICKET_ID);
            ackMailFormdata.append("TO_EMAIL", [email]);
            ackMailFormdata.append("CC_EMAIL", formData.CC_EMAIL);
            formData.ATTACHMENT.forEach((file, index) => {
              ackMailFormdata.append(`ATTACHMENTS`, file);
            });
            axios
              .post(
                AXIOS.defaultPort + AXIOS.TicketAcknowledgementMail,
                ackMailFormdata
              )
              .then((res) => {
                console.log("ticket acknowledged");
              });
          }
          // ------------
          if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
            navigate(EMPLOYEEDASHBOARD);
          } else {
            navigate(DASHBOARD);
          }
          setFormData({
            CLIENT_ID: "",
            CATEGORY_ID: "",
            CATEGORY_NAME: "",
            SUB_CATEGORY: "",
            ITEMS: "",
            SUBJECT: "",
            PRIORITY: "",
            REQUEST_DURATION: "1",
            REQUEST: "",
            BUSSINESS_JUSTIFICATION: "",
            CC_EMAIL: [],
            DESCRIPTION: "",
            ATTACHMENT: [],
            ASSET_NAME: "",
            REASON_FOR_CHANGE: "",
            CHANGE_TYPE: "",
            CHANGE_IMPACT: "",
            LOGGED_DATE: "",
          });
        })
        .catch((err) => {
          console.log("Post Error", err);
          cogoToast.error("Ticket could not be created");
        });
    }
  };

  const [passedSteps, setPassedSteps] = useState([1]);
  const [passedStepsVertical, setPassedStepsVertical] = useState([1]);

  const handleOptionChange = (event) => {
    let temp = { ...formData };
    temp.REQUEST = event.target.value;
    setFormData(temp);
    setSelectedOption(event.target.value);
  };

  const renderAdditionalFields = () => {
    if (selectedOption === "1") {
      // Render fields for Proprietorship
      return (
        <>
          <Row>
            {/* First Column (Left) */}
            {/* <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Item<span className="required-filed">*</span>
                </Label>
                <CustomSelect
                  id={"selectItem1"}
                  options={itemOptions}
                  value={allItems.find((val) => val.value == formData.ITEMS)}
                  onChange={(e) => {
                    setSelectedSubCat(e.value);
                    setFormData((prev) => ({
                      ...prev,
                      ITEMS: e.value,
                    }));
                    setFormDataErrorFlag((prev) => ({
                      ...prev,
                      ITEMS: false,
                    }));
                  }}
                />
                {formDataErrorFlag.ITEMS && (
                  <p className="error-text-field">Please select item</p>
                )}

             
              </div>
            </Col> */}
            <Col lg="3">
              <div>
                <Label for="basicpill-email-input4" className="modal-label">
                  Service Request Subject
                  <span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  name="SERVICESUBJECT"
                  className="form-control"
                  id="basicpill-email-input4"
                  placeholder="Enter Subject"
                  value={formData.SUBJECT}
                  onChange={(e) => handleInputChange(e, "SUBJECT")}
                />

                {formDataErrorFlag.SUBJECT && (
                  <p className="error-text-field">
                    Please enter Service Request Subject
                  </p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Object/Tcode
                  {/* <span className="required-filed">*</span> */}
                </Label>
                <CustomInput
                  type="text"
                  name="ASSET"
                  className="form-control"
                  id="basicpill-email-input4"
                  value={formData.ASSET_NAME}
                  onChange={(e) => handleInputChange(e, "ASSET_NAME")}
                  placeholder="Enter Object/Tcode"
                />

                {formDataErrorFlag?.ASSET_NAME && (
                  <p className="error-text-field">Please enter Object/Tcode</p>
                )}
              </div>
            </Col>

            {/* Second Column (Right) */}
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input5" className="modal-label">
                  Service Request Duration
                  <span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="SERVICEREQUEST"
                  className="form-control"
                  id="basicpill-email-input5"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  value={formData.REQUEST_DURATION}
                  onChange={(e) => handleInputChange(e, "REQUEST_DURATION")}
                >
                  <option value="">Select</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Permanent">Permanent</option>
                </Input>

                {formDataErrorFlag?.REQUEST_DURATION == true && (
                  <p className="error-text-field">
                    Please enter Service Request Duration
                  </p>
                )}
              </div>
            </Col>
            {(formData.PRIORITY == "P1" || formData.PRIORITY == "P2") && (
              <Col lg="3">
                <div className="">
                  <Label for="basicpill-email-input4" className="modal-label">
                    Business Justification
                    <span className="required-filed">*</span>
                  </Label>
                  <CustomInput
                    type="textarea"
                    name="DESCRIPTION"
                    className="form-control"
                    id="basicpill-email-input4"
                    value={formData.BUSSINESS_JUSTIFICATION}
                    onChange={(e) =>
                      handleInputChange(e, "BUSSINESS_JUSTIFICATION")
                    }
                    placeholder="Enter Here"
                  />

                  {formDataErrorFlag.BUSSINESS_JUSTIFICATION && (
                    <p className="error-text-field">
                      Please enter Business Justification
                    </p>
                  )}
                </div>
              </Col>
            )}
          </Row>
        </>
      );
    } else if (selectedOption === "2") {
      // Render fields for Partnership
      return (
        <>
          <Row>
            {/* First Column (Left) */}
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Item<span className="required-filed">*</span>
                </Label>
                <CustomSelect
                  id={"selectItem2"}
                  options={itemOptions}
                  value={allItems.find((val) => val.value == formData.ITEMS)}
                  onChange={(e) => {
                    setSelectedSubCat(e.value);
                    setFormData((prev) => ({
                      ...prev,
                      ITEMS: e.value,
                    }));
                    setFormDataErrorFlag((prev) => ({
                      ...prev,
                      ITEMS: false,
                    }));
                  }}
                />
                {formDataErrorFlag.ITEMS && (
                  <p className="error-text-field">Please select Item</p>
                )}

                {/* <Input
                  type="select"
                  name="ITEM"
                  className="form-control"
                  id="basicpill-email-input4"
                  value={formData.ITEMS}
                  onChange={(e) => handleInputChange(e, "ITEMS")}
                >
                  <option value="">Select Item</option>
                  <option value="WEB">WEB</option>
                  <option value="MOBILE">MOBILE</option>
                </Input> */}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  New Requirement Subject
                  <span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  className="form-control"
                  id="basicpill-email-input4"
                  placeholder="Enter Subject"
                  value={formData.SUBJECT}
                  onChange={(e) => handleInputChange(e, "SUBJECT")}
                />

                {formDataErrorFlag?.SUBJECT && (
                  <p className="error-text-field">
                    Please enter new requirement subject
                  </p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Object/Tcode
                  {/* <span className="required-filed">*</span> */}
                </Label>
                <CustomInput
                  type="text"
                  name="ASSET"
                  className="form-control"
                  id="basicpill-email-input4"
                  value={formData.ASSET_NAME}
                  onChange={(e) => handleInputChange(e, "ASSET_NAME")}
                  placeholder="Enter Object/Tcode"
                />

                {formDataErrorFlag?.ASSET_NAME && (
                  <p className="error-text-field">Please enter Object/Tcode</p>
                )}
              </div>
            </Col>

            {/* Second Column (Right) */}
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Reason for Change<span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  name="REASON"
                  className="form-control"
                  id="basicpill-email-input4"
                  value={formData.REASON_FOR_CHANGE}
                  onChange={(e) => handleInputChange(e, "REASON_FOR_CHANGE")}
                  placeholder="Enter Reason Here"
                />

                {formDataErrorFlag?.REASON_FOR_CHANGE && (
                  <p className="error-text-field">
                    Please enter reason of change
                  </p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input5" className="modal-label">
                  Change Type<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="CHANGETYPE"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  className="form-control"
                  id="basicpill-email-input5"
                  value={formData.CHANGE_TYPE}
                  onChange={(e) => handleInputChange(e, "CHANGE_TYPE")}
                >
                  <option value="">Select</option>
                  <option value={1}>Standard</option>
                  <option value={2}>Normal</option>
                  <option value={3}>Emergency</option>
                </Input>

                {formDataErrorFlag?.CHANGE_TYPE && (
                  <p className="error-text-field">Please select change type</p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input5" className="modal-label">
                  Impact of the Change<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="IMPACTCHANGE"
                  className="form-control"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  id="basicpill-email-input5"
                  value={formData.CHANGE_IMPACT}
                  onChange={(e) => {
                    handleInputChange(e, "CHANGE_IMPACT");
                  }}
                >
                  <option value="">Select</option>
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </Input>

                {formDataErrorFlag?.CHANGE_IMPACT && (
                  <p className="error-text-field">
                    Please select impact of change
                  </p>
                )}
              </div>
            </Col>
            {(formData.PRIORITY == "P1" || formData.PRIORITY == "P2") && (
              <Col lg="3">
                <div className="">
                  <Label for="basicpill-email-input4" className="modal-label">
                    Business Justification
                    <span className="required-filed">*</span>
                  </Label>
                  <CustomInput
                    type="textarea"
                    name="DESCRIPTION"
                    style={{
                      height: 30,
                      fontSize: 13,
                    }}
                    className="form-control"
                    id="basicpill-email-input4"
                    value={formData.BUSSINESS_JUSTIFICATION}
                    onChange={(e) =>
                      handleInputChange(e, "BUSSINESS_JUSTIFICATION")
                    }
                    placeholder="Enter Here"
                  />

                  {formDataErrorFlag?.BUSSINESS_JUSTIFICATION && (
                    <p className="error-text-field">
                      Please enter Business Justification
                    </p>
                  )}
                </div>
              </Col>
            )}
            {/* <Col lg="6">
              <div className="">
                <Label for="basicpill-email-input4">
                  Business Justification
                </Label>
                <Input
                  type="textarea"
                  className="form-control"
                  id="basicpill-email-input4"
                  placeholder="Enter Justifcation"
                  value={formData.BUSSINESS_JUSTIFICATION}
                  onChange={(e) =>
                    handleInputChange(e, "BUSSINESS_JUSTIFICATION")
                  }
                />
              </div>
            </Col> */}
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input5" className="modal-label">
                  Change Duration<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="CHANGEDURATION"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  className="form-control"
                  id="basicpill-email-input5"
                  value={formData.REQUEST_DURATION}
                  onChange={(e) => handleInputChange(e, "REQUEST_DURATION")}
                >
                  <option value="">Select</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Permanent">Permanent</option>
                </Input>

                {formDataErrorFlag?.REQUEST_DURATION && (
                  <p className="error-text-field">
                    Please select change duration
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </>
      );
    } else if (selectedOption === "3") {
      // Render fields for Company
      return (
        <>
          <Row>
            {/* First Column (Left) */}
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Item<span className="required-filed">*</span>
                </Label>
                <CustomSelect
                  id={"selectItem3"}
                  options={itemOptions}
                  value={allItems.find((val) => val.value == formData.ITEMS)}
                  onChange={(e) => {
                    setSelectedSubCat(e.value);
                    setFormData((prev) => ({
                      ...prev,
                      ITEMS: e.value,
                    }));
                    setFormDataErrorFlag((prev) => ({
                      ...prev,
                      ITEMS: false,
                    }));
                  }}
                />
                {formDataErrorFlag?.ITEMS && (
                  <p className="error-text-field">Please select item</p>
                )}
                {/* <Input
                  type="select"
                  name="ITEM"
                  className="form-control"
                  id="basicpill-email-input4"
                  value={formData.ITEMS}
                  onChange={(e) => handleInputChange(e, "ITEMS")}
                >
                  <option value="">Select Item</option>
                  <option value="WEB">WEB</option>
                  <option value="MOBILE">MOBILE</option>
                </Input> */}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Change Requirement Subject
                  <span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  className="form-control"
                  id="basicpill-email-input4"
                  placeholder="Enter Subject"
                  value={formData.SUBJECT}
                  onChange={(e) => handleInputChange(e, "SUBJECT")}
                />

                {formDataErrorFlag?.SUBJECT && (
                  <p className="error-text-field">
                    Please enter change requirement subject
                  </p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Object/Tcode
                  {/* <span className="required-filed">*</span> */}
                </Label>
                <CustomInput
                  type="text"
                  name="ASSET"
                  className="form-control"
                  id="basicpill-email-input4"
                  value={formData.ASSET_NAME}
                  onChange={(e) => handleInputChange(e, "ASSET_NAME")}
                  placeholder="Enter Object/Tcode"
                />
                {formDataErrorFlag?.ASSET_NAME && (
                  <p className="error-text-field">Please enter Object/Tcode</p>
                )}
              </div>
            </Col>

            {/* Second Column (Right) */}
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input4" className="modal-label">
                  Reason for Change<span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  name="REASON"
                  className="form-control"
                  id="basicpill-email-input4"
                  value={formData.REASON_FOR_CHANGE}
                  onChange={(e) => handleInputChange(e, "REASON_FOR_CHANGE")}
                  placeholder="Enter Reason Here"
                />

                {formDataErrorFlag?.REASON_FOR_CHANGE && (
                  <p className="error-text-field">
                    Please enter reason of change
                  </p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input5" className="modal-label">
                  Change Type<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="CHANGETYPE"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  className="form-control"
                  id="basicpill-email-input5"
                  value={formData.CHANGE_TYPE}
                  onChange={(e) => handleInputChange(e, "CHANGE_TYPE")}
                >
                  <option value="">Select</option>
                  <option value={1}>Standard</option>
                  <option value={2}>Normal</option>
                  <option value={3}>Emergency</option>
                </Input>
                {formDataErrorFlag?.CHANGE_TYPE && (
                  <p className="error-text-field">Please select change type</p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input5" className="modal-label">
                  Impact of the Change<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="IMPACTCHANGE"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  className="form-control"
                  id="basicpill-email-input5"
                  value={formData.CHANGE_IMPACT}
                  onChange={(e) => handleInputChange(e, "CHANGE_IMPACT")}
                >
                  <option value="">Select</option>
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </Input>

                {formDataErrorFlag?.CHANGE_IMPACT && (
                  <p className="error-text-field">
                    Please select impact of the change
                  </p>
                )}
              </div>
            </Col>
            {(formData.PRIORITY == "P1" || formData.PRIORITY == "P2") && (
              <Col lg="3">
                <div className="">
                  <Label for="basicpill-email-input4" className="modal-label">
                    Business Justification
                    <span className="required-filed">*</span>
                  </Label>
                  <CustomInput
                    type="textarea"
                    name="DESCRIPTION"
                    className="form-control"
                    id="basicpill-email-input4"
                    value={formData.BUSSINESS_JUSTIFICATION}
                    onChange={(e) =>
                      handleInputChange(e, "BUSSINESS_JUSTIFICATION")
                    }
                    placeholder="Enter Here"
                  />

                  {formDataErrorFlag?.BUSSINESS_JUSTIFICATION && (
                    <p className="error-text-field">
                      Please enter Business Justifcation
                    </p>
                  )}
                </div>
              </Col>
            )}
            <Col lg="3">
              <div className="">
                <Label for="basicpill-email-input5" className="modal-label">
                  Change Duration<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  name="CHANGEDURATION"
                  className="form-control"
                  id="basicpill-email-input5"
                  value={formData.REQUEST_DURATION}
                  onChange={(e) => handleInputChange(e, "REQUEST_DURATION")}
                >
                  <option value="">Select</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Permanent">Permanent</option>
                </Input>

                {formDataErrorFlag?.REQUEST_DURATION && (
                  <p className="error-text-field">
                    Please select change duration
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </>
      );
    } else if (selectedOption === "option4") {
      // Render fields for Co-operative Society
      return <>{/* Add more fields as needed */}</>;
    }
    return null;
  };

  return (
    <MainScreen drawerWidth={282} Activekey={LOGTICKET}>
      <Toaster />
      {/* {!techMappedFlag && (
        <div
          style={{
            fontSize: 18,
            color: "red",
            marginLeft: 10,
          }}
        >
          Consultant not mapped for this customer, category, sub-category
        </div>
      )}
      {!approverFlag && (
        <div
          style={{
            fontSize: 18,
            color: "red",
            marginLeft: 10,
          }}
        >
          Approver not assigned for this client
        </div>
      )} */}
      <div style={{}}>
        <div className="log-page-content" id="MainContainer1">
          <Container className="log-container" fluid={true}>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    {/* <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4 style={{ color: "#30344a" }}>Create Ticket</h4>
                    </div> */}
                    <div>
                      <div className="content clearfix">
                        <Form>
                          <Row>
                            {(!props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER" ||
                              props.LOGGED_IN_DATA.LOGGED_IN_AS ==
                                "EMPLOYEE") && (
                              <Col lg="3">
                                <div className="" id="customerId">
                                  <Label
                                    for="basicpill-email-input4"
                                    className="modal-label"
                                    id="customerId1"
                                  >
                                    Customer
                                    <span className="required-filed">*</span>
                                  </Label>
                                  <CustomSelect
                                    id={"selectCustomer"}
                                    options={
                                      props.LOGGED_IN_DATA.USER_TYPE?.includes(
                                        3
                                      )
                                        ? projectData
                                        : allClients
                                    }
                                    value={
                                      props.LOGGED_IN_DATA.USER_TYPE?.includes(
                                        3
                                      )
                                        ? projectData.find(
                                            (val) =>
                                              val.value == formData.CLIENT_ID
                                          )
                                        : allClients.find(
                                            (val) =>
                                              val.value == formData.CLIENT_ID
                                          )
                                    }
                                    onChange={(e) => {
                                      // setClientId(e.value);
                                      setFormData((prev) => ({
                                        ...prev,
                                        CLIENT_ID: e.value,
                                      }));
                                      setFormDataErrorFlag((prev) => ({
                                        ...prev,
                                        CLIENT_ID: false,
                                      }));
                                      // axios
                                      //   .get(
                                      //     AXIOS.defaultPort +
                                      //       AXIOS.clientData +
                                      //       e.value
                                      //   )
                                      //   .then((res) => {
                                      //     if (res.data.length > 0) {
                                      //       if (
                                      //         res.data[0].APPROVER1 == "" ||
                                      //         res.data[0].APPROVER1 == undefined
                                      //       ) {
                                      //         setApproverFlag(false);
                                      //       } else {
                                      //         setApproverFlag(true);
                                      //       }
                                      //     } else {
                                      //       setApproverFlag(false);
                                      //     }
                                      //   });
                                    }}
                                  />

                                  {formDataErrorFlag?.CLIENT_ID && (
                                    <p className="error-text-field">
                                      Please select Customer
                                    </p>
                                  )}
                                </div>
                              </Col>
                            )}

                            <Col lg="3">
                              <div className="" id="CategoryId">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  id="CategoryId1"
                                >
                                  Category
                                  <span className="required-filed">*</span>
                                </Label>
                                <CustomSelect
                                  id={"selectCategory"}
                                  options={category}
                                  value={category.find(
                                    (val) => val.value == formData.CATEGORY_ID
                                  )}
                                  onChange={(e) => {
                                    setSelectedCat(e.value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      CATEGORY_ID: e.value,
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      CATEGORY_ID: false,
                                    }));
                                    getSubCategory(e.value);
                                  }}
                                />

                                {formDataErrorFlag?.CATEGORY_ID && (
                                  <p className="error-text-field">
                                    Please select category
                                  </p>
                                )}
                              </div>
                            </Col>
                            <Col lg="3">
                              <div className="" id="SubCategoryId">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  id="SubCategoryId1"
                                >
                                  Sub Category
                                  <span className="required-filed">*</span>
                                </Label>
                                <CustomSelect
                                  id={"selectSubCustomer"}
                                  options={SubCategoryData}
                                  value={SubCategoryData.find(
                                    (val) => val.value == formData.SUB_CATEGORY
                                  )}
                                  onChange={(e) => {
                                    setSelectedSubCat(e.value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      SUB_CATEGORY: e.value,
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      SUB_CATEGORY: false,
                                    }));
                                    let tempItems = [...allItems];
                                    let filteredItems = tempItems.filter(
                                      (val) =>
                                        val.CATEGORY == formData.CATEGORY_ID &&
                                        val.SUB_CATEGORY == e.value
                                    );

                                    setItemOptions(filteredItems);
                                    let filteredTech = allMappedTech.filter(
                                      (val) =>
                                        val.CLIENT_ID == formData.CLIENT_ID &&
                                        val.CATEGORY_ID ==
                                          formData.CATEGORY_ID &&
                                        val.SUB_CATEGORY_ID == e.value
                                    );
                                    if (filteredTech.length == 0) {
                                      setTechMappedFlag(false);
                                      setApproverModalFlag(true);
                                    } else {
                                      setTechMappedFlag(true);
                                      // setApproverModalFlag(false);
                                    }
                                    axios
                                      .get(
                                        AXIOS.defaultPort +
                                          AXIOS.getApprover +
                                          formData.CLIENT_ID +
                                          "&cat=" +
                                          formData.CATEGORY_ID +
                                          "&sub=" +
                                          e.value
                                      )
                                      .then((res) => {
                                        console.log("sjdkjdkwcnk1", res.data);
                                        if (
                                          Array.isArray(res.data) &&
                                          res.data.length == 0 &&
                                          props.LOGGED_IN_DATA.LOGGED_IN_AS ==
                                            "USER"
                                        ) {
                                          console.log("sjdkjdkwcnk3", res.data);

                                          setApproverFlag(false);
                                          setApproverModalFlag(true);
                                        } else {
                                          console.log("sjdkjdkwcnk2", res.data);

                                          setApproverFlag(true);
                                          // setApproverModalFlag(false);
                                        }
                                      });
                                  }}
                                />
                                {/* <p className="error-text-field">
                                  Please select sub category
                                </p> */}
                                {formDataErrorFlag?.SUB_CATEGORY && (
                                  <p className="error-text-field">
                                    Please select sub category
                                  </p>
                                )}
                              </div>
                            </Col>
                            <Col lg="3">
                              <div id="PriorityId">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  id="PriorityId1"
                                >
                                  Priority{" "}
                                  <span className="required-filed">*</span>
                                </Label>
                                <CustomSelect
                                  id={"selectPriority"}
                                  options={[
                                    { label: "P1-Very high", value: "P1" },
                                    { label: "P2-High", value: "P2" },
                                    { label: "P3-Medium", value: "P3" },
                                    { label: "P4-Low", value: "P4" },
                                  ]}
                                  value={[
                                    { label: "P1-Very high", value: "P1" },
                                    { label: "P2-High", value: "P2" },
                                    { label: "P3-Medium", value: "P3" },
                                    { label: "P4-Low", value: "P4" },
                                  ].find(
                                    (val) => val.value == formData.PRIORITY
                                  )}
                                  onChange={(e) => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      PRIORITY: e.value,
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      PRIORITY: false,
                                    }));
                                  }}
                                />
                                {/* <p className="error-text-field">
                                  Please select priority
                                </p> */}
                                {formDataErrorFlag?.PRIORITY && (
                                  <p className="error-text-field">
                                    Please select priority
                                  </p>
                                )}
                              </div>
                            </Col>
                            <div className="row">
                              <div className="col-md-10">
                                {/* Your form fields */}
                                <div
                                  className="form-group"
                                  id="TypeRequirement"
                                >
                                  <label className="modal-label">
                                    Type Of Requirement:{" "}
                                  </label>
                                  <div
                                    className="d-flex"
                                    id="select1"
                                    style={{ justifyContent: "space-around" }}
                                  >
                                    <div
                                      className="form-check"
                                      id="ServiceRequest"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="statusOfFeed"
                                        id="status1"
                                        value={1}
                                        checked={
                                          selectedOption == "1" ? true : false
                                        }
                                        onChange={handleOptionChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="status1"
                                      >
                                        Service Request
                                      </label>
                                      <Tooltip title="Error in existing process or traction , Report not working, Validation not working, Incorrect value in printout">
                                        <InfoOutlinedIcon
                                          style={{
                                            color: "gray",
                                            fontSize: 16,
                                            cursor: "pointer",
                                            color: "#219bcc",
                                            marginLeft: 2,
                                          }}
                                        />
                                      </Tooltip>
                                    </div>
                                    <div
                                      className="form-check"
                                      id="NewRequirement"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="statusOfFeed"
                                        id="status2"
                                        value={2}
                                        checked={
                                          selectedOption == "2" ? true : false
                                        }
                                        onChange={handleOptionChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="status2"
                                      >
                                        New Requirement
                                      </label>
                                      <Tooltip title="New Report Creation, New Validation, New Print out">
                                        <InfoOutlinedIcon
                                          style={{
                                            color: "gray",
                                            fontSize: 16,
                                            cursor: "pointer",
                                            color: "#219bcc",
                                            marginLeft: 2,
                                          }}
                                        />
                                      </Tooltip>
                                    </div>
                                    <div
                                      className="form-check"
                                      id="ChangeRequirement"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="statusOfFeed"
                                        id="status3"
                                        value={3}
                                        checked={
                                          selectedOption == "3" ? true : false
                                        }
                                        onChange={handleOptionChange}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="status3"
                                      >
                                        Change Requirement
                                      </label>
                                      <Tooltip title=" Change in existing Report, Change in Existing Validation, Change in Existing Print out">
                                        <InfoOutlinedIcon
                                          style={{
                                            color: "gray",
                                            fontSize: 16,
                                            cursor: "pointer",
                                            color: "#219bcc",
                                            marginLeft: 2,
                                          }}
                                        />
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {renderAdditionalFields()}
                            <Col lg="3">
                              <div className="" id="CCEmail">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  id="CCEmail1"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  CC Email{" "}
                                  <Tooltip title="For multiple email IDs, please enter comma ( , ) or semi-colon ( ; ) for separation">
                                    <InfoOutlinedIcon
                                      style={{
                                        color: "gray",
                                        fontSize: 16,
                                        cursor: "pointer",
                                        color: "#219bcc",
                                        marginLeft: 2,
                                      }}
                                    />
                                  </Tooltip>
                                </Label>
                                <CustomInput
                                  type="text"
                                  name="CC_EMAIL"
                                  className="form-control"
                                  id="basicpill-email-input4"
                                  value={formData.CC_EMAIL}
                                  onChange={(e) => {
                                    let temp = { ...formData };
                                    temp.CC_EMAIL = e.target.value;
                                    setFormData(temp);
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      CC_EMAIL: false,
                                    }));
                                  }}
                                  placeholder="Enter CC Mail Address"
                                />

                                {formDataErrorFlag?.CC_EMAIL == true && (
                                  <p className="error-text-field">
                                    Please enter cc email
                                  </p>
                                )}
                              </div>
                            </Col>
                            <Col lg="3">
                              <div className="" id="AttachFile">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  id="AttachFile1"
                                >
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
                                    minHeight: 30,
                                    maxHeight: 30,
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
                                  onChange={(e) => {
                                    const fileList = e.target.files;
                                    const fileArray = Array.from(fileList);
                                    setFormData((prevState) => ({
                                      ...prevState,
                                      ATTACHMENT: [
                                        ...prevState.ATTACHMENT,
                                        ...fileArray,
                                      ],
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      ATTACHMENT: false,
                                    }));
                                  }}
                                />
                                {/* 
                                <Input
                                  type="file"
                                  multiple
                                  name="FILE"
                                  className="form-control"
                                  id="basicpill-email-input4"
                                  onChange={(e) => {
                                    const fileList = e.target.files;
                                    const fileArray = Array.from(fileList);
                                    setFormData((prevState) => ({
                                      ...prevState,
                                      ATTACHMENT: [
                                        ...prevState.ATTACHMENT,
                                        ...fileArray,
                                      ],
                                    }));
                                  }}
                                /> */}
                                {formData.ATTACHMENT?.length > 0 && (
                                  <div
                                    className="col-md-5"
                                    style={{ width: "50%" }}
                                  >
                                    <p
                                      style={{
                                        fontWeight: "bold",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      Selected Files:
                                    </p>
                                    <ul>
                                      {formData.ATTACHMENT.map(
                                        (file, index) => {
                                          return (
                                            <li
                                              style={{ fontSize: "80%" }}
                                              key={index}
                                            >
                                              <span
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    display: "inline-block",
                                                    maxWidth: "80px",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                    color: "#2e78cb",
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() => {
                                                    const fileURL =
                                                      URL.createObjectURL(file);
                                                    const newTab = window.open(
                                                      fileURL,
                                                      "_blank"
                                                    );
                                                    setTimeout(
                                                      () =>
                                                        URL.revokeObjectURL(
                                                          fileURL
                                                        ),
                                                      20000
                                                    );
                                                  }}
                                                >
                                                  {file?.name}
                                                </span>
                                                <span
                                                  style={{
                                                    marginLeft: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "70%",
                                                  }}
                                                  onClick={() => {
                                                    let temp = { ...formData };

                                                    temp.ATTACHMENT.splice(
                                                      index,
                                                      1
                                                    );
                                                    setFormData(temp);
                                                  }}
                                                >
                                                  ❌
                                                </span>
                                              </span>
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {/* <p className="error-text-field">
                                  Please upload documents
                                </p> */}

                                {formDataErrorFlag?.ATTACHMENT == true && (
                                  <p className="error-text-field">
                                    Please upload documents
                                  </p>
                                )}
                              </div>
                            </Col>
                            <Col lg="3">
                              <div className="" id="Reference">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  id="Reference1"
                                >
                                  Reference
                                </Label>
                                <CustomInput
                                  type="text"
                                  name="CC_EMAIL"
                                  className="form-control"
                                  id="basicpill-email-input4"
                                  value={formData.REFERENCE}
                                  disabled={
                                    location.state?.TICKET_REFERENCE !=
                                    undefined
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    let temp = { ...formData };
                                    temp.REFERENCE = e.target.value;
                                    setFormData(temp);
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      REFERENCE: false,
                                    }));
                                  }}
                                  placeholder="Reference"
                                />

                                {formDataErrorFlag?.REFERENCE && (
                                  <p className="error-text-field">
                                    Please enter reference
                                  </p>
                                )}
                              </div>
                            </Col>
                            <Col lg="3">
                              <div className="" id="Reference">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  id="Reference1"
                                >
                                  Created By
                                </Label>
                                <CustomSelect
                                  id={"selectPriority"}
                                  options={empUserOptions}
                                  value={empUserOptions.find(
                                    (val) =>
                                      val.value == formData.DELEGATE_CREATED_BY
                                  )}
                                  onChange={(e) => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      DELEGATE_CREATED_BY: e.value,
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      DELEGATE_CREATED_BY: false,
                                    }));
                                  }}
                                />

                                {formDataErrorFlag?.DELEGATE_CREATED_BY && (
                                  <p className="error-text-field">
                                    Please enter delegate
                                  </p>
                                )}
                              </div>
                            </Col>
                            {/* <Col lg="3">
                              <div className="" id="object">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label "
                                  id="object1"
                                >
                                  Object / Tcode
                                </Label>
                                <CustomInput
                                  type="text"
                                  name="CC_EMAIL"
                                  className="form-control"
                                  id="basicpill-email-input4"
                                  placeholder="Object / Tcode"
                                  value={formData.OBJECT}
                                  onChange={(e) => {
                                    let temp = { ...formData };
                                    temp.OBJECT = e.target.value;
                                    setFormData(temp);
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      OBJECT: false,
                                    }));
                                  }}
                                />

                                {formDataErrorFlag?.OBJECT == true && (
                                  <p className="error-text-field">
                                    Please enter object
                                  </p>
                                )}
                              </div>
                            </Col> */}
                            <Col lg="12">
                              <div
                                id="Description"
                                style={{
                                  marginBottom: 50,
                                }}
                              >
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                  idd="Description1"
                                >
                                  Description
                                  <span className="required-filed">*</span>
                                </Label>
                                {/* <ReactQuill
                                  ref={(el) => (editorRef = el)}
                                  style={{ height: "30vh" }}
                                  theme="snow"
                                  // theme={"bubble"}
                                  // value={value}
                                  // onChange={setValue}
                                  value={formData.DESCRIPTION}
                                  onChange={(e) => {
                                    let temp = { ...formData };
                                    temp.DESCRIPTION = e;
                                    setFormData(temp);
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      DESCRIPTION: false,
                                    }));
                                  }}
                                /> */}
                                <JoditEditorCustom
                                  // ref={editor}
                                  // value={editorBody}
                                  // config={editorConfig}
                                  // onChange={(content) => setEditorBody(content)}

                                  value={formData.DESCRIPTION}
                                  onChange={(e) => {
                                    let temp = { ...formData };
                                    temp.DESCRIPTION = e;
                                    setFormData(temp);
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      DESCRIPTION: false,
                                    }));
                                  }}
                                />
                              </div>
                            </Col>

                            {formDataErrorFlag?.DESCRIPTION && (
                              <p className="error-text-field">
                                Please enter description
                              </p>
                            )}
                          </Row>
                          {/* <Row>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            {" "}
                            <Button
                              color="primary"
                              tag="input"
                              type="submit"
                              value="Submit"
                            />
                          </div>
                        </Row> */}
                        </Form>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "15px",
              marginRight: "15px",
            }}
          >
            {" "}
            {techMappedFlag && approverFlag && (
              <Button
                className="log-button-style"
                style={{ backgroundColor: "#219bcc" }}
                tag="input"
                type="submit"
                value="Submit"
                onClick={() => {
                  console.log("inside onclick");
                  handleSubmit();
                }}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        open={approverModalFlag}
        onClose={() => {
          setApproverModalFlag(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 750,
            bgcolor: "background.paper",
            borderRadius: "2%",
            boxShadow: 24,
            p: 3,
          }}
        >
          {!techMappedFlag && (
            <p
              style={{
                fontSize: 18,
                color: "red",
                marginLeft: 10,
              }}
            >
              Consultant not mapped for this customer, category, sub-category
            </p>
          )}
          {!approverFlag && (
            <p
              style={{
                fontSize: 18,
                color: "red",
                marginLeft: 10,
              }}
            >
              Approver not assigned for this customer, category, sub-category
            </p>
          )}
        </Box>
      </Modal>
    </MainScreen>
  );
}

const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {
  CategoryAction,
  SubCategoryAction,
})(LogTicket);
