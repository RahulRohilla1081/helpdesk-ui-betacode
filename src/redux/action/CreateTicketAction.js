import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const CreateTicketAction = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://suprsales.io:4001/Support_Portal_api/Ticket/createTicket")
      .then((response) => {
        if (response.status == 200) {
          dispatch({
            type: "CREATE_TICKET",
            payload: response.data,
          });
          resolve("success");
        } else {
          reject("fail");
        }
      })
      .catch((err) => {
        reject("fail1");
      });
  });
};
