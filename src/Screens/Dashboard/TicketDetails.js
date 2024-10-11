import { React, useState, useEffect } from "react";
import MainScreen from "../../components/AppDrawer/MainScreen";
import "./TicketDetails.css";
import {
  Card,
  Divider,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  Modal,
  Popover,
  Badge,
  Tooltip,
} from "@mui/material";
import { Col, Input, Label, Row } from "reactstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { height } from "@mui/system";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import Select from "react-select";
import { connect } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import cogoToast from "cogo-toast";
import {
  DASHBOARD,
  EMPLOYEEDASHBOARD,
  LOGTICKET,
  TICKET_REPORT_VIEW,
  TICKETDETAIL,
} from "../../Utils/Routes";
import constants from "../../Utils/constants";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CustomInput from "../../components/CustomInput/CustomInput";
import JoditEditorCustom from "../LogTicket/JoditEditorCustom";

const statusOptions = constants.statusOptions;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  borderRadius: "2%",
  boxShadow: 24,
  p: 3,
};
function TicketDetails(props) {
  let editorRef;

  // console.log("ASdaksdasda", location?.state?.row[0]);
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [effortUnit, setEffortUnit] = useState([]);
  const [effortsData, setEffortsData] = useState([]);
  const [thisTicket, setThisTicket] = useState(location?.state?.row[0]);

  const [anchorEl, setAnchorEl] = useState(null);

  const [AllRefTkttData, setAllRefTktData] = useState([]);

  const handleClick = (event) => {
    if (AllRefTkttData.length > 0) {
      setAnchorEl(event.currentTarget);
    } else {
      cogoToast.success("No reference ticket is created against this ticket");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    console.log("jafjshfkfsjf", location?.state?.row);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
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
  const [trEmpFlag, setTrEmpFlag] = useState(false);
  const [allUsers, setAllUsers] = useState(false);
  const [allMappedTech, setAllMappedTech] = useState([]);

  const [itemOptions, setItemOptions] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const [techMappedFlag, setTechMappedFlag] = useState(true);

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

  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedProjectType, setSelectedProjectType] = useState("4");
  const [selectedProjectSubCategory, setSelectedProjectSubCategory] =
    useState("");

  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const handleCloseModalOpen = () => setCloseModalOpen(true);
  const handleCloseModalClose = () => setCloseModalOpen(false);

  const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false);
  const handleEditDetailsCloseModalOpen = () => setEditDetailsModalOpen(true);
  const handleEditDetailsModalClose = () => setEditDetailsModalOpen(false);

  const [RemarksAddModalOpen, setRemarksAddModalOpen] = useState(false);
  const handleRemarksAddModalOpen = () => setRemarksAddModalOpen(true);
  const handleRemarksAddModalClose = () => setRemarksAddModalOpen(false);

  const ifTrEmpTech = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllMappedTech).then((res) => {
      if (
        res.data.some(
          (val) =>
            val.EMP_ID == props.LOGGED_IN_DATA.USER_ID &&
            val.CATEGORY_ID == 1 &&
            val.SUB_CATEGORY_ID == 1009
        )
      ) {
        setTrEmpFlag(true);
      }
    });
  };

  const [timeLineData, setTimeLineData] = useState({
    REMARKS: "",
    CC_EMAIL: "",
    STATUS: { label: "", value: "" },
    UPDATED_BY: "",
    ASSIGNED_TO: { label: "", value: "" },
  });
  useEffect(() => {
    let emailData = "";
    thisTicket.CC_EMAIL.map((val, index) => {
      emailData += val.EMAIL_ID;
      if (index < thisTicket.CC_EMAIL.length - 1) {
        emailData += ",";
      }
    });

    setTimeLineData({
      REMARKS: "",
      CC_EMAIL: emailData,
      STATUS: { label: thisTicket?.STATUS, value: thisTicket?.FLAG },
      UPDATED_BY: "",
      ASSIGNED_TO: { label: "", value: "" },
    });
  }, [thisTicket]);

  const [thisClient, setThisClient] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [thisEmp, setThisEmp] = useState({});
  const [approverData, setApproverData] = useState({});
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [approverModalFlag, setApproverModalFlag] = useState(false);
  const request = {
    1: "Service Request",
    2: "New Request",
    3: "Change Request",
  };
  useEffect(() => {
    console.log(
      "jhfjshshufkhk",
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
        thisTicket.CREATED_BY_TYPE == "EMPLOYEE" &&
        thisTicket?.ROLE?.includes(3) &&
        thisClient?.PROJECT_MANAGER == props.LOGGED_IN_DATA.USER_ID &&
        (thisTicket.FLAG == 8 || thisTicket.FLAG == 7)
    );
    console.log("jhfjshshufkhk1", thisTicket?.ROLE);
  }, []);
  const handleDownload = (name) => {
    const fileUrl = AXIOS.defaultPort + AXIOS.imageUrl + name;

    // const link = document.createElement("a");
    // link.href = fileUrl;

    // link.setAttribute("download", name);
    // document.body.appendChild(link);

    // link.click();

    // document.body.removeChild(link);
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        // ----------------
        let str = name;
        const parts = str.split("_");
        if (parts.length > 0) {
          const firstPart = parts[0];
          if (firstPart.includes("AdDeDnAmE")) {
            parts.shift();
          }
        }
        name = parts.join("_");
        // ----------------
        link.download = name || "downloaded-file";
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
      });
  };
  const handleFileChange = (e) => {
    setFilesToAdd(Array.from(e.target.files));
  };
  useEffect(() => {
    ifTrEmpTech();
    getAllItems();
    getAllMappedTech();
    getSubCategory(thisTicket.CATEGORY_ID);
    getAllRefTkt(thisTicket.TICKET_ID);
  }, []);
  const getAllMappedTech = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllMappedTech).then((res) => {
      setAllMappedTech(res.data);
    });
  };
  const getAllRefTkt = (ID) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getTicketIdByReference + ID)
      .then((response) => {
        setAllRefTktData(response.data);
        // setAllMappedTech(res.data);
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

  const getTicketData = () => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getTicketById +
          location?.state?.row[0].TICKET_ID
      )
      .then((res) => {
        if (res.data.length > 0) {
          setThisTicket({ ...res.data[0], ROLE: location?.state?.row[0].ROLE });
        }
      });
  };

  let getAllTechnicians = async () => {
    let responseData = await axios.get(
      AXIOS.defaultPort + AXIOS.getTechnicianForClient + thisTicket.CLIENT_ID
    );
    let techData = responseData?.data;
    techData = techData.filter(
      (val) =>
        val.CATEGORY_ID == thisTicket.CATEGORY_ID &&
        val.SUB_CATEGORY_ID == thisTicket.SUB_CATEGORY
    );
    let pendingWith = [];
    techData.map((val) => {
      pendingWith.push(val.EMP_ID);
    });
    pendingWith = [...new Set(pendingWith)];
    return pendingWith;
  };
  const ticketApproval = async () => {
    let approvalPayload = new FormData();
    if (thisTicket.FLAG == 8) {
      approvalPayload.append("APPROVAL1", true);
      approvalPayload.append("FLAG", 0);
      approvalPayload.append("TICKET_ACTION", 3);

      // ----------
      // let responseData = await axios.get(
      //   AXIOS.defaultPort + AXIOS.getTechnicianForClient + thisTicket.CLIENT_ID
      // );
      // let techData = responseData?.data;
      // techData = techData.filter(
      //   (val) =>
      //     val.CATEGORY_ID == thisTicket.CATEGORY_ID &&
      //     val.SUB_CATEGORY_ID == thisTicket.SUB_CATEGORY
      // );
      // let pendingWith = [];
      // techData.map((val) => {
      //   pendingWith.push(val.EMP_ID);
      // });
      // pendingWith = [...new Set(pendingWith)];
      approvalPayload.append(
        "PENDING_WITH",
        JSON.stringify(await getAllTechnicians())
      );
      // ----------
    } else {
      approvalPayload.append("APPROVAL2", true);
      approvalPayload.append("FLAG", 5);
      approvalPayload.append("TICKET_ACTION", 7);

      approvalPayload.append(
        "PENDING_WITH",
        JSON.stringify([thisTicket.ASSIGNED_TO])
      );
    }
    // approvalPayload.append("STATUS", "Open");

    axios
      .post(
        AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
        approvalPayload
      )
      .then((res) => {
        cogoToast.success(`Ticket ${thisTicket.TICKET_ID} approved`);
        getTicketData();
        if (timeLineData.REMARKS || selectedFiles) {
          let timelinePayload = new FormData();
          timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);
          timelinePayload.append(
            "REMARKS",
            `<p>Ticket (Requirement) has been Approved by ${props.LOGGED_IN_DATA.USER_NAME}</p>` +
              timeLineData.REMARKS
          );

          if (thisTicket.FLAG == 8) {
            timelinePayload.append("STATUS", 0);
            timelinePayload.append("TICKET_ACTION", 3);
          } else {
            timelinePayload.append("STATUS", 5);
            timelinePayload.append("TICKET_ACTION", 7);
          } // timelinePayload.append("STATUS", "Pending for TR approval");
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          selectedFiles.forEach((file, index) => {
            // updatePayload.append(`ATTACHMENT`, file);
            timelinePayload.append(`ATTACHMENT`, file);
          });
          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
            .then((res) => {
              console.log("Timeline created");
            });
        }
        if (thisTicket.FLAG == 8) {
          let email = [];
          technicians.map((val) => {
            email.push(val.EMP_EMAIL);
          });
          let consultantMailFormdata = new FormData();
          let ccEmail = thisTicket.CC_EMAIL.map((val) => val.EMAIL_ID);
          consultantMailFormdata.append("CC_EMAIL", ccEmail);
          consultantMailFormdata.append("TO_EMAIL_CONSULTANTS", email);
          consultantMailFormdata.append("TO_EMAIL_USER", [
            thisTicket.CREATED_BY_EMAIL,
          ]);
          consultantMailFormdata.append(
            "APPROVED_BY",
            props.LOGGED_IN_DATA.USER_NAME
          );
          consultantMailFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
          selectedFiles.forEach((file, index) => {
            consultantMailFormdata.append(`ATTACHMENTS`, file);
          });

          axios
            .post(
              AXIOS.defaultPort + AXIOS.tktApproveMailsend,
              consultantMailFormdata
            )
            .catch((err) => {
              cogoToast.error("Email could not be sent to consultant");
            });
        } else {
          let effortMailFormdata = new FormData();
          effortMailFormdata.append("TO_EMAIL_APPROVED", [
            thisTicket.ASSIGNED_TO_EMAIL,
          ]);
          let ccEmail = thisTicket.CC_EMAIL.map((val) => val.EMAIL_ID);

          effortMailFormdata.append("CC_EMAIL_APPROVED", [
            ...ccEmail,
            thisTicket.CREATED_BY_EMAIL,
          ]);
          effortMailFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
          selectedFiles.forEach((file, index) => {
            effortMailFormdata.append(`ATTACHMENTS`, file);
          });
          axios
            .post(
              AXIOS.defaultPort + AXIOS.effortsApprovedMailSend,
              effortMailFormdata
            )
            .catch((err) => {
              cogoToast.error("Email could not be sent to consultant");
            });
        }

        if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
          navigate(EMPLOYEEDASHBOARD);
        }
        if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
          navigate(DASHBOARD);
        }
      });
  };
  const rejectTicket = () => {
    let ccEmail = thisTicket.CC_EMAIL.map((val) => val.EMAIL_ID);

    let rejectPayload = new FormData();
    if (thisTicket.FLAG == 8) {
      rejectPayload.append("APPROVAL1", false);
      rejectPayload.append("TICKET_ACTION", 4);
    } else {
      rejectPayload.append("APPROVAL2", false);
      rejectPayload.append("TICKET_ACTION", 8);
    }
    rejectPayload.append("FLAG", 10);

    axios
      .post(
        AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
        rejectPayload
      )
      .then((res) => {
        cogoToast.warn(`Ticket ${thisTicket.TICKET_ID} rejected`);
        if (timeLineData.REMARKS || selectedFiles) {
          let timelinePayload = new FormData();
          timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);
          timelinePayload.append(
            "REMARKS",
            `<p>Ticket (Requirement) has been Rejected by ${props.LOGGED_IN_DATA.USER_NAME}</p>` +
              timeLineData.REMARKS
          );
          timelinePayload.append("STATUS", 10);
          // timelinePayload.append("STATUS", "Pending for TR approval");
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          if (thisTicket.FLAG == 8) {
            timelinePayload.append("TICKET_ACTION", 4);
          } else {
            timelinePayload.append("TICKET_ACTION", 8);
          }
          selectedFiles.forEach((file, index) => {
            // updatePayload.append(`ATTACHMENT`, file);
            timelinePayload.append(`ATTACHMENT`, file);
          });
          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
            .then((res) => {});
        }
        if (thisTicket.FLAG == 8) {
          let consultantMailFormdata = new FormData();
          consultantMailFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
          consultantMailFormdata.append("CC_EMAIL", ccEmail);
          consultantMailFormdata.append("TO_EMAIL_USER_REJECT", [
            thisTicket.CREATED_BY_EMAIL,
          ]);
          selectedFiles.forEach((file, index) => {
            consultantMailFormdata.append(`ATTACHMENTS`, file);
          });

          axios
            .post(
              AXIOS.defaultPort + AXIOS.tktApproveMailsend,
              consultantMailFormdata
            )
            .catch((err) => {
              cogoToast.error("Email could not be sent to consultant");
            });
        } else {
          let userMailFormdata = new FormData();
          userMailFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
          userMailFormdata.append("CC_EMAIL_REJECTED", [
            ...ccEmail,
            thisTicket.ASSIGNED_TO_EMAIL,
          ]);
          userMailFormdata.append("TO_EMAIL_REJECTED", [
            thisTicket.CREATED_BY_EMAIL,
          ]);
          selectedFiles.forEach((file, index) => {
            userMailFormdata.append(`ATTACHMENTS`, file);
          });

          axios
            .post(
              AXIOS.defaultPort + AXIOS.effortsApprovedMailSend,
              userMailFormdata
            )
            .catch((err) => {
              cogoToast.error("Email could not be sent to consultant");
            });
        }
        // -------------
        if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
          navigate(DASHBOARD);
        } else {
          navigate(EMPLOYEEDASHBOARD);
        }
      });
  };
  const getTimelineData = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getTimeline + thisTicket.TICKET_ID)
      .then((res) => {
        let temp = [...res.data];
        temp.map((val) => {
          val.UPDATED_ON_DATE = new Date(val.UPDATED_ON).toDateString();
          let fileName = "";
          let fileType = "";
          val.FILE_NAME?.map((file) => {
            let nameFile = file.FILE_NAME;
            const parts = nameFile.split("_");
            if (parts.length > 0) {
              const firstPart = parts[0];
              if (firstPart.includes("AdDeDnAmE")) {
                parts.shift();
              }
            }
            file.FILE_NAME1 = parts.join("_");
          });

          val.FILE_NAME?.map((file) => {
            fileName += file.FILE_NAME + ", ";
            fileType += file.FILE_TYPE + ", ";
          });
          val.fileName = fileName;
          val.fileType = fileType;
        });
        console.log("khfjgeufew", temp);

        if (res.data.length > 0) {
          setTimeline(temp);
        }
      });
  };
  const getClientData = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.clientData + thisTicket.CLIENT_ID)
      .then((res) => {
        if (res.data.length > 0) {
          setThisClient(res.data[0]);
        }
      });
  };
  const getEmpData = () => {
    // if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllUser /*+ thisTicket.CREATED_BY*/)
      .then((res) => {
        setAllUsers(res.data);

        if (res.data.length > 0) {
          setThisEmp(
            res.data.find((val) => val.USER_ID == thisTicket.CREATED_BY)
          );
        }
      });
    // } else if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
    //   axios
    //     .get(
    //       AXIOS.defaultPort + AXIOS.getAllEmployess /*+ thisTicket.CREATED_BY*/
    //     )
    //     .then((res) => {
    //       let temp = [...res.data];
    //       temp.USER_ID = temp.EMP_ID;
    //       temp.USER_NAME = temp.EMP_NAME;
    //       temp.USER_MOBILE = temp.EMP_MOBILE;
    //       temp.USER_EMAIL = temp.EMP_EMAIL;

    //       if (res.data.length > 0) {
    //         setThisEmp(
    //           res.data.find((val) => val.EMP_ID == thisTicket.CREATED_BY)
    //         );
    //       }
    //     });
    // }
  };
  const getApproverData = async () => {
    let responseData = await axios.get(
      AXIOS.defaultPort +
        AXIOS.getApprover +
        thisTicket.CLIENT_ID +
        "&cat=" +
        thisTicket.CATEGORY_ID +
        "&sub=" +
        thisTicket.SUB_CATEGORY
    );
    setApproverData(responseData.data);
  };

  const HandleEffortsSubmit = async () => {
    // if (approverData.length == 0) {
    //   setApproverModalFlag(true);
    // } else {
    let pendingWith = [];

    if (thisTicket.CREATED_BY_TYPE == "USER") {
      // let responseData = await axios.get(AXIOS.defaultPort + AXIOS.getApprover + thisTicket.CLIENT_ID)

      // let responseData = await axios.get(
      //   AXIOS.defaultPort +
      //     AXIOS.getApprover +
      //     thisTicket.CLIENT_ID +
      //     "&cat=" +
      //     thisTicket.CATEGORY_ID +
      //     "&sub=" +
      //     thisTicket.SUB_CATEGORY
      // );
      // let approverData = responseData?.data;
      pendingWith.push(approverData.APPROVER2);
    }
    if (thisTicket.CREATED_BY_TYPE == "EMPLOYEE") {
      pendingWith.push(thisClient.PROJECT_MANAGER);
    }

    if (
      !effortsData ||
      !effortUnit ||
      effortsData.length == 0 ||
      effortUnit.length == 0
    ) {
      cogoToast.error("Please fill data");
    } else {
      axios
        .post(
          AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
          {
            EFFORTS: effortsData + " " + effortUnit,
            FLAG: 7,
            PENDING_WITH: JSON.stringify(pendingWith),
            TICKET_ACTION: "9",
          }
        )
        .then((res) => {
          cogoToast.success(
            `Effort Submitted for ticket ${thisTicket.TICKET_ID}`
          );
          setEffortsData([]);
          setEffortUnit([]);
          getTicketData();
          if (timeLineData.REMARKS || selectedFiles) {
            let timelinePayload = new FormData();
            timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);
            // if (timeLineData.REMARKS && timeLineData.REMARKS != "") {
            // timelinePayload.append("REMARKS", timeLineData.REMARKS);
            // } else {
            timelinePayload.append(
              "REMARKS",
              `<p>Efforts of ${effortsData} ${effortUnit} submitted for approval</p><p>${timeLineData.REMARKS}</p>`
            );
            // }
            timelinePayload.append("STATUS", 7);
            timelinePayload.append("TICKET_ACTION", 9);
            // timelinePayload.append("STATUS", "Pending for TR approval");
            timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
            selectedFiles.forEach((file, index) => {
              // updatePayload.append(`ATTACHMENT`, file);
              timelinePayload.append(`ATTACHMENT`, file);
            });
            axios
              .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
              .then((res) => {
                console.log("Timeline created");
                getTimelineData();
              });
          }

          axios
            .get(
              AXIOS.defaultPort +
                AXIOS.getApprover +
                thisTicket.CLIENT_ID +
                "&cat=" +
                thisTicket.CATEGORY_ID +
                "&sub=" +
                thisTicket.SUB_CATEGORY
            )
            .then((resp) => {
              let email = allUsers.find(
                (val) => val.USER_ID == resp.data.APPROVER2
              )?.USER_EMAIL;
              let ccEmail = thisTicket.CC_EMAIL.map((val) => val.EMAIL_ID);

              let approverMailFormdata = new FormData();
              approverMailFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
              approverMailFormdata.append("TO_EMAIL_SUBMITTED", [email]);
              approverMailFormdata.append("CC_EMAIL_SUBMITTED", [
                ...ccEmail,
                thisTicket.CREATED_BY_EMAIL,
              ]);
              selectedFiles.forEach((file, index) => {
                approverMailFormdata.append(`ATTACHMENTS`, file);
              });
              axios
                .post(
                  AXIOS.defaultPort + AXIOS.effortsApprovedMailSend,
                  approverMailFormdata
                )
                .catch((err) => {
                  cogoToast.error("Email could not be sent to consultant");
                });
            });
        });
    }
    // }
  };

  const trSubmitHandler = () => {
    let trSubmitPayload = new FormData();
    trSubmitPayload.set("FLAG", 5);
    trSubmitPayload.set("TICKET_ACTION", 11);
    trSubmitPayload.set("TR_SUBMITTED", true);
    trSubmitPayload.set("TR_APPROVAL", false);
    trSubmitPayload.append(
      "PENDING_WITH",
      JSON.stringify([thisTicket.ASSIGNED_TO])
    );
    axios
      .post(
        AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket?.TICKET_ID,
        trSubmitPayload
      )
      .then((res) => {
        cogoToast.success(`TR Submitted for ticket ${thisTicket.TICKET_ID}`);
        let mailTo = [];
        thisTicket.PENDING_WITH.map((val) => {
          mailTo.push(val.USER_EMAIL);
        });
        let ccEmail = thisTicket.CC_EMAIL.map((val) => val.EMAIL_ID);
        let TRMovedFormdata = new FormData();
        TRMovedFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
        TRMovedFormdata.append("TO_EMAIL", mailTo);
        TRMovedFormdata.append("CC_EMAIL", ccEmail);
        selectedFiles.forEach((file, index) => {
          TRMovedFormdata.append(`ATTACHMENTS`, file);
        });

        if (timeLineData.REMARKS || selectedFiles) {
          let timelinePayload = new FormData();
          timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);
          timelinePayload.append(
            "REMARKS",
            `<p>TR has been moved</p>` + timeLineData.REMARKS
          );
          timelinePayload.append("STATUS", 5);
          // timelinePayload.append("STATUS", "Pending for TR approval");
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          selectedFiles.forEach((file, index) => {
            // updatePayload.append(`ATTACHMENT`, file);
            timelinePayload.append(`ATTACHMENT`, file);
          });
          timelinePayload.append("TICKET_ACTION", 11);

          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
            .then((res) => {
              console.log("Timeline created");
              axios
                .post(AXIOS.defaultPort + AXIOS.mailForTRMoved, TRMovedFormdata)
                .then((res) => {
                  console.log("Mail for TR moved");
                });
            });
        }
        navigate(EMPLOYEEDASHBOARD);
      });
  };
  useEffect(() => {
    //technicianGet
    getClientData();
    getEmpData();
    getTimelineData();
    getApproverData();
    getDefaultConsultantData();
  }, []);

  const getDefaultConsultantData = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.getAssignToDd, {
        CLIENT_ID: thisTicket.CLIENT_ID,
        CATEGORY_ID: thisTicket.CATEGORY_ID,
        SUB_CATEGORY_ID: thisTicket.SUB_CATEGORY,
      })
      .then((res) => {
        let tech = [...res.data];
        tech.map((val) => {
          val.label = val.EMP_NAME + " (" + val.EMP_ID + ")";
          val.value = val.EMP_ID;
        });
        // tech = tech.filter((e, i) => {
        //   return (
        //     tech.findIndex((x) => {
        //       return x.EMP_ID == e.EMP_ID;
        //     }) == i
        //   );
        // });
        setTechnicians(tech);
      });
  };

  const handleAddFiles = () => {
    setSelectedFiles([...selectedFiles, ...filesToAdd]);
    setFilesToAdd([]);
    document.getElementById("basicpill-email-input4").value = ""; // Clear input field after adding files
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  const isPC = window.innerWidth > 1024;
  const gridSize = isPC ? 4 : 12;
  const handlePickup = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.ticketPickup, {
        TICKET_ID: thisTicket.TICKET_ID,
        FLAG: 5,
        STATUS: "Under Process By Samishti",
        ASSIGNED_TO: props.LOGGED_IN_DATA.USER_ID,
        PICKED_BY: props.LOGGED_IN_DATA.USER_ID,
        PENDING_WITH: [props.LOGGED_IN_DATA.USER_ID],
        TICKET_ACTION: "2",
        REMARKS: `Ticket has been assigned to ${props.LOGGED_IN_DATA.USER_NAME}`,
        UPDATED_BY: props.LOGGED_IN_DATA.USER_ID,
      })
      .then(() => {
        cogoToast.success(`Ticket ${thisTicket.TICKET_ID} Picked`);
        if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
          navigate(DASHBOARD);
        } else if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
          navigate(EMPLOYEEDASHBOARD);
        }
      });
  };
  const handleTimelineSubmit = (TicketStatus, TicketFlag) => {
    let status = "";
    let flag = "";
    if (TicketStatus && TicketFlag) {
      flag = TicketFlag;
      status = TicketStatus;
    } else {
      status = timeLineData.STATUS.label;
      flag = timeLineData.STATUS.value;
    }

    let payload = new FormData();
    payload.append("TICKET_ID", thisTicket.TICKET_ID);

    if (
      timeLineData?.ASSIGNED_TO.value != thisTicket.ASSIGNED_TO &&
      timeLineData?.ASSIGNED_TO?.label != "" &&
      timeLineData?.ASSIGNED_TO?.label != undefined &&
      timeLineData?.ASSIGNED_TO?.label != null &&
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
    ) {
      payload.append(
        "REMARKS",
        `<p>Ticket has been assigned to ${timeLineData?.ASSIGNED_TO.label}</p>` +
          timeLineData.REMARKS
      );
      payload.set("TICKET_ACTION", 5);
    } else if (Number(flag) == 4) {
      payload.append(
        "REMARKS",
        `<p>Ticket has been closed by ${props.LOGGED_IN_DATA.USER_NAME}</p>` +
          timeLineData.REMARKS
      );
      payload.set("TICKET_ACTION", 17);
    } else {
      if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
        payload.set("TICKET_ACTION", 14);
      } else if (thisTicket.ASSIGNED_TO == props.LOGGED_IN_DATA.USER_ID) {
        payload.set("TICKET_ACTION", 18);
      } else {
        payload.set("TICKET_ACTION", 19);
      }
      console.log(
        "sjdfjhdjfd",
        Number(timeLineData?.STATUS.value) != Number(thisTicket.FLAG) &&
          timeLineData?.STATUS?.label != "" &&
          timeLineData?.STATUS?.label != undefined &&
          timeLineData?.STATUS?.label != null &&
          props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
      );
      if (
        Number(timeLineData?.STATUS.value) != Number(thisTicket.FLAG) &&
        timeLineData?.STATUS?.label != "" &&
        timeLineData?.STATUS?.label != undefined &&
        timeLineData?.STATUS?.label != null &&
        props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE"
      ) {
        if (Number(timeLineData?.STATUS.value == 2)) {
          payload.set("TICKET_ACTION", 20);
        }
        payload.append(
          "REMARKS",
          `<div><p>The ticket status has been changed from ${
            constants.statusFlag.find(
              (val) => val.flag == Number(thisTicket.FLAG)
            )?.status
          } to ${timeLineData?.STATUS.label}</p>${timeLineData.REMARKS}</div>`
        );
      } else {
        payload.append("REMARKS", timeLineData.REMARKS);
      }
    }
    // payload.append("STATUS", flag);
    if (
      [2, 12, 6, 13, 11].includes(Number(thisTicket.FLAG)) &&
      Number(TicketFlag) != 4 &&
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER"
    ) {
      payload.append("STATUS", "5");
    } else {
      if (flag != "") {
        payload.append("STATUS", flag);
      } else {
        payload.append("STATUS", thisTicket.FLAG);
      }
    }
    // payload.append("FLAG", flag);
    payload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
    // for (var pair of payload.entries()) {
    //   console.log("sdasdasdasdasdsad", pair[0] + ", " + pair[1]);
    // }

    let updatePayload = new FormData();
    // updatePayload.append("STATUS", status);
    if (
      [2, 12, 6, 13, 11].includes(Number(thisTicket.FLAG)) &&
      Number(TicketFlag) != 4 &&
      props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER"
    ) {
      updatePayload.set("FLAG", "5");
    } else {
      updatePayload.set("FLAG", flag);
    }
    // updatePayload.append("ATTACHMENT", selectedFiles);
    selectedFiles.forEach((file, index) => {
      payload.append(`ATTACHMENT`, file);
    });

    if (
      timeLineData?.ASSIGNED_TO?.label != "" &&
      timeLineData?.ASSIGNED_TO?.label != undefined &&
      timeLineData?.ASSIGNED_TO?.label != null
    ) {
      updatePayload.append("ASSIGNED_TO", timeLineData?.ASSIGNED_TO?.value);
      updatePayload.append(
        "PENDING_WITH",
        JSON.stringify([timeLineData?.ASSIGNED_TO?.value])
      );
    }
    // for (var pair of updatePayload.entries()) {
    //   console.log("hgfdhasdhasg", pair[0] + ", " + pair[1]);
    // }
    axios
      .post(
        AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
        updatePayload
      )
      .then((res) => {
        if (TicketStatus == undefined) {
        } else if (Number(TicketFlag) != 4) {
          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, payload)
            .then((res) => {
              cogoToast.success(`Ticket ${thisTicket.TICKET_ID} updated`);
              getTimelineData();
              setTimeLineData({
                REMARKS: "",
                CC_EMAIL: "",
                STATUS: { label: "", value: "" },
                UPDATED_BY: "",
              });
              if (thisTicket.ASSIGNED_TO == props.LOGGED_IN_DATA.USER_ID) {
                responseEmailSendToUser();
              }
              if (thisTicket.CREATED_BY == props.LOGGED_IN_DATA.USER_ID) {
                let consultantResFormdata = new FormData();
                consultantResFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
                if (
                  Number(thisTicket.FLAG) == 0 ||
                  Number(thisTicket.FLAG) == 8
                ) {
                  let email = [];
                  technicians.map((val) => {
                    email.push(val.EMP_EMAIL);
                  });
                  consultantResFormdata.append("TO_EMAIL", email);
                } else {
                  consultantResFormdata.append("TO_EMAIL", [
                    thisTicket.ASSIGNED_TO_EMAIL,
                  ]);
                }
                consultantResFormdata.append(
                  "CC_EMAIL",
                  emailStringToArray(timeLineData.CC_EMAIL)
                );
                selectedFiles.forEach((file, index) => {
                  consultantResFormdata.append(`ATTACHMENTS`, file);
                });
                axios.post(
                  AXIOS.defaultPort + AXIOS.customerRespondToConsultantMail,
                  consultantResFormdata
                );
              }
            });
          // cogoToast.success("Submitted");
          if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
            navigate(DASHBOARD);
          } else if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
            navigate(EMPLOYEEDASHBOARD);
          }
        }
        if (Number(TicketFlag) == 4) {
          handleCloseModalClose();
          if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER") {
            navigate(DASHBOARD);
          } else if (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE") {
            navigate(EMPLOYEEDASHBOARD);
          }
          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, payload)
            .then((res) => {
              cogoToast.success(`Ticket ${thisTicket.TICKET_ID} updated`);
              getTimelineData();
              setTimeLineData({
                REMARKS: "",
                CC_EMAIL: "",
                STATUS: { label: "", value: "" },
                UPDATED_BY: "",
              });
            });

          axios
            .post(AXIOS.defaultPort + AXIOS.ticketCloseMail, {
              TICKET_ID: thisTicket.TICKET_ID,
              CC_EMAIL: emailStringToArray(timeLineData.CC_EMAIL),
              TO_EMAIL: [thisTicket.ASSIGNED_TO_EMAIL],
            })
            .then((res) => {});
        }
      });
  };
  const emailStringToArray = (emailString) => {
    let ccTempArray = [];
    if (emailString != "" && emailString) {
      ccTempArray = emailString.split(/[\;,]+/);
    }
    let finalCc = [];
    ccTempArray.map((val) => {
      if (val.includes("@") && val.includes(".com")) {
        finalCc.push(val.trim());
      }
    });
    return finalCc;
  };
  const responseEmailSendToUser = () => {
    let custResFormdata = new FormData();
    custResFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
    custResFormdata.append("TO_EMAIL", [thisTicket.EMAIL]);
    custResFormdata.append(
      "CC_EMAIL",
      emailStringToArray(timeLineData.CC_EMAIL)
    );
    selectedFiles.forEach((file, index) => {
      custResFormdata.append(`ATTACHMENTS`, file);
    });
    axios.post(
      AXIOS.defaultPort + AXIOS.SamishtiRespondToCustomerMail,
      custResFormdata
    );
  };
  const handleEditorChange = (html) => {
    let temp = { ...timeLineData };
    temp.REMARKS = html;
    setTimeLineData(temp);
  };

  function capitalizeFirstLetter(str) {
    if (str) {
      return str?.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  }

  function getCurrentTimeIn24HourFormat(now) {
    // Get hours, minutes, and seconds
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Add leading zero if needed
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    // Construct the time string in 24-hour format
    const timeIn24HourFormat = `${hours}:${minutes}:${seconds}`;

    return timeIn24HourFormat;
  }
  const initiateTR = async () => {
    let trPayload = new FormData();
    trPayload.append("TR_APPROVAL", true);
    trPayload.append("TR_APPROVED", 0);
    trPayload.append("FLAG", "9");
    trPayload.append("TICKET_ACTION", "10");
    trPayload.append(
      "PENDING_WITH",
      JSON.stringify([thisClient.PROJECT_MANAGER])
    );

    axios
      .post(
        AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
        trPayload
      )
      .then((res) => {
        cogoToast.success(`TR Initiated for ticket ${thisTicket.TICKET_ID}`);
        getTicketData();
        let ccEmail = thisTicket.CC_EMAIL.map((val) => val.EMAIL_ID);
        axios
          .post(AXIOS.defaultPort + AXIOS.mailForTRApproval, {
            TICKET_ID: thisTicket.TICKET_ID,
            CC_EMAIL: ccEmail,
            TO_EMAIL: [thisClient.PROJECT_MANAGER_EMAIL],
          })
          .then((res) => {
            console.log("Mail sent to Manager", res.data);
          });
        if (timeLineData.REMARKS || selectedFiles) {
          let timelinePayload = new FormData();
          timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);
          timelinePayload.append("REMARKS", timeLineData.REMARKS);
          timelinePayload.append("STATUS", "9");
          // timelinePayload.append("STATUS", "Pending for TR approval");
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          selectedFiles.forEach((file, index) => {
            // updatePayload.append(`ATTACHMENT`, file);
            timelinePayload.append(`ATTACHMENT`, file);
          });
          timelinePayload.append("TICKET_ACTION", 10);

          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
            .then((res) => {
              console.log("Timeline created");
            });
        }
        navigate(EMPLOYEEDASHBOARD);
      });
  };

  const handleTrApproval = async (apprStatus) => {
    let trPayload = new FormData();
    let pendingWith = [];
    let pendingWithEmail = [];
    let ccEmail = thisTicket.CC_EMAIL.map((val) => val.EMAIL_ID);

    trPayload.append("TR_APPROVAL", true);
    trPayload.append("TR_APPROVED", apprStatus);
    if (apprStatus == 1) {
      trPayload.set("FLAG", 1);
      const res = await axios.get(
        AXIOS.defaultPort + AXIOS.getTechnicianForClient + thisTicket.CLIENT_ID
      );
      let trTechnicians = res.data.filter(
        (val) => val.CATEGORY_ID == 1 && val.SUB_CATEGORY_ID == 1009
      );
      trTechnicians.map((tech) => {
        pendingWith.push(tech.EMP_ID);
        pendingWithEmail.push(tech.EMP_EMAIL);
      });
      pendingWith = [...new Set(pendingWith)];
      pendingWithEmail = [...new Set(pendingWithEmail)];
      trPayload.append("PENDING_WITH", JSON.stringify(pendingWith));
    } else if (apprStatus == 2) {
      trPayload.set("FLAG", 5);
      trPayload.set("TR_APPROVAL", false);
      trPayload.append(
        "PENDING_WITH",
        JSON.stringify([thisTicket.ASSIGNED_TO])
      );
    }
    axios
      .post(
        AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
        trPayload
      )
      .then((res) => {
        cogoToast.success(
          `TR Movement approved for ticket ${thisTicket.TICKET_ID}`
        );
        getTicketData();
        if (apprStatus == 1) {
          let TRApprMailFormdata = new FormData();
          TRApprMailFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
          TRApprMailFormdata.append("TO_EMAIL", pendingWithEmail);
          TRApprMailFormdata.append("CC_EMAIL", ccEmail);
          selectedFiles.forEach((file, index) => {
            TRApprMailFormdata.append(`ATTACHMENTS`, file);
          });
          axios
            .post(
              AXIOS.defaultPort + AXIOS.mailForTRApproved,
              TRApprMailFormdata
            )
            .then((res) => {
              console.log("TR Approved mail sent");
            });
        } else if (apprStatus == 2) {
          let TRReturnMailFormdata = new FormData();
          TRReturnMailFormdata.append("TICKET_ID", thisTicket.TICKET_ID);
          TRReturnMailFormdata.append("TO_EMAIL", [
            thisTicket.ASSIGNED_TO_EMAIL,
          ]);
          console.log("jhfjsddsd", thisTicket.ASSIGNED_TO_EMAIL);
          TRReturnMailFormdata.append("CC_EMAIL", ccEmail);
          selectedFiles.forEach((file, index) => {
            TRReturnMailFormdata.append(`ATTACHMENTS`, file);
          });
          axios
            .post(
              AXIOS.defaultPort + AXIOS.mailForTRReturned,
              TRReturnMailFormdata
            )
            .then((res) => {
              console.log("TR Rejected mail sent");
            });
        }
        let htmlRemarks = "";
        if (apprStatus == 1) {
          htmlRemarks += `<p>TR has been approved</p>`;
        } else if (apprStatus == 2) {
          htmlRemarks += `<p>TR has been returned to requestor</p>`;
        }
        if (timeLineData.REMARKS || selectedFiles) {
          let timelinePayload = new FormData();
          timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);
          if (apprStatus == 1) {
            timelinePayload.set("STATUS", 1);
            timelinePayload.append("TICKET_ACTION", 12);
          } else if (apprStatus == 2) {
            timelinePayload.set("STATUS", 5);
            timelinePayload.append("TICKET_ACTION", 13);
          }
          timelinePayload.append("REMARKS", htmlRemarks + timeLineData.REMARKS);

          // timelinePayload.append("STATUS", "Pending for TR approval");
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          selectedFiles.forEach((file, index) => {
            // updatePayload.append(`ATTACHMENT`, file);
            timelinePayload.append(`ATTACHMENT`, file);
          });
          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
            .then((res) => {
              console.log("Timeline created");
            });
        }
        navigate(EMPLOYEEDASHBOARD);
      });
  };
  const [RequiredFields, setRequiredFields] = useState([]);

  useEffect(() => {
    if (Number(selectedOption) == 1) {
      let tempFields = [];

      setRequiredFields(tempFields);
    } else if (Number(selectedOption) == 2) {
      let tempFields = [
        {
          FIELD_NAME: "SUB_CATEGORY",
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
      ];

      setRequiredFields(tempFields);
    } else if (Number(selectedOption) == 3) {
      let tempFields = [
        {
          FIELD_NAME: "SUB_CATEGORY",
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
      ];

      setRequiredFields(tempFields);
    }
  }, [selectedOption]);

  const updateTicketDetails = async () => {
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

    let IsErrorFound = false;
    Object.keys(tempErrorsData).map((key, colIndex) => {
      if (tempErrorsData[key] == true) {
        IsErrorFound = true;
      }
    });

    setFormDataErrorFlag(tempErrorsData);
    if (IsErrorFound == false) {
      let payloadFormData = new FormData();
      payloadFormData.append("TICKET_ACTION", 6);
      RequiredFields.map((val) => {
        payloadFormData.append(val["FIELD_NAME"], formData[val.FIELD_NAME]);
      });

      if (selectedOption == "1") {
        payloadFormData.set("ASSET_NAME", "");
        payloadFormData.set("REASON_FOR_CHANGE", "");
        payloadFormData.set("CHANGE_TYPE", "");
        payloadFormData.set("CHANGE_IMPACT", "");
        payloadFormData.set("FLAG", 0);
        payloadFormData.set(
          "PENDING_WITH",
          JSON.stringify(await getAllTechnicians())
        );
      } else {
        let approver = await axios.get(
          AXIOS.defaultPort +
            AXIOS.getApprover +
            thisTicket.CLIENT_ID +
            "&cat=" +
            thisTicket.CATEGORY_ID +
            "&sub=" +
            formData.SUB_CATEGORY
        );

        if (thisTicket.REQUEST == 1) {
          payloadFormData.set("FLAG", 8);

          payloadFormData.append(
            "PENDING_WITH",
            JSON.stringify([approver.data.APPROVER1])
          );
        } else {
          payloadFormData.set("FLAG", thisTicket.flag);
          let pending = [];
          if (formData.SUB_CATEGORY != thisTicket.SUB_CATEGORY) {
            thisTicket.PENDING_WITH.map((val) => {
              pending.push(approver.data.APPROVER1);
            });
          } else {
            thisTicket.PENDING_WITH.map((val) => {
              pending.push(val.USER_ID);
            });
          }
          payloadFormData.append("PENDING_WITH", JSON.stringify(pending));
        }
      }

      // if (Number(thisTicket.REQUEST) == Number(selectedOption)) {
      //   // alert("Same")
      // } else {
      //   // alert("not same")
      // }

      payloadFormData.set("SUB_CATEGORY", formData.SUB_CATEGORY);
      payloadFormData.set("ITEMS", formData.ITEMS);
      payloadFormData.set("REQUEST", selectedOption);

      // for (var pair of payloadFormData.entries()) {
      //   console.log("sdasdasdasdasdsad", pair[0] + ", " + pair[1]);
      // }
      let thisRequest = thisTicket.REQUEST;
      let thisSubCategory = thisTicket.SUB_CATEGORY;
      axios
        .post(
          AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
          payloadFormData
        )
        .then((response) => {
          let timelinePayload = new FormData();
          timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);

          timelinePayload.append("STATUS", thisTicket.FLAG);
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          timelinePayload.append("TICKET_ACTION", 6);
          let htmlRemark = "";
          if (Number(thisSubCategory) != Number(formData.SUB_CATEGORY)) {
            let fromSubCat = subCategoryData.find(
              (val) => val.SUB_CATEGORY_ID == thisSubCategory
            )?.SUB_CATEGORY_NAME;
            let toSubCat = subCategoryData.find(
              (val) => val.SUB_CATEGORY_ID == formData.SUB_CATEGORY
            )?.SUB_CATEGORY_NAME;

            htmlRemark += `<p>The Sub Category has been changed from ${fromSubCat} to ${toSubCat}</p>`;
          }
          if (Number(thisRequest) != Number(selectedOption)) {
            htmlRemark += `<p>The type of requirement has been changed from ${
              constants.requestType[Number(thisRequest)]
            } to ${constants.requestType[Number(selectedOption)]}</p>`;
          }
          timelinePayload.append("REMARKS", htmlRemark);

          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
            .then((res) => {
              console.log("Timeline created");
              handleEditDetailsModalClose();
              getTicketData();
              getTimelineData();
            });
        })
        .catch((err) => {});
    }
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

  const [subCategoryData, setSubCategoryData] = useState([]);

  const getSubCategory = (Category) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getSubCategory + Category)
      .then((response) => {
        if (
          response.data?.SUB_CATEGORY &&
          response.data?.SUB_CATEGORY.length > 0
        ) {
          let temp = [];

          response.data.SUB_CATEGORY?.map((val) => {
            temp.push({
              label: val.SUB_CATEGORY_NAME,
              value: val.SUB_CATEGORY_ID,
              ...val,
            });
          });
          setSubCategoryData(temp);
        }
      });
  };

  const handleOptionChange = (event) => {
    let temp = { ...formData };
    temp.REQUEST = event.target.value;
    setFormData(temp);
    setSelectedOption(event.target.value);
  };
  const handleSelectedProjectType = (event) => {
    // let temp = { ...formData };
    // temp.REQUEST = event.target.value;
    // setFormData(temp);

    console.log("ASdsabdbasd", event.target.value);
    switch (event.target.value) {
      case "1":
        getAllEmployeeList();
        break;
      case "2":
        getAllEmpByProjectList();
        break;
      case "3":
        getAllEmpBySubCatList();
        break;
      case "4":
        getDefaultConsultantData();
        break;
    }

    setSelectedProjectType(event.target.value);
  };
  const getAllEmployeeList = () => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllEmployess)
      .then((response) => {
        console.log("asdkashkdsad", response.data);

        let temp = [];
        response.data.map((val) => {
          temp.push({
            label: `${val.EMP_NAME} (${val.EMP_ID})`,
            value: val.EMP_ID,
            ...val,
          });
        });
        setTechnicians(temp);
      })
      .catch((err) => {});
  };
  const getAllEmpByProjectList = () => {
    axios
      .get(
        AXIOS.defaultPort + AXIOS.getTechnicianForClient + thisTicket.CLIENT_ID
      )
      .then((response) => {
        console.log("asdkashkdsad", response.data);

        let temp = [];
        response.data.map((val) => {
          temp.push({
            label: `${val.EMP_NAME} (${val.EMP_ID})`,
            value: val.EMP_ID,
            ...val,
          });
        });
        setTechnicians(temp);
      })
      .catch((err) => {});
  };

  const getAllEmpBySubCatList = (SubCategory) => {
    axios
      .get(
        AXIOS.defaultPort +
          AXIOS.getTechinicianByCatSubCat +
          thisTicket.CATEGORY_ID +
          "&SUBCATEGORY_ID=" +
          SubCategory
      )
      .then((response) => {
        console.log(
          "asdkashkdsad",
          AXIOS.defaultPort +
            AXIOS.getTechinicianByCatSubCat +
            thisTicket.CATEGORY_ID +
            "&SUBCATEGORY_ID=" +
            SubCategory
        );

        let temp = [];
        response.data.map((val) => {
          temp.push({
            label: `${val.EMP_NAME} (${val.EMP_ID})`,
            value: val.EMP_ID,
            ...val,
          });
        });
        setTechnicians(temp);
      })
      .catch((err) => {});
  };

  const renderAdditionalFields = () => {
    if (selectedOption === "1") {
      // Render fields for Proprietorship
      return (
        <>
          <Row>{/* First Column (Left) */}</Row>
        </>
      );
    } else if (selectedOption === "2") {
      // Render fields for Partnership
      return (
        <>
          <Row>
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input4" className="modal-label">
                  Affected Asset Name<span className="required-filed">*</span>
                </Label>
                <Input
                  type="text"
                  name="ASSET"
                  className="form-control"
                  id="basicpill-email-input4"
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
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input4" className="modal-label">
                  Reason for Change<span className="required-filed">*</span>
                </Label>
                <Input
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
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input5" className="modal-label">
                  Change Type<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="CHANGETYPE"
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
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input5">
                  Impact of the Change<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="IMPACTCHANGE"
                  className="form-control"
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
              <Col lg="6">
                <div className="mb-3">
                  <Label for="basicpill-email-input4" className="modal-label">
                    Business Justification
                    <span className="required-filed">*</span>
                  </Label>
                  <Input
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
                      Please enter Business Justification
                    </p>
                  )}
                </div>
              </Col>
            )}
            {/* <Col lg="6">
              <div className="mb-3">
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
          </Row>
        </>
      );
    } else if (selectedOption === "3") {
      // Render fields for Company
      return (
        <>
          <Row>
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input4" className="modal-label">
                  Affected Asset Name <span className="required-filed">*</span>
                </Label>
                <Input
                  type="text"
                  name="ASSET"
                  className="form-control"
                  id="basicpill-email-input4"
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
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input4" className="modal-label">
                  Reason for Change<span className="required-filed">*</span>
                </Label>
                <Input
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
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input5" className="modal-label">
                  Change Type<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="CHANGETYPE"
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
            <Col lg="6">
              <div className="mb-3">
                <Label for="basicpill-email-input5" className="modal-label">
                  Impact of the Change<span className="required-filed">*</span>
                </Label>
                <Input
                  type="select"
                  name="IMPACTCHANGE"
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
              <Col lg="6">
                <div className="mb-3">
                  <Label for="basicpill-email-input4" className="modal-label">
                    Business Justification
                    <span className="required-filed">*</span>
                  </Label>
                  <Input
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
          </Row>
        </>
      );
    } else if (selectedOption === "option4") {
      // Render fields for Co-operative Society
      return <>{/* Add more fields as needed */}</>;
    }
    return null;
  };

  const updateTargetDate = () => {
    if (
      thisTicket.NEW_TARGET_DATE != "" &&
      thisTicket.NEW_TARGET_DATE != undefined
    ) {
      let payloadFormData = new FormData();

      payloadFormData.append("TARGET_DATE", thisTicket.NEW_TARGET_DATE);
      payloadFormData.append("TD_UPDATE_REASON", thisTicket.TARGET_DATE_REASON);
      axios
        .post(
          AXIOS.defaultPort + AXIOS.updateTicketById + thisTicket.TICKET_ID,
          payloadFormData
        )
        .then((response) => {
          let timelinePayload = new FormData();
          timelinePayload.append("TICKET_ID", thisTicket.TICKET_ID);

          timelinePayload.append("STATUS", thisTicket.FLAG);
          timelinePayload.append("UPDATED_BY", props.LOGGED_IN_DATA?.USER_ID);
          let htmlRemark;

          if (thisTicket.TARGET_DATE == undefined) {
            htmlRemark = `<p>Target Date has been submitted as ${new Date(
              thisTicket.NEW_TARGET_DATE
            ).toDateString()} by ${props.LOGGED_IN_DATA.USER_NAME}</p>`;
            timelinePayload.append("TICKET_ACTION", 15);
          } else {
            htmlRemark = `<p>Target Date has been updated from  ${new Date(
              thisTicket.TARGET_DATE
            ).toDateString()} to  ${new Date(
              thisTicket.NEW_TARGET_DATE
            ).toDateString()} by ${
              props.LOGGED_IN_DATA.USER_NAME
            }</p><b>Reason:</b><p>${thisTicket.TARGET_DATE_REASON}</p>`;
            timelinePayload.append("TICKET_ACTION", 16);
          }

          timelinePayload.append("REMARKS", htmlRemark);

          axios
            .post(AXIOS.defaultPort + AXIOS.createTimeline, timelinePayload)
            .then((res) => {
              console.log("Timeline created");
              // handleEditDetailsModalClose();
              getTicketData();
              getTimelineData();
              cogoToast.success(
                `Target date submitted for ticket ${thisTicket.TICKET_ID}`
              );
            });
        })
        .catch((err) => {});
    } else {
      cogoToast.error("Please fill target date");
    }
  };
  const convertIndianStandardIntoYMD = (date) => {
    var dateObj = new Date(date);
    if (!isNaN(dateObj) && dateObj != "") {
      let mnth = ("0" + (dateObj?.getMonth() + 1)).slice(-2);
      let day = ("0" + dateObj?.getDate())?.slice(-2);
      return [dateObj.getFullYear(), mnth, day].join("-");
    }
  };

  const searchTktID = (TicketID) => {
    if (TicketID == "") {
    } else {
      axios
        .get(AXIOS.defaultPort + AXIOS.getTicketById + TicketID)
        .then((res) => {
          console.log("ASdkhasbdjahd", res.data);
          if (res.data.length > 0) {
            navigate(TICKET_REPORT_VIEW, {
              state: {
                row: [{ ...res.data[0], ROLE: [] }],
              },
            });
          }
        });
    }
  };

  return (
    <MainScreen drawerWidth={282} Activekey={TICKETDETAIL}>
      <div className="parent-container">
        <div className="child-container-1">
          <div
            className="ticket-details-headers"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                //   color: COLORS.white,
                fontWeight: 700,
                fontSize: 15,
                p: 0.5,
                color: "#fff",
                // backgroundColor: "#2d344b",
              }}
            >
              Ticket Details{" "}
              {(props.LOGGED_IN_DATA.USER_ID == thisClient.PROJECT_MANAGER ||
                (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                  (props.LOGGED_IN_DATA.USER_TYPE.includes(1) ||
                    props.LOGGED_IN_DATA.USER_TYPE.includes(7) ||
                    props.LOGGED_IN_DATA.USER_TYPE.includes(0)))) &&
                ((thisTicket.FLAG == 0 && thisTicket.REQUEST == 1) ||
                  ((thisTicket.FLAG == 8 || thisTicket.FLAG == 0) &&
                    [2, 3].includes(Number(thisTicket.REQUEST)))) && (
                  <span
                    style={{
                      marginLeft: 5,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleEditDetailsCloseModalOpen();
                      setFormData(thisTicket);

                      setSelectedOption(thisTicket.REQUEST);

                      let tempItems = [...allItems];
                      let filteredItems = tempItems.filter((val) => {
                        return (
                          val.CATEGORY == thisTicket.CATEGORY_ID &&
                          val.SUB_CATEGORY == thisTicket.SUB_CATEGORY
                        );
                      });

                      setItemOptions(filteredItems);

                      getSubCategory(thisTicket.CATEGORY_ID);
                    }}
                  >
                    <BorderColorIcon />
                  </span>
                )}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <button
                className="signup-button"
                style={{
                  minWidth: 120,
                  margin: 5,
                  fontSize: 14,
                  fontWeight: "bold",
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#fff",
                }}
                onClick={() => {
                  navigate(LOGTICKET, {
                    state: {
                      TICKET_REFERENCE: thisTicket.TICKET_ID,
                      CLIENT_ID: thisTicket.CLIENT_ID,

                      CATEGORY_ID: thisTicket.CATEGORY_ID,
                    },
                  });
                }}
              >
                {" "}
                Create Ref Ticket
              </button>

              <span
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
              >
                <Badge badgeContent={AllRefTkttData.length} color="primary">
                  <SummarizeIcon
                    style={{
                      color: "#fff",
                      marginRight: 5,
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </span>
              {/* <Button>Open Popover</Button> */}
              {AllRefTkttData.length > 0 && (
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <div>
                    {AllRefTkttData.map((val, index) => {
                      return (
                        <>
                          <p
                            className="typo-style"
                            style={{
                              marginTop: index != 0 ? -6 : 0,
                              marginBottom:
                                index == AllRefTkttData.length - 1 ? -1 : 0,
                              margin: 1,
                              fontSize: 14,
                              color: "blue",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              searchTktID(val.TICKET_ID);
                            }}
                          >
                            {val.TICKET_ID}
                          </p>
                          <Divider />
                        </>
                      );
                    })}
                  </div>
                </Popover>
              )}
            </div>
          </div>

          <Paper
            sx={{
              p: 1,
              // margin: "auto",
              // flexGrow: 1,
              backgroundColor: "#fff",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={gridSize}>
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Ticket ID
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.TICKET_ID}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Sub Category
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.SUB_CATEGORY_NAME}
                  </Typography>
                </div>
                {/* <Divider /> */}
                {/* <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Item
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.ITEM_NAME}{" "}
                  </Typography>
                </div> */}
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Priority
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {
                      constants.priorityStatus.find(
                        (item) => item.value == thisTicket.PRIORITY
                      )?.label
                    }
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {capitalizeFirstLetter(thisTicket.STATUS)}
                  </Typography>
                </div>
                <Divider />

                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Target Date
                  </Typography>
                  <Col lg="4">
                    <CustomInput
                      type="date"
                      className="form-control"
                      id="basicpill-email-input4"
                      placeholder="Enter Subject"
                      disabled={
                        !(
                          props.LOGGED_IN_DATA?.LOGGED_IN_AS == "EMPLOYEE" &&
                          (thisTicket?.ROLE?.includes(1) ||
                            thisTicket?.ROLE?.includes(7)) &&
                          thisTicket.FLAG != 0 &&
                          thisTicket.FLAG != 4 &&
                          thisTicket.FLAG != 10 &&
                          (thisTicket.ASSIGNED_TO ==
                            props.LOGGED_IN_DATA.USER_ID ||
                            thisTicket?.ROLE?.includes(7))
                        )
                      }
                      value={
                        thisTicket.NEW_TARGET_DATE == undefined
                          ? convertIndianStandardIntoYMD(thisTicket.TARGET_DATE)
                          : thisTicket.NEW_TARGET_DATE
                      }
                      onChange={(e) =>
                        setThisTicket((prev) => ({
                          ...prev,
                          NEW_TARGET_DATE: e.target.value,
                        }))
                      }
                    />
                  </Col>
                  {props.LOGGED_IN_DATA?.LOGGED_IN_AS == "EMPLOYEE" &&
                    (thisTicket?.ROLE?.includes(1) ||
                      thisTicket?.ROLE?.includes(7)) &&
                    thisTicket.FLAG != 0 &&
                    thisTicket.FLAG != 4 &&
                    thisTicket.FLAG != 10 &&
                    (thisTicket.ASSIGNED_TO == props.LOGGED_IN_DATA.USER_ID ||
                      thisTicket?.ROLE?.includes(7)) && (
                      <div className="m-2 d-flex justify-content-end">
                        <button
                          style={
                            {
                              // marginRight: 10,
                            }
                          }
                          onClick={() => {
                            if (thisTicket.TARGET_DATE == undefined) {
                              updateTargetDate();
                              // handleRemarksAddModalOpen();
                            } else {
                              if (
                                thisTicket.NEW_TARGET_DATE != "" &&
                                thisTicket.NEW_TARGET_DATE != undefined
                              ) {
                                handleRemarksAddModalOpen();
                              } else {
                                cogoToast.error("Please fill target date");
                              }
                            }
                          }}
                          className="signup-button"
                        >
                          Save
                        </button>
                      </div>
                    )}
                </div>
                <Divider />
              </Grid>
              <Grid item xs={gridSize}>
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Customer
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.COMPANY_NAME}
                  </Typography>
                </div>
                <Divider />
                {/* <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      p: 1,
                      width: 140,
                      height: "4vh",
                    }}
                  >
                    Company
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      marginLeft: "6px",
                      fontSize: 14,
                    }}
                  >
                    {thisClient.COMPANY_NAME}
                  </Typography>
                </div> */}
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    User Name
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket?.CREATED_BY_NAME}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Contact Number
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket?.MOBILE_NUMBER}{" "}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Email
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket?.EMAIL}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Reference
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                      color:
                        Number(thisTicket.REFERENCE).toString() != "NaN"
                          ? "blue"
                          : null,

                      textDecoration:
                        Number(thisTicket.REFERENCE).toString() != "NaN"
                          ? "underline"
                          : null,
                      cursor:
                        Number(thisTicket.REFERENCE).toString() != "NaN"
                          ? "pointer"
                          : null,
                    }}
                    onClick={() => {
                      console.log("Asdnashda");
                      if (Number(thisTicket.REFERENCE)) {
                      }
                      searchTktID(thisTicket.REFERENCE);
                    }}
                  >
                    {thisTicket.REFERENCE}
                  </Typography>
                </div>

                <Divider />
                <div className="form-details">
                  {thisTicket?.APPROVAL1 == true &&
                    thisTicket?.APPROVAL2 != true && (
                      <>
                        <Typography
                          className="typo-label-box"
                          sx={{
                            color: "#3f5078",
                            fontWeight: 600,
                            fontSize: 14,
                            maxWidth: "30%",
                            minWidth: "30%",
                          }}
                        >
                          Approval
                        </Typography>

                        <Typography
                          className="typo-style"
                          sx={{
                            fontSize: 14,
                            maxWidth: "70%",
                            minWidth: "70%",
                            color: "green",
                          }}
                        >
                          Requirement Approved
                        </Typography>
                      </>
                    )}
                  {thisTicket?.APPROVAL1 == true &&
                    thisTicket?.APPROVAL2 == true && (
                      <>
                        <Typography
                          className="typo-label-box"
                          sx={{
                            color: "#3f5078",
                            fontWeight: 600,
                            fontSize: 14,
                            maxWidth: "30%",
                            minWidth: "30%",
                          }}
                        >
                          Approval
                        </Typography>

                        <Typography
                          className="typo-style"
                          sx={{
                            fontSize: 14,
                            maxWidth: "70%",
                            minWidth: "70%",
                            color: "green",
                          }}
                        >
                          Efforts Approved
                        </Typography>
                      </>
                    )}
                  {/* <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.REFERENCE}
                  </Typography> */}
                </div>

                <Divider />
              </Grid>
              <Grid item xs={gridSize}>
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Category
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.CATEGORY_NAME}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Posted Date
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {new Date(thisTicket.LOGGED_DATE).toDateString()}{" "}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Type of Request
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {request[thisTicket.REQUEST]}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Change Duration
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.REQUEST_DURATION}
                  </Typography>
                </div>
                <Divider />
                <div className="form-details">
                  <Typography
                    className="typo-label-box"
                    sx={{
                      color: "#3f5078",
                      fontWeight: 600,
                      fontSize: 14,
                      maxWidth: "30%",
                      minWidth: "30%",
                    }}
                  >
                    Object/Tcode
                  </Typography>
                  <Typography
                    className="typo-style"
                    sx={{
                      fontSize: 14,
                      maxWidth: "70%",
                      minWidth: "70%",
                    }}
                  >
                    {thisTicket.ASSET_NAME}
                  </Typography>
                </div>
                <Divider />
              </Grid>
            </Grid>
            <div className="form-details">
              <Typography
                className="typo-label-box"
                sx={{
                  color: "#3f5078",
                  fontWeight: 600,
                  fontSize: 14,
                  maxWidth: "10%",
                  minWidth: "10%",
                }}
              >
                Subject
              </Typography>
              <Typography
                className="typo-style"
                sx={{
                  fontSize: 14,
                  maxWidth: "90%",
                  minWidth: "90%",
                  marginLeft: -0.2,
                }}
              >
                {thisTicket.SUBJECT}
              </Typography>
            </div>
            <Divider />
            {thisTicket?.BUSSINESS_JUSTIFICATION && (
              <div className="form-details">
                <Typography
                  className="typo-label-box"
                  sx={{
                    color: "#3f5078",
                    fontWeight: 600,
                    fontSize: 14,
                    maxWidth: "10%",
                    minWidth: "10%",
                  }}
                >
                  Business Justification
                </Typography>
                <Typography
                  className="typo-style"
                  sx={{
                    fontSize: 14,
                    maxWidth: "90%",
                    minWidth: "90%",
                    marginLeft: -0.2,
                  }}
                >
                  {thisTicket.BUSSINESS_JUSTIFICATION}
                </Typography>
              </div>
            )}
          </Paper>
          {/* ------ticket timeline and details */}
          <>
            {/* <div
                style={{
                  width: "99%",
                  height: 5,
                  backgroundColor: "#2d344b",
                  marginBottom:10
                }}
              /> */}
            {timeline.length > 0 && (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  p: 0.5,
                  color: "#fff",
                  // backgroundColor: "#2d344b",
                }}
                className="ticket-details-headers"
              >
                Post Details :
              </Typography>
            )}
            {timeline.map((val, index) => {
              return (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        border: "1px solid #f0f0f0",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15,
                          p: 1,
                          color: "#000",
                          maxWidth: "800px",
                          wordWrap: "break-word",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Post Date:{" "}
                        </span>
                        {val.UPDATED_ON_DATE},{" "}
                        {getCurrentTimeIn24HourFormat(new Date(val.UPDATED_ON))}
                        {/* ,{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Contact No:
                        </span>{" "}
                        {val.MOBILE} */}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 15,
                          p: 1,
                          color: "#000",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Status :{" "}
                        </span>
                        {val.TICKET_ACTION && (
                          <>
                            {constants.ticketAction[Number(val.TICKET_ACTION)]}
                          </>
                        )}
                        {!val.TICKET_ACTION && (
                          <>
                            {
                              constants.statusFlag.find((item) => {
                                return item.flag == Number(val.STATUS);
                              })?.status
                            }
                          </>
                        )}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 15,
                          p: 1,
                          color: "#000",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Posted by:{" "}
                        </span>
                        {val.UPDATED_BY_NAME}
                      </Typography>
                    </div>

                    {val?.FILE_NAME?.map((file) => {
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              border: "1px solid #f0f0f0",
                              backgroundColor: "#fff",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 15,
                                p: 1,
                                color: "#000",
                                maxWidth: "800px",
                                wordWrap: "break-word",
                              }}
                              onClick={() => {
                                handleDownload(file.FILE_NAME);
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                File Name:{" "}
                              </span>
                              <span
                                style={{
                                  color: "#0678c9",
                                  cursor: "pointer",
                                }}
                              >
                                {file.FILE_NAME1}
                              </span>
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 15,
                                p: 1,
                                color: "#000",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                }}
                              >
                                File Type:{" "}
                              </span>
                              {file.FILE_TYPE}
                            </Typography>
                          </div>
                        </>
                      );
                    })}

                    <div
                      style={{
                        // display: "flex",
                        // justifyContent: "space-between",
                        border: "1px solid #f0f0f0",
                        backgroundColor: "#fff",
                        // minHeight: 200,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15,
                          p: 1,
                          color: "#000",
                          maxWidth: "800px",
                          wordWrap: "break-word",
                          fontWeight: "bold",
                        }}
                      >
                        Description:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 15,
                          px: 1,
                          paddingBottom: 1,
                          color: "#000",
                          maxWidth: "800px",
                          wordWrap: "break-word",
                          minHeight: "20%",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: val.REMARKS }}
                        />
                      </Typography>
                    </div>
                    {index < timeline?.length - 1 && (
                      <div
                        style={{
                          width: "99%",
                          height: 5,
                          // backgroundColor: "#2d344b",
                        }}
                        className="ticket-details-headers"
                      />
                    )}
                  </div>
                </>
              );
            })}
          </>
          {/* -----timeline ends-------- */}
        </div>
        {/* {props.LOGGED_IN_DATA.USER_TYPE == 2 ||
          (props.LOGGED_IN_DATA.USER_TYPE == 1 && ( */}
        {/* ------------------- */}

        {(((thisTicket?.ROLE?.includes(2) ||
          thisTicket?.ROLE?.includes(1) ||
          thisTicket?.ROLE?.includes(7)) &&
          // ||
          // (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
          //   thisTicket?.ROLE?.includes(3))
          // && (thisTicket.TR_APPROVAL == true || thisTicket.TR_APPROVED == 0)
          thisTicket.FLAG != 10) ||
          trEmpFlag == true ||
          thisTicket?.CREATED_BY == props?.LOGGED_IN_DATA?.USER_ID ||
          thisTicket?.DELEGATE_CREATED_BY == props?.LOGGED_IN_DATA?.USER_ID ||
          (thisTicket.ROLE.includes(3) &&
            thisTicket.TR_APPROVAL == true &&
            thisTicket.TR_APPROVED == 0)) && (
          // &&((approverData.APPROVER1==props.LOGGED_IN_DATA.USER_ID && thisTicket.APPROVAL1 ==undefined)||(approverData.APPROVER2==props.LOGGED_IN_DATA.USER_ID && thisTicket.APPROVAL2==undefined))
          <>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 15,
                p: 0.5,
                color: "#fff",
                // backgroundColor: "#2d344b",
              }}
              className="ticket-details-headers"
            >
              Reply :
            </Typography>
            <div className="child-container-2">
              <div className="left-child-container-2">
                <JoditEditorCustom
                  // ref={(el) => (editorRef = el)}
                  // style={{ height: "29.2vh" }}
                  // theme="snow"
                  // theme={"bubble"}
                  // value={value}
                  // onChange={setValue}
                  height={200}
                  value={timeLineData.REMARKS}
                  onChange={handleEditorChange}
                />
              </div>
              <div
                style={{ border: "1px solid #dddee2" }}
                className="right-child-container-2"
              >
                <div className="mb-3">
                  <label
                    style={{ fontWeight: "bold", fontSize: "20px" }}
                    htmlFor="basicpill-email-input4"
                  >
                    Upload File
                  </label>
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
                    Attach File
                  </label>
                  <input
                    type="file"
                    name="upload"
                    className="form-control"
                    hidden={true}
                    multiple
                    id="upload"
                    onChange={(e) => {
                      const fileList = e.target.files;
                      const fileArray = Array.from(fileList);
                      setSelectedFiles((prevState) => [
                        ...prevState,
                        ...fileArray,
                      ]);
                    }}
                  />
                </div>
                <div className="mb-3 row">
                  {/* <div className="col-md-7" style={{ width: "45%" }}>
                    {" "}
                    <button
                      style={
                        {
                          // border: "1px dotted #219bcc",
                          // color: "#219bcc",
                        }
                      }
                      className="mx-2 button signup-button"
                      // className=""
                      onClick={handleAddFiles}
                    >
                      Upload File
                    </button>
                  </div> */}
                  <div className="col-md-5" style={{ width: "50%" }}>
                    <p style={{ fontWeight: "bold", marginBottom: "0px" }}>
                      Selected Files:
                    </p>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li style={{ fontSize: "80%" }} key={index}>
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
                                const fileURL = URL.createObjectURL(file);
                                const newTab = window.open(fileURL, "_blank");
                                setTimeout(
                                  () => URL.revokeObjectURL(fileURL),
                                  20000
                                );
                              }}
                            >
                              {file.name}
                            </span>
                            <span
                              style={{
                                marginLeft: "5px",
                                cursor: "pointer",
                                fontSize: "70%",
                              }}
                              onClick={() => handleDeleteFile(index)}
                            >
                              ❌
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* --------------- */}
        {/* ))} */}

        <div className="child-container-3">
          {/* {props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
            props.LOGGED_IN_DATA.USER_TYPE == 1 && (
              <>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 15,
                    p: 0.5,
                    color: "#fff",
                    backgroundColor: "#2d344b",
                  }}
                >
                  Technician Suggestions:
                </Typography>
                <Input
                  type="textarea"
                  className="form-control"
                  id="basicpill-email-input4"
                  placeholder="Enter Suggestions"
                />
              </>
            )} */}
          {
            // thisTicket.REQUEST != 1 &&
            thisTicket.FLAG != 0 &&
              props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
              (thisTicket?.ROLE?.includes(1) ||
                thisTicket?.ROLE?.includes(7)) &&
              thisTicket?.APPROVAL2 != true && (
                <div>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 15,
                      p: 0.5,
                      color: "#fff",
                      // backgroundColor: "#2d344b",
                    }}
                    className="ticket-details-headers"
                  >
                    Efforts Approval:{" "}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      marginTop: "1%",
                      padding: "1%",
                    }}
                  >
                    <div className="col-md-4 mx-2">
                      <Label for="basicpill-email-input4">Effort</Label>
                      <Input
                        type="number"
                        name="EFFORT"
                        className="form-control"
                        id="basicpill-email-input4"
                        placeholder="Enter effort"
                        value={effortsData}
                        onChange={(e) => {
                          setEffortsData(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-md-4 mx-2">
                      <Label for="basicpill-email-input4">Unit</Label>
                      <Input
                        type="select"
                        name="UNIT"
                        className="form-control"
                        id="basicpill-email-input4"
                        value={effortUnit}
                        onChange={(e) => {
                          setEffortUnit(e.target.value);
                        }}
                      >
                        <option value="select">Select</option>
                        <option value="Days">Days</option>
                        <option value="Hours">Hours</option>
                        <option value="Minutes">Minutes</option>
                      </Input>
                    </div>
                    <div
                      style={{
                        justifyContent: "flex-end",
                        display: "flex",
                        marginBottom: "50px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        style={{ backgroundColor: "#219bcc", marginTop: 15 }}
                        className="button"
                        onClick={HandleEffortsSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "99%",
                      height: 5,
                      // backgroundColor: "#2d344b",
                    }}
                    className="ticket-details-headers"
                  />
                </div>
              )
          }
          {/* {thisTicket.REQUEST != 1 &&
            props.LOGGED_IN_DATA.USER_TYPE == 2 &&
            thisTicket.APPROVAL1 == true &&
            this.STATUS == 7 && (
              <div>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 17,
                    p: 1,
                    color: "#fff",
                    backgroundColor: "#2d344b",
                  }}
                >
                  Efforts:{" "}
                </Typography>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{ backgroundColor: "#fff", width: "99%" }}
                    className="col-md-4 mx-2"
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 17,
                        p: 1,
                        color: "#000",
                      }}
                    >
                      Efforts:{thisTicket?.EFFORTS}
                    </Typography>
                  </div>
                </div>
              </div>
            )} */}
          {thisTicket.EFFORTS != undefined && (
            <>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  p: 0.5,
                  color: "#fff",
                  // backgroundColor: "#2d344b",
                }}
                className="ticket-details-headers"
              >
                Effort Submitted :
              </Typography>
              <div
                // style={{ }}
                style={{
                  marginBottom: 10,

                  border: "1px solid #f0f0f0",
                  backgroundColor: "#fff",
                  padding: 15,
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Efforts:{" "}
                </span>
                {thisTicket.EFFORTS}
              </div>
            </>
          )}

          {
            // (thisTicket?.ROLE?.includes(2) || thisTicket?.ROLE?.includes(1)) &&
            // ||
            // (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
            //   thisTicket?.ROLE?.includes(3))
            (thisTicket.FLAG != 10 ||
              thisTicket?.CREATED_BY == props?.LOGGED_IN_DATA?.USER_ID ||
              thisTicket?.DELEGATE_CREATED_BY ==
                props?.LOGGED_IN_DATA?.USER_ID ||
              (thisTicket.ROLE.includes(3) &&
                thisTicket.TR_APPROVAL == true &&
                thisTicket.TR_APPROVED == 0)) && (
              // &&((approverData.APPROVER1==props.LOGGED_IN_DATA.USER_ID && thisTicket.APPROVAL1 ==undefined)||(approverData.APPROVER2==props.LOGGED_IN_DATA.USER_ID && thisTicket.APPROVAL2==undefined))
              <div
                style={{
                  backgroundColor: "#fff",
                  margin: "1px",
                  // height: "20vh",
                  padding: "1.5%",
                }}
              >
                <div className="row my-3">
                  {(((thisTicket?.ROLE?.includes(2) ||
                    thisTicket?.ROLE?.includes(1) ||
                    thisTicket?.ROLE?.includes(7)) &&
                    // ||
                    // (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                    //   thisTicket?.ROLE?.includes(3))
                    thisTicket.FLAG != 10) ||
                    thisTicket?.CREATED_BY == props?.LOGGED_IN_DATA?.USER_ID ||
                    thisTicket?.DELEGATE_CREATED_BY ==
                      props?.LOGGED_IN_DATA?.USER_ID ||
                    (thisTicket.ROLE.includes(3) &&
                      thisTicket.TR_APPROVAL == true &&
                      thisTicket.TR_APPROVED == 0)) && (
                    <div className="col-md-4">
                      <Label
                        for="basicpill-email-input4"
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
                      <Input
                        type="text"
                        name="EMAIL"
                        className="form-control"
                        id="basicpill-email-input4"
                        placeholder="Enter CC Mail Address"
                        value={timeLineData.CC_EMAIL}
                        onChange={(e) => {
                          let temp = { ...timeLineData };
                          temp.CC_EMAIL = e.target.value;
                          setTimeLineData(temp);
                        }}
                      />
                    </div>
                  )}
                  {props.LOGGED_IN_DATA?.LOGGED_IN_AS == "EMPLOYEE" &&
                    !(
                      thisTicket.ROLE.includes(3) &&
                      thisTicket.TR_APPROVAL == true &&
                      thisTicket.TR_APPROVED == 0
                    ) && (
                      <>
                        {![0, 3, 7, 8].includes(Number(thisTicket.FLAG)) &&
                          !thisTicket.ROLE.includes(3) &&
                          !thisTicket.ROLE.includes(0) && (
                            <div className="col-md-4">
                              <Label for="basicpill-email-input4">Status</Label>
                              <Select
                                value={timeLineData?.STATUS}
                                // options={statusOptions}
                                options={statusOptions}
                                onChange={(e) => {
                                  let temp = { ...timeLineData };
                                  temp.STATUS = e;
                                  setTimeLineData(temp);
                                }}
                              />
                            </div>
                          )}
                        {props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                          (thisTicket.ROLE.includes(0) ||
                            thisTicket.ROLE.includes(1) ||
                            thisTicket?.ROLE?.includes(7) ||
                            thisTicket.ROLE.includes(3)) && (
                            <div className="col-md-4">
                              {/* ----------------------------- */}

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Label
                                  for="basicpill-email-input4"
                                  style={{
                                    minWidth: 100,
                                  }}
                                >
                                  Assign To
                                </Label>
                                <div
                                  className="row"
                                  style={{
                                    width: 250,
                                  }}
                                >
                                  <div
                                    className="d-flex"
                                    id="select1"
                                    style={{
                                      justifyContent: "space-around",
                                      width: 500,
                                    }}
                                  >
                                    <div
                                      className="form-check col-md-1"
                                      id="ServiceRequest"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="statusOfFeed"
                                        id="status1"
                                        value={4}
                                        checked={
                                          selectedProjectType == "4"
                                            ? true
                                            : false
                                        }
                                        onChange={handleSelectedProjectType}
                                      />
                                      <label
                                        className="form-check-label"
                                        style={{
                                          fontSize: 13,
                                          color: "#405D72",
                                        }}
                                        htmlFor="status1"
                                      >
                                        Module
                                      </label>
                                    </div>

                                    <div
                                      className="form-check col-md-1"
                                      id="ServiceRequest"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="statusOfFeed"
                                        id="status1"
                                        value={2}
                                        checked={
                                          selectedProjectType == "2"
                                            ? true
                                            : false
                                        }
                                        onChange={handleSelectedProjectType}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="status1"
                                        style={{
                                          fontSize: 13,
                                          color: "#405D72",
                                        }}
                                      >
                                        Project
                                      </label>
                                    </div>
                                    <div
                                      className="form-check col-md-1"
                                      id="ServiceRequest"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="statusOfFeed"
                                        id="status1"
                                        value={1}
                                        checked={
                                          selectedProjectType == "1"
                                            ? true
                                            : false
                                        }
                                        onChange={handleSelectedProjectType}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="status1"
                                        style={{
                                          fontSize: 13,
                                          color: "#405D72",
                                        }}
                                      >
                                        All
                                      </label>
                                    </div>
                                  </div>
                                  {/* <div className="form-check" id="ServiceRequest">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="statusOfFeed"
                          id="status1"
                          value={3}
                          checked={selectedProjectType == "3" ? true : false}
                          onChange={handleSelectedProjectType}
                        />
                        <label className="form-check-label" htmlFor="status1">
                          By SubCategory
                        </label>
                      </div> */}
                                </div>
                                {selectedProjectType == "3" && (
                                  <Select
                                    options={subCategoryData}
                                    value={subCategoryData.find(
                                      (val) =>
                                        val.value == selectedProjectSubCategory
                                    )}
                                    onChange={(e) => {
                                      // setSelectedSubCat(e.value);
                                      setSelectedProjectSubCategory(e.value);
                                      getAllEmpBySubCatList(e.value);
                                      // setFormData((prev) => ({
                                      //   ...prev,
                                      //   SUB_CATEGORY: e.value,
                                      // }));
                                      // setFormDataErrorFlag((prev) => ({
                                      //   ...prev,
                                      //   ITEMS: false,
                                      // }));
                                      // let tempItems = [...allItems];
                                      // let filteredItems = tempItems.filter(
                                      //   (val) =>
                                      //     val.CATEGORY == formData.CATEGORY_ID &&
                                      //     val.SUB_CATEGORY == e.value
                                      // );

                                      // setItemOptions(filteredItems);
                                      // let filteredTech = allMappedTech.filter(
                                      //   (val) =>
                                      //     val.CLIENT_ID == formData.CLIENT_ID &&
                                      //     val.CATEGORY_ID == formData.CATEGORY_ID &&
                                      //     val.SUB_CATEGORY_ID == e.value
                                      // );
                                      // if (filteredTech.length == 0) {
                                      //   setTechMappedFlag(false);
                                      // } else {
                                      //   setTechMappedFlag(true);
                                      // }
                                    }}
                                  />
                                )}
                              </div>

                              {/* --------------------- */}

                              <Select
                                value={timeLineData?.ASSIGNED_TO}
                                options={technicians}
                                onChange={(e) => {
                                  let temp = { ...timeLineData };
                                  temp.ASSIGNED_TO = e;
                                  setTimeLineData(temp);
                                }}
                              />
                            </div>
                          )}
                      </>
                    )}
                </div>
              </div>
            )
          }
          <br />
          <div style={{ marginRight: "5px" }} className="row inner_div">
            {props.LOGGED_IN_DATA?.LOGGED_IN_AS == "EMPLOYEE" &&
              thisTicket?.FLAG == 0 &&
              (thisTicket?.ROLE?.includes(1) ||
                thisTicket?.ROLE?.includes(7)) && (
                <button
                  style={{ backgroundColor: "#219bcc" }}
                  className="mx-2 col-1 button"
                  onClick={handlePickup}
                >
                  Pickup
                </button>
              )}
            {props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER" &&
              thisTicket.CREATED_BY_TYPE == "USER" &&
              thisTicket?.ROLE?.includes(2) &&
              (thisTicket.FLAG == 8 || thisTicket.FLAG == 7) && (
                <>
                  <button
                    style={{ backgroundColor: "green" }}
                    className="mx-2 col-1 button"
                    onClick={ticketApproval}
                  >
                    Approve
                  </button>
                  <button
                    style={{ backgroundColor: "red" }}
                    className="mx-2 col-1 button"
                    onClick={rejectTicket}
                  >
                    Reject
                  </button>
                </>
              )}
            {props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
              thisTicket.CREATED_BY_TYPE == "EMPLOYEE" &&
              thisTicket?.ROLE?.includes(3) &&
              thisClient?.PROJECT_MANAGER == props.LOGGED_IN_DATA.USER_ID &&
              (thisTicket.FLAG == 8 || thisTicket.FLAG == 7) && (
                <>
                  <button
                    style={{ backgroundColor: "green" }}
                    className="mx-2 col-1 button"
                    onClick={ticketApproval}
                  >
                    Approve
                  </button>
                  <button
                    style={{ backgroundColor: "red" }}
                    className="mx-2 col-1 button"
                    onClick={rejectTicket}
                  >
                    Reject
                  </button>
                </>
              )}
            {/* {thisTicket?.ROLE?.includes(2) &&
              (thisTicket.FLAG == 8 || thisTicket.FLAG == 7) && (
                <button
                  style={{ backgroundColor: "green" }}
                  className="mx-2 col-1 button"
                  onClick={ticketApproval}
                >
                  Approve
                </button>
              )}
            {thisTicket?.ROLE?.includes(2) &&
              (thisTicket.FLAG == 8 || thisTicket.FLAG == 7) && (
                <button
                  style={{ backgroundColor: "red" }}
                  className="mx-2 col-1 button"
                  onClick={rejectTicket}
                >
                  Reject
                </button>
              )} */}
            {/* ----------------- */}
            {
              // props.LOGGED_IN_DATA?.LOGGED_IN_AS == "USER" &&
              (thisTicket.CREATED_BY == props.LOGGED_IN_DATA?.USER_ID ||
                thisTicket.DELEGATE_CREATED_BY ==
                  props.LOGGED_IN_DATA?.USER_ID) &&
                thisTicket.FLAG != 4 &&
                thisTicket.FLAG != 10 && (
                  <button
                    style={{ backgroundColor: "red" }}
                    className="mx-2 col-2 button"
                    onClick={() => {
                      handleCloseModalOpen();
                    }}
                  >
                    Close Ticket
                  </button>
                )
            }
            {((!(
              props.LOGGED_IN_DATA.LOGGED_IN_AS == "USER" &&
              thisTicket.APPROVAL2 == true
            ) &&
              (thisTicket?.ROLE?.includes(2) ||
                (props.LOGGED_IN_DATA?.LOGGED_IN_AS == "EMPLOYEE" &&
                  !thisTicket?.ROLE?.includes(2))) &&
              // props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
              // thisTicket?.ROLE?.includes(3) &&
              thisTicket.FLAG != 0 &&
              thisTicket.FLAG != 4 &&
              thisTicket.FLAG != 10) ||
              ((thisTicket?.CREATED_BY == props?.LOGGED_IN_DATA?.USER_ID ||
                thisTicket.DELEGATE_CREATED_BY ==
                  props.LOGGED_IN_DATA?.USER_ID) &&
                thisTicket.FLAG != 4 &&
                thisTicket.FLAG != 10)) && (
              <button
                style={{ backgroundColor: "#219bcc" }}
                className="mx-2 col-1 button"
                onClick={() => {
                  handleTimelineSubmit(
                    timeLineData.STATUS.label,
                    timeLineData.STATUS.value
                  );
                }}
              >
                Submit
              </button>
            )}

            {/* TR buttons for manager */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              {((props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                thisTicket?.ROLE?.includes(3) &&
                thisClient.PROJECT_MANAGER == props.LOGGED_IN_DATA.USER_ID &&
                thisTicket.TR_APPROVAL == true &&
                thisTicket.TR_APPROVED == 0) ||
                (thisTicket.TR_APPROVED != 2 &&
                  props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                  (thisTicket?.ROLE?.includes(1) ||
                    thisTicket?.ROLE?.includes(7) ||
                    thisTicket?.ROLE?.includes(3)) &&
                  thisTicket.TR_APPROVAL == true) ||
                (trEmpFlag == true &&
                  thisTicket.FLAG == 1 &&
                  thisTicket.TR_APPROVAL == true &&
                  (thisTicket.TR_APPROVED != 0 ||
                    thisTicket.TR_APPROVED != undefined)) ||
                (props.LOGGED_IN_DATA?.LOGGED_IN_AS == "EMPLOYEE" &&
                  (thisTicket?.ROLE?.includes(1) ||
                    thisTicket?.ROLE?.includes(7)) &&
                  (thisTicket.TR_APPROVAL != true ||
                    thisTicket.TR_APPROVED == 2)) ||
                (props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                  thisTicket?.ROLE?.includes(3) &&
                  thisClient.PROJECT_MANAGER == props.LOGGED_IN_DATA.USER_ID &&
                  thisTicket.TR_APPROVAL == true &&
                  thisTicket.TR_APPROVED == 0)) &&
                thisTicket.FLAG != 0 && (
                  <Card
                    sx={{
                      // display:"flex",
                      // justifyContent:"end"
                      minWidth: 400,
                      maxWidth: 400,
                      p: 3,
                      m: 2,
                    }}
                  >
                    {props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                      thisTicket?.ROLE?.includes(3) &&
                      thisClient.PROJECT_MANAGER ==
                        props.LOGGED_IN_DATA.USER_ID &&
                      thisTicket.TR_APPROVAL == true &&
                      thisTicket.TR_APPROVED == 0 && (
                        <Typography
                          style={{
                            // textAlign: "end",
                            fontWeight: 500,
                            fontSize: 18,
                            marginLeft: 7,
                          }}
                          // className="mx-2 col-1 button"
                          onClick={() => {}}
                        >
                          TR Movement:
                        </Typography>
                      )}

                    {props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                      (thisTicket?.ROLE?.includes(1) ||
                        thisTicket?.ROLE?.includes(7) ||
                        thisTicket?.ROLE?.includes(3) ||
                        trEmpFlag == true) &&
                      thisTicket.TR_APPROVAL == true &&
                      thisTicket.TR_SUBMITTED == true && (
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            p: 0.5,
                            color: "#fff",
                            backgroundColor: "green",
                          }}
                        >
                          TR Movement Submitted
                        </Typography>
                      )}
                    {thisTicket.TR_APPROVED != 2 &&
                      props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                      (thisTicket?.ROLE?.includes(1) ||
                        thisTicket?.ROLE?.includes(7) ||
                        thisTicket?.ROLE?.includes(3)) &&
                      thisTicket.TR_APPROVAL == true &&
                      thisTicket.TR_SUBMITTED != true && (
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            p: 0.5,
                            color: "#fff",
                            backgroundColor: "green",
                          }}
                        >
                          TR Movement Initiated
                        </Typography>
                      )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      {/* tr submit for consultant */}
                      {trEmpFlag == true &&
                        thisTicket.FLAG == 1 &&
                        thisTicket.TR_APPROVAL == true &&
                        (thisTicket.TR_APPROVED != 0 ||
                          thisTicket.TR_APPROVED != undefined) && (
                          <div>
                            <Typography
                              style={{
                                // textAlign: "end",
                                fontWeight: 500,
                                fontSize: 18,
                                marginLeft: 7,
                              }}
                              // className="mx-2 col-1 button"
                              onClick={() => {}}
                            >
                              TR Movement:
                            </Typography>
                            <button
                              style={{ backgroundColor: "#219bcc" }}
                              className="mx-2 button"
                              onClick={trSubmitHandler}
                            >
                              Submit TR
                            </button>
                          </div>
                        )}
                      {props.LOGGED_IN_DATA?.LOGGED_IN_AS == "EMPLOYEE" &&
                        (thisTicket?.ROLE?.includes(1) ||
                          thisTicket?.ROLE?.includes(7)) &&
                        thisTicket.TR_APPROVAL != true && (
                          // (thisTicket.TR_APPROVED == 2 ||
                          //   thisTicket.TR_APPROVED == 1)
                          <div>
                            <Typography
                              style={{
                                // textAlign: "end",
                                fontWeight: 500,
                                fontSize: 18,
                                marginLeft: 7,
                              }}
                              // className="mx-2 col-1 button"
                              onClick={() => {}}
                            >
                              TR Movement:
                            </Typography>
                            <button
                              style={{ backgroundColor: "#219bcc" }}
                              className="button"
                              onClick={initiateTR}
                            >
                              Initiate TR Movement
                            </button>
                          </div>
                        )}
                      {props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                        thisTicket?.ROLE?.includes(3) &&
                        thisClient.PROJECT_MANAGER ==
                          props.LOGGED_IN_DATA.USER_ID &&
                        thisTicket.TR_APPROVAL == true &&
                        thisTicket.TR_APPROVED == 0 && (
                          <button
                            style={{ backgroundColor: "#219bcc" }}
                            className="button"
                            onClick={() => handleTrApproval(1)}
                          >
                            Approve
                          </button>
                        )}
                      {props.LOGGED_IN_DATA.LOGGED_IN_AS == "EMPLOYEE" &&
                        thisTicket?.ROLE?.includes(3) &&
                        thisClient.PROJECT_MANAGER ==
                          props.LOGGED_IN_DATA.USER_ID &&
                        thisTicket.TR_APPROVAL == true &&
                        thisTicket.TR_APPROVED == 0 && (
                          <button
                            style={{ backgroundColor: "#219bcc" }}
                            className="button"
                            onClick={() => handleTrApproval(2)}
                          >
                            Return to Requestor
                          </button>
                        )}
                    </div>
                  </Card>
                )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={closeModalOpen}
        onClose={handleCloseModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Confirmation</h4>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleCloseModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <Label>Are you sure you want to close the ticket?</Label>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="text"
              sx={{ mt: 1, mr: 2 }}
              onClick={(e) => {
                handleCloseModalClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={(e) => {
                handleTimelineSubmit("CLOSED", 4);
              }}
            >
              Okay
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={editDetailsModalOpen}
        onClose={handleEditDetailsModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Edit Details</h4>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleEditDetailsModalClose}
            />
          </div>
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
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          {/* <Label>Are you sure you want to close the ticket?</Label> */}
          <label className="modal-label">Sub Category </label>
          <Select
            options={subCategoryData}
            value={subCategoryData.find(
              (val) => val.value == formData.SUB_CATEGORY
            )}
            onChange={(e) => {
              // setSelectedSubCat(e.value);
              setFormData((prev) => ({
                ...prev,
                SUB_CATEGORY: e.value,
              }));
              setFormDataErrorFlag((prev) => ({
                ...prev,
                ITEMS: false,
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
                  val.CATEGORY_ID == formData.CATEGORY_ID &&
                  val.SUB_CATEGORY_ID == e.value
              );
              if (filteredTech.length == 0) {
                setTechMappedFlag(false);
              } else {
                setTechMappedFlag(true);
              }
            }}
          />
          {/* <label className="modal-label">Item </label>
          <Select
            id={"selectItem2"}
            options={itemOptions}
            value={allItems.find((val) => val.value == formData.ITEMS)}
            onChange={(e) => {
              // setSelectedSubCat(e.value);
              setFormData((prev) => ({
                ...prev,
                ITEMS: e.value,
              }));
              setFormDataErrorFlag((prev) => ({
                ...prev,
                ITEMS: false,
              }));
            }}
          /> */}

          <div className="row">
            <div className="col-md-10">
              {/* Your form fields */}
              <div
                className="form-group"
                style={{
                  marginTop: 15,
                }}
              >
                <label className="modal-label">Type Of Requirement </label>
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-around" }}
                >
                  <div className="form-check mr-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="statusOfFeed"
                      id="status1"
                      value={1}
                      checked={selectedOption == "1" ? true : false}
                      onChange={handleOptionChange}
                    />
                    <label className="form-check-label" htmlFor="status1">
                      Service Request
                    </label>
                  </div>
                  <div className="form-check mr-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="statusOfFeed"
                      id="status2"
                      value={2}
                      checked={selectedOption == "2" ? true : false}
                      onChange={handleOptionChange}
                    />
                    <label className="form-check-label" htmlFor="status2">
                      New Requirement
                    </label>
                  </div>
                  <div className="form-check mr-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="statusOfFeed"
                      id="status3"
                      value={3}
                      checked={selectedOption == "3" ? true : false}
                      onChange={handleOptionChange}
                    />
                    <label className="form-check-label" htmlFor="status3">
                      Change Requirement
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {renderAdditionalFields()}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="text"
              sx={{ mt: 1, mr: 2 }}
              onClick={(e) => {
                handleEditDetailsModalClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={(e) => {
                updateTicketDetails();
              }}
            >
              Update
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={RemarksAddModalOpen}
        onClose={handleRemarksAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Reason</h4>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleRemarksAddModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <CustomInput
            type="textarea"
            className="form-control"
            id="basicpill-email-input4"
            placeholder="Enter Reason"
            value={thisTicket.TARGET_DATE_REASON}
            onChange={(e) =>
              setThisTicket((prev) => ({
                ...prev,
                TARGET_DATE_REASON: e.target.value,
              }))
            }
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="text"
              sx={{ mt: 1, mr: 2 }}
              onClick={(e) => {
                handleRemarksAddModalClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={(e) => {
                if (
                  thisTicket.TARGET_DATE_REASON != undefined &&
                  thisTicket.TARGET_DATE_REASON != ""
                ) {
                  updateTargetDate();
                  handleRemarksAddModalClose();
                } else {
                  cogoToast.error("Enter reason to change the target date");
                }
              }}
            >
              Okay
            </Button>
          </div>
        </Box>
      </Modal>
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
          <p
            style={{
              fontSize: 18,
              color: "red",
              marginLeft: 10,
            }}
          >
            Approver not assigned for this customer, category, sub-category
          </p>
        </Box>
      </Modal>
    </MainScreen>
  );
}

// export default TicketDetails;

const mapStateToProps = (state) => ({
  categoryData: state.categoryData.category,
  subCategoryData: state.categoryData.subCategory,
  // authData: state.loginData.clientLogin,
  LOGGED_IN_DATA: state.loginData.clientLogin,
});

export default connect(mapStateToProps, {})(TicketDetails);
