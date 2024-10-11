import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const allUserDataAction = (payload) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post(AXIOS.defaultPort + AXIOS.getAllUser, {
        ...payload,
      })
      .then((response) => {
        // if (response.status == 200) {
        // dispatch({
        //   type: "USER_DATA",
        //   payload: response.data,
        // });
        resolve();
        // } else {
        //   reject("fail");
        // }
      })
      .catch((err) => {
        reject("reject");
      });
  });
};
