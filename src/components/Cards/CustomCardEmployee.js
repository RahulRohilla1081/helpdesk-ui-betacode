import React from "react";
import "./CustomCardEmployee.css";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Divider,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import OpenEmpIcon from '../../assets/Icons/open.png'
import { node } from "prop-types";

function CustomCardEmployee({data}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/v1/unassigned", {
      state: { data: data },
    });
  };
  const handleClickOpenEmp = () => {
    navigate("/v1/openemp", {
      state: { data: data },
    });
  };
  const handleClickProgressEmp = () => {
    navigate("/v1/progressemp", {
      state: { data: data },
    });
  };
  const handleClick3 = () => {
    navigate("/v1/awaitinguserinput", {
      state: { data: data },
    });
  };
  const handleClick4 = () => {
    navigate("/v1/awaitingvendorinput", {
      state: { data: data },
    });
  };
  const handleClickHoldEmp = () => {
    navigate("/v1/holdemp", {
      state: { data: data },
    });
  };

  return (

    <div className="sub-container">
      <Card onClick={handleClick} className="Empcard Empcard-1">
        <CardContent>
          <div className="card-design">
            <h4
             style={{color:"#057195"}}
            className="number-count">
              {data.UNASSIGNED}
            </h4>
            <div
             style={{color:"#057195"}}
            className="card-content">
              Unassigned
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClickOpenEmp} className="Empcard Empcard-2">
        <CardContent >
          <div className="card-design">
            <h4
             style={{color:"#431d1d"}}
            className="number-count">
              {data.OPEN}
            </h4>
            <div
             style={{color:"#431d1d"}}
            className="card-content">
              Open
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClickProgressEmp} className="Empcard Empcard-3">
        <CardContent>
          <div className="card-design">
            <h4
            style={{color:"#384d04"}}
            className="number-count">
              {data.WORK_IN_PROGRESS}
            </h4>
            <div
            style={{color:"#384d04"}}
            className="card-content">
              WIP
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick3} className="Empcard Empcard-4">
        <CardContent>
          <div className="card-design">
            <h4
             style={{color:"#431d1d"}}
            className="number-count">
              {data.WAITING_USER_INPUT}
            </h4>
            <div
             style={{color:"#431d1d"}}
            className="card-content">
              AUI
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick4} className="Empcard Empcard-5">
        <CardContent>
          <div className="card-design">
            <h4
            style={{color:"#43253d"}}className="number-count">
              {data.WAITING_VENDOR_INPUT}
            </h4>
            <div
            style={{color:"#43253d"}}
            className="card-content">
              AVI
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClickHoldEmp} className="Empcard Empcard-6">
        <CardContent>
          <div className="card-design">
            <h4
            style={{color:"#33363f"}}
            className="number-count">
              {data.ON_HOLD}
            </h4>
            <div className="card-content" style={{color:"#33363f"}}>
              On Hold
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomCardEmployee;
