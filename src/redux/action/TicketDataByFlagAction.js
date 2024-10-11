import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const TicketDataByFlagAction = (data) => (dispatch) => {
  
  return new Promise((resolve, reject) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getTicketDataByFlag + data)
      .then((response) => {
        // if (response.status == 200) {
        dispatch({
          type: "TICKET_DATA_BY_FLAG",
          payload: response.data,
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
