import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const TicketCountAction = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getTicketCountByFlag)
      .then((response) => {
        // if (response.status == 200) {
        dispatch({
          type: "TICKET_COUNT",
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
