
import React from "react";
import { Input, Label } from "reactstrap";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import "./AddEmployee.css";
import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  TableRow,
} from "@mui/material";
import { ADDEMPLOYEE } from "../../Utils/Routes";
 
function AddEmployee() {
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={"/addemployee"}>
      <div style={{ height: "100vh" }}>
        <div className="employee-input-container">
          
          <div style={{ padding: "1%" }} className="row">
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Employee ID<span className="required-filed">*</span>
              </Label>
              <Input
                type="text"
                name="EMPLOYEEID"
                className="form-control"
                placeholder="Enter Employee Id"
              />
            </div>
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Employee Name<span className="required-filed">*</span>
              </Label>
              <Input
                type="text"
                name="EMPLOYEENAME"
                className="form-control"
                placeholder="Enter Employee Name"
              />
            </div>
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Employee Mobile<span className="required-filed">*</span>
              </Label>
              <Input
                type="number"
                name="NUMBER"
                className="form-control"
                placeholder="Enter Mobile"
              />
            </div>
          </div>
          <div style={{ padding: "1%" }} className="row">
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Employee Email<span className="required-filed">*</span>
              </Label>
              <Input
                type="text"
                name="EMAIL"
                className="form-control"
                placeholder="Enter Email"
              />
            </div>
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Reporting Manager<span className="required-filed">*</span>
              </Label>
              <Input type="select" name="MANAGER" className="form-control">
                <option value="select">Select</option>
                <option value="">Manager Name</option>
                <option value="">Manager Name</option>
                <option value="">Manager Name</option>
              </Input>
            </div>
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                User Type<span className="required-filed">*</span>
              </Label>
              <Input
                type="text"
                name="USERTYPE"
                className="form-control"
                placeholder="Enter User Type"
              />
            </div>
          </div>
          <div style={{ padding: "1%" }} className="row">
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Work Location<span className="required-filed">*</span>
              </Label>
              <Input
                type="text"
                className="form-control"
                placeholder="Enter Location"
              />
            </div>
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Scope of Work<span className="required-filed">*</span>
              </Label>
              <Input
                type="text"
                name="EMPLOYEENAME"
                className="form-control"
                placeholder="Enter Scope"
              />
            </div>
            <div className="col-md-4">
              <Label for="basicpill-email-input4">
                Designation<span className="required-filed">*</span>
              </Label>
              <Input
                type="text"
                name="NUMBER"
                className="form-control"
                placeholder="Enter Designation"
              />
            </div>
          </div>
          <div style={{ padding: "1%" }} className="row">
            <div className="col-md-6">
              <Label for="basicpill-email-input4">
                Designation Description<span className="required-filed">*</span>
              </Label>
              <Input
                type="textarea"
                className="form-control"
                placeholder="Enter Location"
              />
            </div>
          </div>

          <div
            style={{ marginRight: "5px" }}
            className="row employee-inner_div"
          >
            <button
              style={{ backgroundColor: "#219bcc" }}
              className="mx-2 col-2 employee-button-style"
            >
              Add
            </button>
          </div>

          <div className="employee-table">
            <TableContainer>
              <Table aria-label="customized table" stickyHeader>
                <TableHead className="scroll-effect">
                  <tr>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Employee ID
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Employee Name
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Employee Mobile
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Employee Email
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Reporting Manager
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      User Type
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Work Location
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Scope of Work
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Designation
                    </th>
                    <th
                      sx={{
                        columnWidth: "100%",
                        color: "#2d344b",
                      }}
                    >
                      Designation Description
                    </th>
                  </tr>
                </TableHead>

                <TableBody>
                  <tr>
                    <td>C0001</td>
                    <td>JMDR</td>
                    <td>987654321</td>
                    <td>test@gmail.com</td>
                    <td>Manager</td>
                    <td>User Type</td>
                    <td>Noida</td>
                    <td>scope work</td>
                    <td>RM</td>
                    <td>Description</td>
                  </tr>
                  <tr>
                    <td>C0001</td>
                    <td>JMDR</td>
                    <td>987654321</td>
                    <td>test@gmail.com</td>
                    <td>Manager</td>
                    <td>User Type</td>
                    <td>Noida</td>
                    <td>scope work</td>
                    <td>RM</td>
                    <td>Description</td>
                  </tr>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </MainScreenEmployee>
  );
}
 
export default AddEmployee;
 