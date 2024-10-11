// Samishti-	0: admin, 1: technical, 2: reviewer,3:Manager, 4:ITSM, 5:Observer,6:HR,7:SME
// Customer-	0: admin, 1: user, 2: reviewer
const statusFlag = [
  { flag: 0, value: "UNASSINED", status: "Unassigned" },
  {
    flag: 1,
    value: "PENDING FOR TR MOVEMENT",
    status: "Pending for TR Movement",
  },
  { flag: 2, value: "RESOLVED", status: "Resolved" },
  {
    flag: 3,
    value: "CLIENT APPROVAL AWAITED",
    status: "client Approval Pending",
  },
  { flag: 4, value: "CLOSED", status: "Closed" },
  {
    flag: 5,
    value: "UNDER PROCESS BY SAMISHTI",
    status: "Under Process by Samishti",
  },
  { flag: 6, value: "ON HOLD", status: "On Hold" },
  {
    flag: 7,
    value: "EFFORT APPROVAL AWAITED",
    status: "Effort Approval Pending",
  },
  { flag: 8, value: "PENDING FOR APPROVAL", status: "Pending for Approval" },
  { flag: 9, value: "TR APPROVAL PENDING", status: "TR Approval Pending" },
  { flag: 10, value: "TICKET REJECTED", status: "Ticket Rejected" },
  // added on 3rd June 2024
  { flag: 11, value: "PROPOSED SOLUTION", status: "Proposed Solution" },
  { flag: 12, value: "CUSTOMER ACTION", status: "Customer Action" },
  { flag: 13, value: "TICKET RAISED TO SAP", status: "Ticket Raised to SAP" },
];
const statusOptions = [
  // { value: 0, label: "Unassigned" },
  // { value: 1, label: "Pending for TR movement" },
  { value: 2, label: "Resolved" },
  // { value: 4, label: "Closed" },
  { value: 6, label: "On Hold" },
  { value: 11, label: "Proposed Solution" },
  { value: 12, label: "Customer Action" },
  {
    value: 13,
    label: "Ticket Raised to SAP",
  },
  // { value: 8, label: "Pending" },
  // { value: 9, label: "Work In Progress" },
];

const priorityStatus = [
  { label: "P1-Very high", value: "P1" },
  { label: "P2-High", value: "P2" },
  { label: "P3-Medium", value: "P3" },
  { label: "P4-Low", value: "P4" },
];
const priorityText = {
  P1: "Very high",
  P2: "High",
  P3: "Medium",
  P4: "Low",
};
const requestType = {
  1: "Service Request",
  2: "New Requirement",
  3: "Change Requirement",
};
const ticketAction = {
  1: "Created",
  2: "Assigned",
  3: "Requirement Approved",
  4: "Requirement Rejected",
  5: "Assigned To Consultant",
  6: "Ticket Updated",
  7: "Efforts Approved",
  8: "Efforts Rejected",
  9: "Effort Approval Requested",
  10: "TR Approval Requested",
  11: "TR Moved to PRD",
  12: "TR Approved",
  13: "TR Returned to Requestor",
  14: "User Response",
  15: "Target Date submitted",
  16: "Target Date updated",
  17: "Ticket Closed",
  18: "Consultant Response",
  19: "Initiator Response",
  20: "Ticket Resolved",
};

export default {
  statusFlag,
  statusOptions,
  requestType,
  priorityStatus,
  priorityText,
  ticketAction,
};
