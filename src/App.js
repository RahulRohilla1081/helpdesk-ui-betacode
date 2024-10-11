import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Screens/Dashboard/Dashboard";
import {
  DASHBOARD,
  EMPLOYEELOGIN,
  TICKETDETAIL,
  OPEN,
  WORKINPROGRESS,
  AWAITINGUSERINPUT,
  AWAITINGVENDORINPUT,
  HOLD,
  EMPLOYEEDASHBOARD,
  CLOSE,
  PENDING,
  OPENEMP,
  WORKINPROGRESSEMP,
  HOLDEMP,
  NEWTICKETDETAILS,
  LOGTICKET,
  UNASSIGNED,
  ADDCATEGORY,
  ADDSUBCATEGORY,
  ADDITEM,
  ADDCOMPANY,
  ADDPROJECTMANAGER,
  APPROVER,
  ADDTECHNICIAN,
  ADDUSER,
  ADDEMPLOYEE,
  ADD_TECHNICIAN_MANAGER,
  TICKET_REPORT,
  TURN_AROUND_TIME,
  TURN_AROUND_TIME_MAPPING,
  USER_ROLES,
  TICKET_REPORT_VIEW,
  ADD_TASK,
  TICKET_REPORT_VIEW_PARENT,
  ADD_EMPLOYEES,
  TICKET_STATUS_REPORT,
} from "./Utils/Routes";
import LogTicket from "./Screens/LogTicket/LogTicket";

import Unassgined from "./Screens/TicketStatus/UnassginedEmp";
// import {UNASSIGNED} from './Utils/Routes'
import EmployeeLogin from "./Screens/Login/EmployeeLogin";
// import TicketDetail from './Screens/Dashboard/TicketDetail'
import TicketDetails from "./Screens/Dashboard/TicketDetails";
import Open from "./Screens/TicketStatus/OpenUser";
import WorkInProgress from "./Screens/TicketStatus/WorkInProgressUser";
import AwaitingUserInput from "./Screens/TicketStatus/AwaitingUserInput";
import AwaitingVendorInput from "./Screens/TicketStatus/AwaitingVendorInput";
import Hold from "./Screens/TicketStatus/HoldUser";
import EmployeeDashboard from "./Screens/Dashboard/EmployeeDashboard";
import Close from "./Screens/TicketStatus/CloseUser";
import Pending from "./Screens/TicketStatus/PendingUser";
import OpenEmp from "./Screens/TicketStatus/OpenEmp";
import WorkInProgressEmp from "./Screens/TicketStatus/WorkInProgressEmp";
import HoldEmp from "./Screens/TicketStatus/HoldEmp";
import Login from "./Screens/Login/Login";
import AddCategory from "./Screens/Manager/AddCategory";
import AddSubCategory from "./Screens/Manager/AddSubCategory";
import AddItem from "./Screens/Manager/AddItem";
import AddCompanyName from "./Screens/Master/AddCompanyName";
import AddProjectManager from "./Screens/Master/AddProjectManager";
import AddApprover from "./Screens/Manager/AddApprover";
import AddTechnician from "./Screens/Master/AddTechnician";
import AddUser from "./Screens/Master/AddUser";
import AddEmployee from "./Screens/Master/AddEmployee";
import { useDispatch } from "react-redux";
import AddTechnicianManager from "./Screens/Manager/AddTechnicianManager";
import TicketReport from "./Screens/Master/TicketReport";
import ProtectedRoute from "./ProtectedRoute";
import TurnAroundTime from "./Screens/TAT/TurnAroundTime";
import TATMapping from "./Screens/TAT/TATMapping";
import LogTicketITSM from "./Screens/LogTicket/LogTicketITSM";
import UserRoles from "./Screens/UserRoles/UserRoles";
import ReportTktView from "./Screens/Master/ReportTktView";
import AddTask from "./Screens/Tasks/AddTask";
import ReportTktViewParent from "./Screens/Master/ReportTktViewParent";
import AddEmployees from "./Screens/Dashboard/AddEmployees";
import TktStatusReport from "./Screens/Master/TktStatusReport";

function App() {
  const dispatch = useDispatch();
  let loggedInData = localStorage.getItem("SUPPORT_DATA");
  if (loggedInData) {
    dispatch({
      type: "CLIENT_LOGIN",
      payload: JSON.parse(loggedInData),
    });
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path={DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={USER_ROLES}
          element={
            <ProtectedRoute>
              <UserRoles />
            </ProtectedRoute>
          }
        />
        <Route
          path={LOGTICKET}
          element={
            <ProtectedRoute>
              <LogTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/itsm"}
          element={
            <ProtectedRoute>
              <LogTicketITSM />
            </ProtectedRoute>
          }
        />
        <Route
          path={UNASSIGNED}
          element={
            <ProtectedRoute>
              <Unassgined />
            </ProtectedRoute>
          }
        />
        {/* <Route path={EMPLOYEELOGIN} element={<EmployeeLogin />} /> */}
        <Route
          path={TICKETDETAIL}
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path={OPEN}
          element={
            <ProtectedRoute>
              <Open />
            </ProtectedRoute>
          }
        />
        <Route
          path={WORKINPROGRESS}
          element={
            <ProtectedRoute>
              <WorkInProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path={AWAITINGUSERINPUT}
          element={
            <ProtectedRoute>
              <AwaitingUserInput />
            </ProtectedRoute>
          }
        />
        <Route
          path={AWAITINGVENDORINPUT}
          element={
            <ProtectedRoute>
              <AwaitingVendorInput />
            </ProtectedRoute>
          }
        />
        <Route
          path={HOLD}
          element={
            <ProtectedRoute>
              <Hold />
            </ProtectedRoute>
          }
        />
        <Route
          path={CLOSE}
          element={
            <ProtectedRoute>
              <Close />
            </ProtectedRoute>
          }
        />
        <Route
          path={PENDING}
          element={
            <ProtectedRoute>
              <Pending />
            </ProtectedRoute>
          }
        />
        <Route
          path={EMPLOYEEDASHBOARD}
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={OPENEMP}
          element={
            <ProtectedRoute>
              <OpenEmp />
            </ProtectedRoute>
          }
        />
        <Route
          path={WORKINPROGRESSEMP}
          element={
            <ProtectedRoute>
              <WorkInProgressEmp />
            </ProtectedRoute>
          }
        />
        <Route
          path={HOLDEMP}
          element={
            <ProtectedRoute>
              <HoldEmp />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDCATEGORY}
          element={
            <ProtectedRoute>
              <AddCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDSUBCATEGORY}
          element={
            <ProtectedRoute>
              <AddSubCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDITEM}
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDCOMPANY}
          element={
            <ProtectedRoute>
              <AddCompanyName />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDPROJECTMANAGER}
          element={
            <ProtectedRoute>
              <AddProjectManager />
            </ProtectedRoute>
          }
        />
        <Route
          path={APPROVER}
          element={
            <ProtectedRoute>
              <AddApprover />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDTECHNICIAN}
          element={
            <ProtectedRoute>
              <AddTechnician />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDUSER}
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADDEMPLOYEE}
          element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADD_TECHNICIAN_MANAGER}
          element={
            <ProtectedRoute>
              <AddTechnicianManager />
            </ProtectedRoute>
          }
        />
        <Route
          path={TICKET_REPORT}
          element={
            <ProtectedRoute>
              <TicketReport />
            </ProtectedRoute>
          }
        />
        <Route
          path={TICKET_REPORT_VIEW}
          element={
            <ProtectedRoute>
              <ReportTktView />
            </ProtectedRoute>
          }
        />
        <Route
          path={TICKET_REPORT_VIEW_PARENT}
          element={
            <ProtectedRoute>
              <ReportTktViewParent />
            </ProtectedRoute>
          }
        />
        <Route
          path={TURN_AROUND_TIME}
          element={
            <ProtectedRoute>
              <TurnAroundTime />
            </ProtectedRoute>
          }
        />
        <Route
          path={TURN_AROUND_TIME_MAPPING}
          element={
            <ProtectedRoute>
              <TATMapping />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADD_TASK}
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />
        <Route
          path={ADD_EMPLOYEES}
          element={
            <ProtectedRoute>
              <AddEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path={TICKET_STATUS_REPORT}
          element={
            <ProtectedRoute>
              <TktStatusReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
