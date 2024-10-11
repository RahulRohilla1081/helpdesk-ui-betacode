import { combineReducers } from "redux";
import loginData from "./loginData";
import categoryData from "./categoryData";
import ticketCountData from "./ticketCountData";
import ticketData from "./ticketData";
import userData from "./userData";
import approverData from "./approverData";

export default combineReducers({
  loginData: loginData,
  categoryData: categoryData,
  ticketCountData: ticketCountData,
  ticketData: ticketData,
  userData: userData,
  approverData: approverData,
});
