import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const ApproverGetAction= (data) => (dispatch) => {
  
  return new Promise((resolve, reject) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getApprover + data)
      .then((response) => {
        // if (response.status == 200) {
        dispatch({
          type: "APPROVER_GET",
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
