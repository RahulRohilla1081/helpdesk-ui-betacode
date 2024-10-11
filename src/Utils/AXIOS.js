// const defaultPort = "http://localhost:7001/"; //dev
const defaultPort = "https://pdhanewala.com:7001/"; //prod
const imageUrl = "Support_Portal_api/images/";
const clientLogin = "Support_Portal_api/login/login";
const empLogin = "Support_Portal_api/login/empLogin?EMP_ID=";
const getAllCategory = "Support_Portal_api/Category/getAllCategory";
const getSubCategory = "Support_Portal_api/Category/getCategory?categoryId=";
const getTicketCountByFlag = "Support_Portal_api/Ticket/getTicketCountByFlag";
const getAllTicket = "Support_Portal_api/Ticket/getAllTicket";
const getTicketDataByFlag =
  "Support_Portal_api/Ticket/getTicketDataByFlag?FLAG=";
const createTicket = "Support_Portal_api/Ticket/createTicket";
const forgetPassword = "Support_Portal_api/forgetPassword/forgetPassword";
const forgetPasswordEmp = "Support_Portal_api/forgetPassword/forgetPasswordEmp";
const verifyOtpEmp = "Support_Portal_api/forgetPassword/verifyOtpEmp";
const verifyOtp = "Support_Portal_api/forgetPassword/verifyOtp";
const changePassword = "Support_Portal_api/forgetPassword/changePassword";
const changePasswordEmp = "Support_Portal_api/forgetPassword/changePasswordEmp";
const getAllUser = "Support_Portal_api/UserMaster/getAllUser";
const updateCategory = "Support_Portal_api/Category/updateCategory";
const createCategory = "Support_Portal_api/Category/createCategory";
const updateSub_Category = "Support_Portal_api/Sub_Category/updateSub_Category";
const createSub_Category = "Support_Portal_api/Sub_Category/createSub_Category";
const getAllClient = "Support_Portal_api/ClientData/getAllClient";
const updateClient = "Support_Portal_api/ClientData/updateClient";
const createClient = "Support_Portal_api/ClientData/createClient";
const technicianMapping = "Support_Portal_api/Technician/createTechnician";
const createUser = "Support_Portal_api/UserMaster/createUser";
const updateUser = "Support_Portal_api/UserMaster/updateUser";
const deleteUser = "Support_Portal_api/UserMaster/deleteUser";
// const getApprover = "Support_Portal_api/ClientData/getApprover?id=";
const getApprover = "Support_Portal_api/ApproverMaster/getApprover?id=";

// const addApprover = "Support_Portal_api/ClientData/addApprover";
const addApprover = "Support_Portal_api/ApproverMaster/createApproverMaster";
const getAllEmployess = "Support_Portal_api/Samishti/getAllEmployees";
const getAllTechnician = "Support_Portal_api/Technician/getAllTechnician";
const getTicketbyCreatedBy =
  "Support_Portal_api/Ticket/getTicketbyCreatedBy?CREATED_BY=";
const getEmpData = "Support_Portal_api/Samishti/getEmpData?EMP_ID=";
const getTechnician = "Support_Portal_api/Technician/getTechnician?id=";
const getTimeline = "Support_Portal_api/Timeline/getTimeline?id=";
const getUser = "Support_Portal_api/UserMaster/getUser?id=";
const clientData = "Support_Portal_api/ClientData/clientData?CLIENT_ID=";
const createTimeline = "Support_Portal_api/Timeline/createTimeline";
const updateTicketById =
  "Support_Portal_api/Ticket/updateTicket_byTicketId?id=";
const getClientByPM = "Support_Portal_api/ClientData/getClientByPM?id=";
const getTicketForTechnician =
  "Support_Portal_api/Technician/getTicketForTechnician?id=";
const getTicketsForManager =
  "Support_Portal_api/ClientData/getTicketsForManager?id=";
const getTicketsForApprover =
  "Support_Portal_api/ClientData/getTicketsForApprover?approverId=";
const addPm = "Support_Portal_api/ClientData/addPm";
const deleteTicket = "Support_Portal_api/Ticket/deleteTicket?id=";
const getTicketById = "Support_Portal_api/Ticket/getTicketById?id=";
const ticketPickup = "Support_Portal_api/Ticket/ticketPickup";
const getProjectClient = "Support_Portal_api/ClientData/getClient?id=";
const getEmployeesByPM = "Support_Portal_api/Samishti/getEmployeesByPM?id=";
const createItem = "Support_Portal_api/Item/createItem";
const getItem = "Support_Portal_api/Item/getItem";
const updateItem = "Support_Portal_api/Item/updateItem?id=";
const deleteTechnicianMP =
  "Support_Portal_api/TechnicianMapping/deleteTechnicianMP?eId=";
const deleteItem = "Support_Portal_api/Item/deleteItem?id=";
const createTechnicianMap =
  "Support_Portal_api/TechnicianMapping/createTechnicianMap";
const getClientDataByPM = "Support_Portal_api/ClientData/getClientDataByPM?id=";
const getTechinicianByCatSubCat =
  "Support_Portal_api/Technician/getTechinicianByCatSubCat?CATEGORY_ID=";

const deleteTechnician = "Support_Portal_api/Technician/deleteTechnician";
const getAssignToDd = "Support_Portal_api/TechnicianMapping/getAssignToDd";
const mailToApproval = "Support_Portal_api/Ticket/mailToApproval";
const mailToConsultant = "Support_Portal_api/Ticket/mailToConsultant";
const getTechnicianMap =
  "Support_Portal_api/TechnicianMapping/getTechnicianMap?EMP_ID=";
const getTicketByClientAdmin =
  "Support_Portal_api/Ticket/getTicketbyClient?CLIENT_ID=";
const getUserByUid_Cid =
  "Support_Portal_api/UserMaster/getUserByUid_Cid?USER_ID=";
const getUserForPm = "Support_Portal_api/UserMaster/getUserForPm?USER_ID=";
const getTechnicianForClient =
  "Support_Portal_api/TechnicianMapping/getTechnicianForClient?CLIENT_ID=";
const SamishtiRespondToCustomerMail =
  "Support_Portal_api/Ticket/SamishtiRespondToCustomerMail";
const TicketAcknowledgementMail =
  "Support_Portal_api/Ticket/TicketAcknowledgementMail";
const getAllMappedTech =
  "Support_Portal_api/TechnicianMapping/getAllmappedTech";
const getTicketIdByReference =
  "Support_Portal_api/Ticket/getTicketIdByReference?ticketId=";
const getUserByClientId =
  "Support_Portal_api/UserMaster/getUserByClientId?CLIENT_ID=";
const getClientForTechnicianMap =
  "Support_Portal_api/TechnicianMapping/getClientForTechnicianMap?EMP_ID=";
const mailForTRApproved = "Support_Portal_api/Ticket/mailForTRApproved";
const mailForTRReturned = "Support_Portal_api/Ticket/mailForTRReturned";
const mailForTRApproval = "Support_Portal_api/Ticket/mailForTRApproval";
const mailForTRMoved = "Support_Portal_api/Ticket/mailForTRMoved";
const createTat = "Support_Portal_api/TatMaster/createTat";
const getAllTat = "Support_Portal_api/TatMaster/getAllTat";
const createTatMapping = "Support_Portal_api/TatMapping/createTatMapping";
const getAllTatMapping = "Support_Portal_api/TatMapping/getAllTatMapping";
const approvalReport = "Support_Portal_api/Ticket/approvalReport";
const ticketCloseMail = "Support_Portal_api/Ticket/ticketCloseMail";
const tktApproveMailsend = "Support_Portal_api/Ticket/tktApproveMailsend";
const effortsApprovedMailSend =
  "Support_Portal_api/Ticket/effortsApprovedMailSend";
const getDashboardTickets_emp =
  "Support_Portal_api/Ticket/getDashboardTickets?LOGIN_ID=";
const customerRespondToConsultantMail =
  "Support_Portal_api/Ticket/customerRespondToConsultantMail";
const getTicketbyClient =
  "Support_Portal_api/Ticket/getTicketbyClient?CLIENT_ID=";
const taskCreate = "Support_Portal_api/TaskMaster/taskCreate";
const updateTaskMaster = "Support_Portal_api/TaskMaster/updateTaskMaster";
const getAllTaskMaster =
  "Support_Portal_api/TaskMaster/getAllTaskMaster?employee_id=";
const createEmployee = "Support_Portal_api/Samishti/createEmployee";
const getEmployee = "Support_Portal_api/Samishti/getAllEmployees";
const updateEmployee = "Support_Portal_api/Samishti/updateEmployee";
const deleteEmployeeAndSave =
  "Support_Portal_api/Samishti/deleteEmployeeAndSave?EMP_ID=";
const getTicketByRole = "Support_Portal_api/Ticket/getTicketByRole?user_id=";
const getTicketRoles = "Support_Portal_api/Ticket/getTicketRoles?LOGIN_ID=";
const getDashboardTickets = "Support_Portal_api/Ticket/getDashboardTickets";
const smeRoleUpdate = "Support_Portal_api/Samishti/smeRoleUpdate";
const ticketStatusReport =
  "Support_Portal_api/Ticket/ticketStatusReport?CLIENT_ID=";

export default {
  defaultPort,
  clientLogin,
  empLogin,
  getAllCategory,
  getSubCategory,
  getTicketCountByFlag,
  getAllTicket,
  getTicketDataByFlag,
  createTicket,
  forgetPassword,
  verifyOtpEmp,
  changePassword,
  getAllUser,
  updateCategory,
  createCategory,
  updateSub_Category,
  createSub_Category,
  getAllClient,
  createClient,
  imageUrl,
  updateClient,
  technicianMapping,
  createUser,
  updateUser,
  deleteUser,
  getApprover,
  addApprover,
  getAllEmployess,
  getAllTechnician,
  getTicketbyCreatedBy,
  // getAllTechnician,
  getEmpData,
  getTechnician,
  clientData,
  getTimeline,
  getUser,
  createTimeline,
  updateTicketById,
  getClientByPM,
  getTicketForTechnician,
  getTicketsForManager,
  getTicketsForApprover,
  addPm,
  deleteTicket,
  getTicketById,
  ticketPickup,
  getProjectClient,
  getEmployeesByPM,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  createTechnicianMap,
  getClientDataByPM,
  deleteTechnicianMP,
  getTechinicianByCatSubCat,
  deleteTechnician,
  getTechnicianMap,
  getTicketByClientAdmin,
  getUserByUid_Cid,
  forgetPasswordEmp,
  changePasswordEmp,
  verifyOtp,
  getUserForPm,
  getClientForTechnicianMap,
  getUserByClientId,
  getAllMappedTech,
  getAssignToDd,
  mailToApproval,
  TicketAcknowledgementMail,
  mailToConsultant,
  SamishtiRespondToCustomerMail,
  getTechnicianForClient,
  mailForTRApproval,
  mailForTRApproved,
  mailForTRReturned,
  mailForTRReturned,
  mailForTRMoved,
  createTat,
  getAllTat,
  getAllTatMapping,
  createTatMapping,
  getTicketIdByReference,
  approvalReport,
  ticketCloseMail,
  customerRespondToConsultantMail,
  getTicketbyClient,
  getDashboardTickets_emp,
  tktApproveMailsend,
  effortsApprovedMailSend,
  taskCreate,
  updateTaskMaster,
  getAllTaskMaster,
  getTechinicianByCatSubCat,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployeeAndSave,
  getTicketByRole,
  getTicketRoles,
  getDashboardTickets,
  smeRoleUpdate,
  ticketStatusReport,
};
