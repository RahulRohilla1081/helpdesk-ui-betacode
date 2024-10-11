import React from "react";
import "./CustomCardUser.css";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Divider,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

function CustomCardUser({ data }) {
  const navigate = useNavigate();

  const handleClick1 = () => {
    navigate("/v1/open", {
      state: { data: data },
    });
  };
  const handleClick2 = () => {
    navigate("/v1/workinprogress", {
      state: { data: data },
    });
  };
  const handleClick5 = () => {
    navigate("/v1/hold", {
      state: { data: data },
    });
  };
  const handleClick6 = () => {
    navigate("/v1/close", {
      state: { data: data },
    });
  };
  const handleClick7 = () => {
    navigate("/v1/pending", {
      state: { data: data },
    });
  };

  return (
    <div className="sub-container">
      <Card onClick={handleClick1} className="Newcard card-1">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design Subcard-1">
            <h4 style={{ color: "#1e372a" }} className="number-count">
              {data?.OPEN}
            </h4>
            <div style={{ color: "#1e372a" }} className="card-content">
              Open
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick2} className="Newcard card-2">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#3a025f" }} className="number-count">
              {data?.WORK_IN_PROGRESS}
            </h4>
            <div style={{ color: "#3a025f" }} className="card-content">
              WIP
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick5} className="Newcard card-3">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#222543" }} className="number-count">
              {data?.ON_HOLD}
            </h4>
            <div style={{ color: "#222543" }} className="card-content">
              On Hold
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick6} className="Newcard card-4">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#2f2c67" }} className="number-count">
              {data?.CLOSED}
            </h4>
            <div style={{ color: "#2f2c67" }} className="card-content">
              Closed
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick7} className="Newcard card-5">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#057195" }} className="number-count">
              {data?.PENDING}
            </h4>
            <div style={{ color: "#057195" }} className="card-content">
              Pending
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick1} className="Newcard card-7">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#384d04" }} className="number-count">
              {data?.OPEN}
            </h4>
            <div style={{ color: "#384d04" }} className="card-content">
              Unassigned
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Card onClick={handleClick2} className="Newcard card-7">
        <CardContent style={{padding:"5px"}}>
          <div className="card-design" >
            <h4 
             style={{color:"#384d04"}}
            className="number-count" >
              {data?.WORK_IN_PROGRESS}
            </h4>
            <div 
             style={{color:"#384d04"}}
            className="card-content" >
            Assigned
            </div>
          </div>
        </CardContent>
      </Card> */}
      <Card onClick={handleClick5} className="Newcard card-8">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#431d1d" }} className="number-count">
              {data?.ON_HOLD}
            </h4>
            <div style={{ color: "#431d1d" }} className="card-content">
              Resolved
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick6} className="Newcard card-9">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#43253d" }} className="number-count">
              {data?.CLOSED}
            </h4>
            <div style={{ color: "#43253d" }} className="card-content">
              CAA
            </div>
          </div>
        </CardContent>
      </Card>
      <Card onClick={handleClick7} className="Newcard card-10">
        <CardContent style={{ padding: "5px" }}>
          <div className="card-design">
            <h4 style={{ color: "#33363f" }} className="number-count">
              {data?.PENDING}
            </h4>
            <div style={{ color: "#33363f" }} className="card-content">
              EAA
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomCardUser;
