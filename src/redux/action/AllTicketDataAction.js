import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const AllTicketDataAction = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllTicket)
      .then((response) => {
        // if (response.status == 200) {
        let tempData = [...response.data];
        tempData.map((val) => {
          val.ASSIGNED_DATE = new Date(val.ASSIGNED_DATE).toDateString();
        });
        dispatch({
          type: "ALL_TICKET",
          payload: tempData,
        });
        resolve("success");
        // } else {
        //   reject("fail");
        // }
      })
      .catch((err) => {
        reject("fail1");
      });
  });
};
