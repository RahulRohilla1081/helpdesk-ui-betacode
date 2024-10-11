import React, { useRef, useState } from "react";
import "./Login.css";
import { Typography } from "@mui/material";
import { CheckBox, Password } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/CustomInput/CustomInput";
import { EMPLOYEEDASHBOARD } from "../../Utils/Routes";
import Lottie from "react-lottie";
import animationData from "../../assets/LottieAnimations/login.json";
// import { empLoginAction } from "../../redux/action/empLoginAction";
// import SamishtiLogo from "../../assets/IMAGES/SamishtiLogo2.png";
import cogoToast from "cogo-toast";
import { connect, useDispatch } from "react-redux";
import LoginImageGreen from "../../assets/IMAGES/LoginImageGreen.png";
import SAMISHTILOGO from "../../assets/IMAGES/SamishtiLogo2.png";
import LoginImage from "../../assets/IMAGES/LoginImageGreen.png";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";

function EmployeeLogin(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOTPForm, setShowOTPForm] = useState(false);
  const [OTPEntered, setOTPEntered] = useState([]);
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleClick = () => {
    navigate("/");
  };
  const handleLogin = () => {
    if (userData.userID == "") {
      cogoToast.warn("Please enter Username");
    } else if (userData.password == "") {
      cogoToast.warn("Please enter password");
    } else {
      axios
        .get(
          AXIOS.defaultPort +
            AXIOS.empLogin +
            userData.userID +
            "&PASSWORD=" +
            userData.password
        )
        .then((response) => {
          if (response.status == 200) {
            if (response.data.PASSWORD_MATCHED == false) {
              cogoToast.error("Please provide valid ID and password");
            } else if (response.data[0]?.NEW_USER == true) {
              handleForgotPasswordClick();
            } else {
              let res = response.data[0];
              let payload = {
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
              };
              dispatch({
                type: "CLIENT_LOGIN",
                payload: payload,
              });
              localStorage.setItem("SUPPORT_DATA", JSON.stringify(payload));
              navigate(EMPLOYEEDASHBOARD);
            }
          }
        })
        .catch((err) => {
          console.log("Error:1225243", err);
        });
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
        .post(AXIOS.defaultPort + AXIOS.forgetPasswordEmp, {
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
    axios
      .post(AXIOS.defaultPort + AXIOS.verifyOtpEmp, {
        EMP_ID: userData.userID,
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
      .post(AXIOS.defaultPort + AXIOS.changePasswordEmp, {
        EMP_ID: userData.userID,
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
    // If backspace is pressed and the current input is not the first one
    else if (value.length === 0 && index > 0) {
      // Focus on the previous input
      inputRefs[index - 1].current.focus();
    }
    let temp = [...OTPEntered];
    temp[index] = e.target.value;
    setOTPEntered(temp);
  };

  return (
    <div className="login-main-container">
      <div className="sub-left-container">
        <div className="login-samishti-logo">
          <img height={40} width={150} src={SAMISHTILOGO} />
        </div>
        <div className="login-left-inner-container">
          <h2 className="login-header-text raleway-font">
            {" "}
            Hello! Welcome Back
          </h2>
          <p className="sub-heading-text inter-font">Login to your account.</p>

          <div className="form-container">
            <div className="label-input-box">
              <p className="input-box-title">Username</p>
              <CustomInput
                Style={{ height: "7vh" }}
                Placeholder={"Enter your username / email id"}
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
                    <p className="input-box-title">Password</p>
                    <CustomInput
                      Style={{ height: "7vh" }}
                      Type={"password"}
                      Placeholder={"Enter your password"}
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
                    <form onSubmit={verifyOtpHandler}>
                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group text-center">
                              <label className="margin-align">
                                Enter the Code
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
                      <button id="verify-btn">Verify OTP</button>
                    </form>
                  ) : (
                    <p
                      className="login-forgot-password-text"
                      onClick={handleForgotPasswordClick}
                    >
                      Forgot password?
                    </p>
                  )}
                </div>

                {showOTPForm == false && changePassword == false && (
                  <div className="btn-style">
                    <button
                      onClick={handleLogin}
                      className="login-signup-button"
                    >
                      <span className="span-1">Sign In</span>
                    </button>
                    <button
                      onClick={handleClick}
                      className="login-signup-button"
                    >
                      <span className="span-2">Login as User</span>
                    </button>
                  </div>
                )}
              </>
            )}
            {changePassword == true && (
              <>
                <div>
                  <p className="input-box-title">Enter new password</p>
                  <CustomInput
                    Style={{ height: "7vh" }}
                    Type={"password"}
                    Placeholder={"Enter your password"}
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
          </div>
        </div>
      </div>
      <div className="sub-right-container">
        <img src={LoginImage} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  // empLoginAction,
})(EmployeeLogin);
