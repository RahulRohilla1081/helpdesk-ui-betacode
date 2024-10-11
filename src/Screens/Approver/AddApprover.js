import React from 'react'
import MainScreenEmployee from '../../components/AppDrawer/MainScreenEmployee'
import { Input, Label } from 'reactstrap'
import "./AddApprover.css"

function AddApprover() {
  return (
    <MainScreenEmployee drawerWidth={282}>
    <div style={{marginTop:"3%", marginLeft:"10%", padding:"1%"}} className="row approver-input-container">
            <div className="col-md-6">
              <Label for="basicpill-email-input4">Select Approver</Label>
              <Input
                type="select"
                name="CATEGORY"
                className="form-control"
              >
                <option value="select">Select</option>
                <option value="UnAssign">Approver-1</option>
                <option value="Assign">Approver-2</option>
              </Input>
            </div>            
            <div style={{marginRight:"5px", marginTop:"1%"}} className="row inner_div">
            <button style={{ backgroundColor: "#323449" }} className="mx-2 col-2 button">
              Add 
            </button>
          </div>
          </div>
    </MainScreenEmployee>
  )
}

export default AddApprover