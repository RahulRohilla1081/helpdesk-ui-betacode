import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const allUserDataAction = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllUser)
      .then((response) => {
        // if (response.status == 200) {
        dispatch({
          type: "USER_DATA",
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
