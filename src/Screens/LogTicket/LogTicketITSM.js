import { React, useState } from "react";
import MainScreen from "../../components/AppDrawer/MainScreen";
import { DASHBOARD, EMPLOYEEDASHBOARD, LOGTICKET } from "../../Utils/Routes";
import "./LogTicket.css";
import CustomCard from "../../components/Cards/CustomCardUser";
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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AXIOS from "../../Utils/AXIOS";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import EmployeeDashboard from "../Dashboard/EmployeeDashboard";
import CustomSelect from "../../components/CustomDropdown/CustomSelect";
import CustomInput from "../../components/CustomInput/CustomInput";

function LogTicketITSM(props) {
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
  const [selectedOption, setSelectedOption] = useState("1");
  const [allUsers, setAllUsers] = useState([]);

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
  }, []);
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
        {
          FIELD_NAME: "ASSET_NAME",
        },
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
        {
          FIELD_NAME: "ASSET_NAME",
        },
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
      formData.BUSSINESS_JUSTIFICATION.length < 100
    ) {
      IsErrorFound = true;
      toast.error(
        "Minimum 100 Characters business justification required to log a ticket under Very High Priority"
      );
    }
    if (
      formData.PRIORITY == "P2" &&
      formData.BUSSINESS_JUSTIFICATION.length < 70
    ) {
      IsErrorFound = true;
      toast.error(
        "Minimum 100 Characters business justification required to log a ticket under High Priority"
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
      payloadFormData.append("CREATED_BY", props.LOGGED_IN_DATA.USER_ID);
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
          console.log("djvksdj", client.data);

          let pendingWith = [];
          if (client.data.length > 0) {
            pendingWith = [client.data[0].PROJECT_MANAGER];
            payloadFormData.append("PENDING_WITH", JSON.stringify(pendingWith));
          }
        }
      }
      // for (var pair of payloadFormData.entries()) {
      //   console.log("sdasdasdasdasdsad", pair[0] + ", " + pair[1]);
      // }
      axios
        .post(AXIOS.defaultPort + AXIOS.createTicket, payloadFormData)
        .then((response) => {
          cogoToast.success("Ticket created");
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
                axios
                  .post(AXIOS.defaultPort + AXIOS.mailToApproval, {
                    TICKET_ID: response.data.TICKET_ID,
                    TO_EMAIL: [email],
                    CC_EMAIL: [],
                  })
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

                axios
                  .post(AXIOS.defaultPort + AXIOS.mailToConsultant, {
                    TICKET_ID: response.data.TICKET_ID,
                    TO_EMAIL: email,
                    CC_EMAIL: [],
                  })
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

            axios
              .post(AXIOS.defaultPort + AXIOS.TicketAcknowledgementMail, {
                TICKET_ID: response.data.TICKET_ID,
                CC_EMAIL: [],
                TO_EMAIL: [email],
              })
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
  useEffect(() => {
    getAllClients();
  }, []);

  const renderAdditionalFields = () => {
    if (selectedOption === "1") {
      // Render fields for Proprietorship
      return (
        <>
          <Row>
            {/* First Column (Left) */}
            <Col lg="3">
              <div className="">
                <Label for="item-label" className="modal-label">
                  Item<span className="required-filed">*</span>
                </Label>
                <select
                  className="form-control"
                  id="item-select"
                  value={formData.ITEMS}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setSelectedSubCat(selectedValue); // Assuming setSelectedSubCat is used elsewhere
                    setFormData((prev) => ({
                      ...prev,
                      ITEMS: selectedValue,
                    }));
                    setFormDataErrorFlag((prev) => ({
                      ...prev,
                      ITEMS: false,
                    }));
                  }}
                >
                  <option value="">Select Item</option>
                  {itemOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {formDataErrorFlag.ITEMS && (
                  <p className="error-text-field">Please select item</p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div>
                <Label for="subject-label" className="modal-label">
                  Service Request Subject
                  <span className="required-filed">*</span>
                </Label>
                <input
                  type="text"
                  name="SERVICESUBJECT"
                  className="form-control"
                  id="subject-input"
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
                  id="serviceRequest1"
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
                  <Label for="justification-label" className="modal-label">
                    Business Justification
                    <span className="required-filed">*</span>
                  </Label>
                  <CustomInput
                    type="textarea"
                    name="DESCRIPTION"
                    className="form-control"
                    id="justification-input"
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
                <Label for="item1-label" className="modal-label">
                  Item<span className="required-filed">*</span>
                </Label>
                <select
                  className="form-control"
                  id="item2-select"
                  value={formData.ITEMS}
                  onChange={(e) => {
                    setSelectedSubCat(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      ITEMS: e.target.value,
                    }));
                    setFormDataErrorFlag((prev) => ({
                      ...prev,
                      ITEMS: false,
                    }));
                  }}
                >
                  <option value="">Select Item</option>
                  {itemOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {formDataErrorFlag.ITEMS && (
                  <p className="error-text-field">Please select Item</p>
                )}
              </div>
            </Col>
            <Col lg="3">
              <div className="">
                <Label for="newRequirment-label" className="modal-label">
                  New Requirement Subject
                  <span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  className="form-control"
                  id="newRequirment-input"
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
                <Label for="asset-label" className="modal-label">
                  Affected Asset Name<span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  name="ASSET"
                  className="form-control"
                  id="asset-input"
                  value={formData.ASSET_NAME}
                  onChange={(e) => handleInputChange(e, "ASSET_NAME")}
                  placeholder="Enter Asset Name"
                />

                {formDataErrorFlag?.ASSET_NAME && (
                  <p className="error-text-field">
                    Please enter affected asset name
                  </p>
                )}
              </div>
            </Col>

            {/* Second Column (Right) */}
            <Col lg="3">
              <div className="">
                <Label for="ReasonChange-label" className="modal-label">
                  Reason for Change<span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  name="REASON"
                  className="form-control"
                  id="ReasonChange-label"
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
                  id="changeType1"
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
                <select
                  name="IMPACTCHANGE"
                  className="form-control"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  id="impactChange-select"
                  value={formData.CHANGE_IMPACT}
                  onChange={(e) => {
                    handleInputChange(e, "CHANGE_IMPACT");
                  }}
                >
                  <option value="">Select</option>
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </select>

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
                    id="justification-input"
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
                <select
                  name="CHANGEDURATION"
                  className="form-control"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  id="changeDuration2-select"
                  value={formData.REQUEST_DURATION}
                  onChange={(e) => handleInputChange(e, "REQUEST_DURATION")}
                >
                  <option value="">Select</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Permanent">Permanent</option>
                </select>

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
                <select
                  name="ITEM"
                  className="form-control"
                  id="item3-select"
                  value={formData.ITEMS}
                  onChange={(e) => handleInputChange(e, "ITEMS")}
                >
                  <option value="">Select Item</option>
                  {itemOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formDataErrorFlag?.ITEMS && (
                  <p className="error-text-field">Please select item</p>
                )}
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
                  id="changeRequirment-input"
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
                  Affected Asset Name <span className="required-filed">*</span>
                </Label>
                <CustomInput
                  type="text"
                  name="ASSET"
                  className="form-control"
                  id="assetName-input"
                  value={formData.ASSET_NAME}
                  onChange={(e) => handleInputChange(e, "ASSET_NAME")}
                  placeholder="Enter Asset Name"
                />
                {formDataErrorFlag?.ASSET_NAME && (
                  <p className="error-text-field">
                    Please enter affected asset name
                  </p>
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
                  id="reasonChange-input"
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
                <select
                  name="CHANGETYPE"
                  className="form-control"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  id="changeType1-select"
                  value={formData.CHANGE_TYPE}
                  onChange={(e) => handleInputChange(e, "CHANGE_TYPE")}
                >
                  <option value="">Select</option>
                  <option value={1}>Standard</option>
                  <option value={2}>Normal</option>
                  <option value={3}>Emergency</option>
                </select>

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
                <select
                  name="IMPACTCHANGE"
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  className="form-control"
                  id="impactChange-select"
                  value={formData.CHANGE_IMPACT}
                  onChange={(e) => handleInputChange(e, "CHANGE_IMPACT")}
                >
                  <option value="">Select</option>
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </select>

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
                    id="Justification1-input"
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
                <select
                  style={{
                    height: 30,
                    fontSize: 13,
                  }}
                  name="CHANGEDURATION"
                  className="form-control"
                  id="changeDuration-select"
                  value={formData.REQUEST_DURATION}
                  onChange={(e) => handleInputChange(e, "REQUEST_DURATION")}
                >
                  <option value="">Select</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Permanent">Permanent</option>
                </select>

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
      {!techMappedFlag && (
        <p
          style={{
            fontSize: 22,
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
            fontSize: 22,
            color: "red",
            marginLeft: 10,
          }}
        >
          Approver not assigned for this client
        </p>
      )}
      <div style={{}}>
        <div className="log-page-content">
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
                                <div className="">
                                  <Label
                                    for="basicpill-email-input4"
                                    className="modal-label"
                                  >
                                    Customer
                                    <span className="required-filed">*</span>
                                  </Label>
                                  <select
                                    className="form-control"
                                    id="customer1-select"
                                    value={formData.CLIENT_ID}
                                    onChange={async (e) => {
                                      const selectedValue = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        CLIENT_ID: selectedValue,
                                      }));
                                      setFormDataErrorFlag((prev) => ({
                                        ...prev,
                                        CLIENT_ID: false,
                                      }));
                                      try {
                                        const res = await axios.get(
                                          `${AXIOS.defaultPort}${AXIOS.clientData}${selectedValue}`
                                        );
                                        if (res.data.length > 0) {
                                          if (
                                            res.data[0].APPROVER1 === "" ||
                                            res.data[0].APPROVER1 === undefined
                                          ) {
                                            setApproverFlag(false);
                                          } else {
                                            setApproverFlag(true);
                                          }
                                        } else {
                                          setApproverFlag(false);
                                        }
                                      } catch (error) {
                                        console.error(
                                          "Error fetching client data:",
                                          error
                                        );
                                        setApproverFlag(false);
                                      }
                                    }}
                                  >
                                    <option value="">Select Customer</option>
                                    {(props.LOGGED_IN_DATA.USER_TYPE?.includes(
                                      3
                                    )
                                      ? projectData
                                      : allClients
                                    ).map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  {formDataErrorFlag?.CLIENT_ID && (
                                    <p className="error-text-field">
                                      Please select Customer
                                    </p>
                                  )}
                                </div>
                              </Col>
                            )}

                            <Col lg="3">
                              <div className="">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                >
                                  Category
                                  <span className="required-filed">*</span>
                                </Label>
                                <select
                                  className="form-control"
                                  id="category-select"
                                  value={formData.CATEGORY_ID}
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setSelectedCat(selectedValue);
                                    setFormData((prev) => ({
                                      ...prev,
                                      CATEGORY_ID: selectedValue,
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      CATEGORY_ID: false,
                                    }));
                                    getSubCategory(selectedValue);
                                  }}
                                >
                                  <option value="">Select Category</option>
                                  {category.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                {formDataErrorFlag?.CATEGORY_ID && (
                                  <p className="error-text-field">
                                    Please select category
                                  </p>
                                )}
                              </div>
                            </Col>
                            <Col lg="3">
                              <div className="">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                >
                                  Sub Category
                                  <span className="required-filed">*</span>
                                </Label>
                                <select
                                  className="form-control"
                                  id="subCategory-select"
                                  value={formData.SUB_CATEGORY}
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setSelectedSubCat(selectedValue);
                                    setFormData((prev) => ({
                                      ...prev,
                                      SUB_CATEGORY: selectedValue,
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      SUB_CATEGORY: false,
                                    }));
                                    let tempItems = [...allItems];
                                    let filteredItems = tempItems.filter(
                                      (val) =>
                                        val.CATEGORY == formData.CATEGORY_ID &&
                                        val.SUB_CATEGORY == selectedValue
                                    );

                                    setItemOptions(filteredItems);
                                    let filteredTech = allMappedTech.filter(
                                      (val) =>
                                        val.CLIENT_ID == formData.CLIENT_ID &&
                                        val.CATEGORY_ID ==
                                          formData.CATEGORY_ID &&
                                        val.SUB_CATEGORY_ID == selectedValue
                                    );
                                    if (filteredTech.length == 0) {
                                      setTechMappedFlag(false);
                                    } else {
                                      setTechMappedFlag(true);
                                    }
                                  }}
                                >
                                  <option value="">Select Sub Category</option>
                                  {SubCategoryData.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                {formDataErrorFlag?.SUB_CATEGORY && (
                                  <p className="error-text-field">
                                    Please select sub category
                                  </p>
                                )}
                              </div>
                            </Col>
                            <Col lg="3">
                              <div>
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                >
                                  Priority{" "}
                                  <span className="required-filed">*</span>
                                </Label>
                                <select
                                  className="form-control"
                                  id="priority-select"
                                  value={formData.PRIORITY}
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      PRIORITY: selectedValue,
                                    }));
                                    setFormDataErrorFlag((prev) => ({
                                      ...prev,
                                      PRIORITY: false,
                                    }));
                                  }}
                                >
                                  <option value="">Select Priority</option>
                                  <option value="P1">P1-Very high</option>
                                  <option value="P2">P2-High</option>
                                  <option value="P3">P3-Medium</option>
                                  <option value="P4">P4-Low</option>
                                </select>
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
                                <div className="form-group">
                                  <label className="modal-label">
                                    Type Of Requirement:{" "}
                                  </label>
                                  <div
                                    className="d-flex"
                                    style={{ justifyContent: "space-around" }}
                                  >
                                    <div className="form-check ">
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
                                    </div>
                                    <div className="form-check ">
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
                                    </div>
                                    <div className="form-check ">
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
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {renderAdditionalFields()}
                            <Col lg="3">
                              <div className="">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                >
                                  CC Email
                                </Label>
                                <CustomInput
                                  type="text"
                                  name="CC_EMAIL"
                                  className="form-control"
                                  id="ccEmail-input"
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
                              <div className="">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
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
                                                  display: "inline-block",
                                                  maxWidth: "80px",
                                                  overflow: "hidden",
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
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
                              <div className="">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                >
                                  Reference
                                </Label>
                                <CustomInput
                                  type="text"
                                  name="CC_EMAIL"
                                  className="form-control"
                                  id="reference-input"
                                  value={formData.REFERENCE}
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
                              <div className="">
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label "
                                >
                                  Object / Tcode
                                </Label>
                                <CustomInput
                                  type="text"
                                  name="CC_EMAIL"
                                  className="form-control"
                                  id="object-input"
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
                            </Col>
                            <Col lg="12">
                              <div
                                style={{
                                  marginBottom: 50,
                                }}
                              >
                                <Label
                                  for="basicpill-email-input4"
                                  className="modal-label"
                                >
                                  Description
                                  <span className="required-filed">*</span>
                                </Label>
                                <ReactQuill
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
                  handleSubmit();
                }}
              />
            )}
          </div>
        </div>
      </div>
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
})(LogTicketITSM);
