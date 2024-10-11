// import axios from "axios";
// import AXIOS from "../../Utils/AXIOS";
// export const ClientLoginAction = (data) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(
//         AXIOS.defaultPort +
//           AXIOS.clientLogin +
//           data.userID +
//           "&PASSWORD=" +
//           data.password
//       )
//       .then((response) => {
//         if (response.status == 200) {
//           let res = response.data[0];
//           let payload = {
//             USER_ID: res.USER_ID,
//             CLIENT_ID: res.CLIENT_ID,
//             USER_NAME: res.USER_NAME,
//             USER_MOBILE: res.USER_MOBILE,
//             USER_EMAIL: res.USER_EMAIL,
//             DESIGNATION: res.DESIGNATION,
//             DESIGNATION_DESCRIPTION: res.DESIGNATION_DESCRIPTION,
//             LOGGED_IN_AS: "USER",
//             USER_TYPE: res.USER_TYPE,
//             CATEGORY: res.CATEGORY,
//             REQUEST_ID: res.REQUEST_ID,
//             FLAG: res.FLAG,

         
//           };
//           dispatch({
//             type: "CLIENT_LOGIN",
//             payload: payload,
//           });
//           // return "success";
//           resolve(payload);
//         } else {
//           reject("fail");
//           // return "fail";
//         }
//       })
//       .catch((err) => {
//         // return err;

//         reject("fail1");
//       });
//   });
// };
