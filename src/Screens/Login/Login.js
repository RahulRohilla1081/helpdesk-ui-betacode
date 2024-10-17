import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import LoginImage from "../../assets/IMAGES/supportdesk-login-illustration.svg";
import SAMISHTILOGO from "../../assets/IMAGES/SamishtiLogo2.png";
import rb_2147783509 from "../../assets/IMAGES/Untitled design.svg";
import UserLogin from "./EmployeeLogin";
import cogoToast from "cogo-toast";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DASHBOARD, EMPLOYEEDASHBOARD } from "../../Utils/Routes";
import animationData from "../../assets/LottieAnimations/login.json";
// import { ClientLoginAction } from "../../redux/action/ClientLoginAction";
import { allUserDataAction } from "../../redux/action/allUserDataAction";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";
import { Card } from "@mui/material";
import LoginInput from "../../components/CustomInput/LoginInput";

function Login(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    props.allUserDataAction().then(() => {});
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    let stateData = localStorage.getItem("SUPPORT_DATA");

    if (stateData) {
      stateData = JSON.parse(stateData);
      if (stateData.LOGGED_IN_AS == "USER") {
        navigate(DASHBOARD);
      } else if (stateData.LOGGED_IN_AS == "EMPLOYEE") {
        navigate(EMPLOYEEDASHBOARD);
      }
    }
  }, []);

  const [showOTPForm, setShowOTPForm] = useState(false);
  const [OTPEntered, setOTPEntered] = useState([]);
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleClick = () => {
    navigate("/v1/employeelogin");
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (userData.userID == "") {
      cogoToast.warn("Please enter Username");
    } else if (userData.password == "") {
      cogoToast.warn("Please enter password");
    } else {
      axios
        .post(AXIOS.defaultPort + AXIOS.clientLogin, {
          USER_ID: userData.userID,
          PASSWORD: userData.password,
        })
        .then((response) => {
          if (response.status == 200) {
            if (response.data.PASSWORD_MATCHED == false) {
              cogoToast.error("Please provide valid ID and password");
            } else if (response.data[0]?.NEW_USER == true) {
              handleForgotPasswordClick();
            } else {
              let res = response.data[0];

              console.log("Asdahsbdhjasbdjhasd", res);
              let payload = {
                // USER_ID: res.USER_ID.toUpperCase(),
                // CLIENT_ID: res.CLIENT_ID,
                // USER_NAME: res.USER_NAME,
                // USER_MOBILE: res.USER_MOBILE,
                // USER_EMAIL: res.USER_EMAIL,
                // DESIGNATION: res.DESIGNATION,
                // DESIGNATION_DESCRIPTION: res.DESIGNATION_DESCRIPTION,
                // LOGGED_IN_AS: res.LOGIN_TYPE,
                // USER_TYPE: res.USER_TYPE,
                // CATEGORY: res.CATEGORY,
                // REQUEST_ID: res.REQUEST_ID,
                // FLAG: res.FLAG,
              };
              if (res.LOGIN_TYPE == "USER") {
                payload = {
                  USER_ID: res.USER_ID.toUpperCase(),
                  CLIENT_ID: res.CLIENT_ID,
                  USER_NAME: res.USER_NAME,
                  USER_MOBILE: res.USER_MOBILE,
                  USER_EMAIL: res.USER_EMAIL,
                  DESIGNATION: res.DESIGNATION,
                  DESIGNATION_DESCRIPTION: res.DESIGNATION_DESCRIPTION,
                  LOGGED_IN_AS: res.LOGIN_TYPE,
                  USER_TYPE: res.USER_TYPE,
                  CATEGORY: res.CATEGORY,
                  REQUEST_ID: res.REQUEST_ID,
                  FLAG: res.FLAG,
                  COMPANY_LOGO: res.COMPANY_LOGO,
                };
              } else if (res.LOGIN_TYPE == "EMPLOYEE") {
                payload = {
                  USER_ID: res.EMP_ID.toUpperCase(),
                  CLIENT_ID: null,
                  USER_NAME: res.EMP_NAME,
                  USER_MOBILE: res.EMP_MOBILE,
                  USER_EMAIL: res.EMP_EMAIL,
                  DESIGNATION: res.DESIGNATION,
                  DESIGNATION_DESCRIPTION: res.DESIGNATION_DESCRIPTION,
                  LOGGED_IN_AS: "EMPLOYEE",
                  WORK_LOCATION: res.WORK_LOCATION,
                  SCOPE_OF_WORK: res.SCOPE_OF_WORK,
                  USER_TYPE: res.USER_TYPE,
                  FLAG: res.FLAG,
                  COMPANY_LOGO: res.COMPANY_LOGO,
                };
              }

              localStorage.setItem("SUPPORT_DATA", JSON.stringify(payload));
              // if (res == "fail") {
              // } else {
              dispatch({
                type: "CLIENT_LOGIN",
                payload: payload,
              });

              if (res.LOGIN_TYPE == "USER") {
                navigate(DASHBOARD);
                // navigate(EMPLOYEEDASHBOARD);
              } else if (res.LOGIN_TYPE == "EMPLOYEE") {
                navigate(EMPLOYEEDASHBOARD);
              }

              // }
            }

            // return "success";
            // resolve(payload);
          }
        })
        .catch((err) => {
          // return err;
        });

      // props
      //   .ClientLoginAction(userData)
      //   .then((res) => {

      //   //  let payload = {
      //   //    USER_ID: res.USER_ID,
      //   //    CLIENT_ID: res.CLIENT_ID,
      //   //    USER_NAME: res.USER_NAME,
      //   //    USER_MOBILE: res.USER_MOBILE,
      //   //    USER_EMAIL: res.USER_EMAIL,
      //   //    DESIGNATION: res.DESIGNATION,
      //   //    LOGGED_IN_AS: "USER",
      //   //    ...res,
      //   //  };

      //   })
      //   .catch((err) => {
      //     cogoToast.error("Incorrect User ID/Password");
      //   });
    }
  };
  const [userData, setUserData] = useState({ userID: "", password: "" });
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleForgotPasswordClick = () => {
    if (userData.userID == "") {
      cogoToast.warn("Please enter user ID");
    } else {
      axios
        .post(AXIOS.defaultPort + AXIOS.forgetPassword, {
          USER_ID: userData.userID,
        })
        .then((response) => {
          if (response.data.useVerified == false) {
            cogoToast.error("Unregistered user");
          } else {
            setShowOTPForm(true);
            cogoToast.success("OTP sent to your email ID");
          }
        })
        .catch((err) => {
          cogoToast.error("Something went wrong");
        });
    }
  };
  const verifyOtpHandler = (e) => {
    e.preventDefault();
    let otp = OTPEntered.join("");
    // console.log("otp", otp);
    axios
      .post(AXIOS.defaultPort + AXIOS.verifyOtp, {
        USER_ID: userData.userID,
        OTP: Number(otp),
      })
      .then((response) => {
        if (response.data.OTPVerified == true) {
          cogoToast.success("Correct OTP. Enter new password");

          setChangePassword(true);
          setOTPEntered([]);
        } else {
          cogoToast.error("Incorrect OTP");
        }
      })
      .catch((err) => {
        cogoToast.error("Something went wrong");
      });
  };
  const changePasswordHandler = (e) => {
    e.preventDefault();
    axios
      .post(AXIOS.defaultPort + AXIOS.changePassword, {
        USER_ID: userData.userID,
        PASSWORD: newPassword,
      })
      .then((response) => {
        cogoToast.success("Password changed successfully");
        setChangePassword(false);
        setOTPEntered([]);
        setUserData({ userID: "", password: "" });
        setShowOTPForm(false);
      })
      .catch((err) => {
        cogoToast.error("Something went wrong");
      });
  };

  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const handleChange = (index, e) => {
    const value = e.target.value;
    // If a letter is typed and the current input is not the last one
    if (value.length === 1 && index < inputRefs.length - 1) {
      // Focus on the next input
      inputRefs[index + 1].current.focus();
    }
    // If backspace is pressed and the currfail1ent input is not the first one
    else if (value.length === 0 && index > 0) {
      // Focus on the previous input
      inputRefs[index - 1].current.focus();
    }
    let temp = [...OTPEntered];
    temp[index] = e.target.value;
    setOTPEntered(temp);
  };

  const onKeyDownHandler = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      handleLogin();
      //  this.sendMessage();
    }
  };
  return (
    <div className="login-main-container">
      <Card
        className="sub-left-container"
        sx={{
          borderRadius: 5,
          marginLeft: 5,
        }}
      >
        <div className="login-samishti-logo">
          <img height={55} width={180} src={SAMISHTILOGO} />
        </div>
        <div className="login-left-inner-container">
          <h2 className="login-header-text raleway-font"> Hello! 👋</h2>
          <p
            className="sub-heading-text inter-font"
            style={{
              // fontWeight: "bold",
              color: "#677a8e",
              fontWeight: 500,
            }}
          >
            Login to your account.
          </p>

          <form
            className="form-container"
            // onKeyDown={onKeyDownHandler}
            onSubmit={handleLogin}
          >
            <div className="label-input-box">
              <p
                className="input-box-title "
                style={{
                  // fontWeight: "bold",
                  color: "#677a8e",
                  fontWeight: 500,
                  marginBottom: 0,
                }}
              >
                Username
              </p>
              <LoginInput
                Style={{ height: "7vh" }}
                Placeholder={"Enter Username / Email ID"}
                Value={userData.userID}
                onChange={(e) => {
                  let temp = { ...userData };
                  temp.userID = e.target.value;
                  setUserData(temp);
                }}
              />
            </div>

            {changePassword == false && (
              <>
                {showOTPForm == false && (
                  <div>
                    <p
                      className="input-box-title"
                      style={{
                        // fontWeight: "bold",
                        color: "#677a8e",
                        fontWeight: 500,
                        marginBottom: 0,
                      }}
                    >
                      Password
                    </p>
                    <LoginInput
                      Style={{ height: "7vh" }}
                      Type={"password"}
                      Placeholder={"Enter Password"}
                      Value={userData.password}
                      onChange={(e) => {
                        let temp = { ...userData };
                        temp.password = e.target.value;
                        setUserData(temp);
                      }}
                    />
                  </div>
                )}
                <div className="login-forgot-password-container">
                  {showOTPForm ? (
                    <form>
                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group text-center">
                              <label
                                className="margin-align"
                                style={{
                                  // fontWeight: "bold",
                                  color: "#677a8e",
                                  fontWeight: 500,
                                }}
                              >
                                Enter OTP
                              </label>
                              <div className="form-group-input otp-form-group mb-3">
                                {inputRefs.map((ref, index) => (
                                  <input
                                    key={index}
                                    ref={ref}
                                    maxLength={1}
                                    // style={{
                                    //   width: "30px",
                                    //   height: "30px",
                                    //   marginRight: "5px",
                                    // }}
                                    type="text"
                                    minlength="1"
                                    maxlength="1"
                                    className="form-control otp-inputbar"
                                    value={OTPEntered[index]}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        id="verify-btn"
                        // type="submit"
                        onClick={verifyOtpHandler}
                      >
                        Verify OTP
                      </button>
                    </form>
                  ) : (
                    <p
                      className="login-forgot-password-text"
                      onClick={handleForgotPasswordClick}
                    >
                      Forgot Password?
                    </p>
                  )}
                </div>

                {showOTPForm == false && changePassword == false && (
                  <div className="btn-style">
                    <button
                      onClick={handleLogin}
                      className="login-signup-button"
                      type="submit"
                    >
                      <span className="span-1">Log In</span>
                    </button>
                    {/* <button
                      onClick={handleClick}
                      className="login-signup-button"
                    >
                      <span className="span-2">Login as Employee</span>
                    </button> */}
                  </div>
                )}
              </>
            )}
            {changePassword == true && (
              <>
                <div>
                  <p
                    className="input-box-title"
                    style={{
                      // fontWeight: "bold",
                      color: "#677a8e",
                      fontWeight: 500,
                    }}
                  >
                    Enter new password
                  </p>
                  <LoginInput
                    Style={{ height: "7vh" }}
                    Type={"password"}
                    Placeholder={"Enter new password"}
                    Value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                </div>
                <button
                  onClick={changePasswordHandler}
                  className="login-signup-button"
                >
                  <span className="span-2">Change Password</span>
                </button>
              </>
            )}
          </form>
        </div>
      </Card>
      {/* <div className="sub-right-container">
        <img src={LoginImage} />
      </div> */}
      <div className="login-right-container cover-img">
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <img
            src={rb_2147783509}
            style={{
              right: 0,
              top: 0,
              // width: 700,
              height: "100vh",
              objectFit: "contain",
              // borderRadius:200
            }}
          />
        </div>
      </div>
    </div>
  );
}

// export default Login;
const mapStateToProps = (state) => ({
  user_data: state.userData.userList,
});

export default connect(mapStateToProps, {
  // ClientLoginAction,
  allUserDataAction,
})(Login);
