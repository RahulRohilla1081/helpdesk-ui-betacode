// import axios from "axios";
// import AXIOS from "../../Utils/AXIOS";
// export const empLoginAction = (data) => (dispatch) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(
//         AXIOS.defaultPort +
//           AXIOS.empLogin +
//           data.userID +
//           "&PASSWORD=" +
//           data.password
//       )
//       .then((response) => {
//         if (response.status == 200) {

//           console.log("ASasaS",response.data);

//           let res = response.data[0];
//           let payload = {
//             USER_ID: res.EMP_ID,
//             CLIENT_ID: null,
//             USER_NAME: res.EMP_NAME,
//             USER_MOBILE: res.EMP_MOBILE,
//             USER_EMAIL: res.EMP_EMAIL,
//             DESIGNATION: res.DESIGNATION,
//             DESIGNATION_DESCRIPTION: res.DESIGNATION_DESCRIPTION,
//             LOGGED_IN_AS: "EMPLOYEE",
//             WORK_LOCATION: res.WORK_LOCATION,
//             SCOPE_OF_WORK: res.SCOPE_OF_WORK,
//             USER_TYPE: res.USER_TYPE,
//             FLAG: res.FLAG,
//           };
//           console.log("asdkhbasdbjasdas",payload);
//           dispatch({
//             type: "CLIENT_LOGIN",
//             payload: payload,
//           });
//           resolve(payload);
//         } else {
//           reject("fail");
//         }
//       })
//       .catch((err) => {
//         reject("fail1");
//       });
//   });
// };
