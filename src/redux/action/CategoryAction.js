import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const CategoryAction = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getAllCategory)
      .then((response) => {
        // if (response.status == 200) {
        let catData = [...response.data];
        catData.map((val) => {
          val.label = val.CategoryName;
          val.value = val.CategoryId;
        });
        dispatch({
          type: "CATEGORY",
          payload: catData,
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
