import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const ClientDataAction = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://suprsales.io:4001/Support_Portal_api/ClientData/clientData?CLIENT_ID=E11060")
      .then((response) => {
        if (response.status == 200) {
          dispatch({
            type: "CLIENT_DATA",
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
