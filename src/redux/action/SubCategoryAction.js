import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
export const SubCategoryAction = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(AXIOS.defaultPort + AXIOS.getSubCategory + data)
      .then((response) => {
        // if (response.status == 200) {
        let subCat = response.data;
        let subData = [];

        subCat.SUB_CATEGORY.map((val) => {
          subData.push({ label: val, value: val });
        });
        subCat.SUB_CATEGORY = subData;
        dispatch({
          type: "SUB_CATEGORY",
          payload: subCat,
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
