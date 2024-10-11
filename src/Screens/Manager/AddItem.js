import React, { useEffect, useState } from "react";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import { Input, Label } from "reactstrap";
import CloseIcon from "@mui/icons-material/Close";
import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  TableRow,
  Modal,
  Button,
  Box,
  Divider,
} from "@mui/material";
import "./AddItem.css";

import Select from "react-select";
import axios from "axios";
import AXIOS from "../../Utils/AXIOS";
import toast, { Toaster } from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { borderRadius, display } from "@mui/system";
import { ADDITEM } from "../../Utils/Routes";
import { saveAs } from "file-saver";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "2%",
  boxShadow: 24,
  p: 3,
};

function AddTechnician() {
  const [ClientData, setClientData] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);
  const [SubCategoryData, setSubCategoryData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [Tbody, setTbody] = useState([]);
  useEffect(() => {
    getAllClient();
    getAllCategory();
    getAllUser();
    getAllEmployees();
    getItemsData();
  }, []);

  const technicianArr = [
    { label: "Technician-1", value: "Technician-1" },
    { label: "Technician-2", value: "Technician-2" },
  ];

  const [technicianData, setTechnicianData] = useState({
    CLIENT_ID: "",
    CATEGORY_ID: "",
    SUB_CATEGORY_ID: "",
    ITEM: "",
  });

  const [ClickedRowData, setClickedRowData] = useState(null);

  const [EditModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);
  const getAllClient = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllClient).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.CLIENT_NAME, value: val.CLIENT_ID, ...val });
      });
      setClientData(temp);
    });
  };
  const getAllUser = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllUser).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.USER_NAME, value: val.USER_ID, ...val });
      });

      setUserData(temp);
    });
  };
  const getItemsData = () => {
    //correct API
    axios.get(AXIOS.defaultPort + AXIOS.getItem).then((response) => {
      // SUB_CATEGORY
      // CATEGORY;

      let temp = [];

      response.data.sort((a, b) => b.CATEGORY - a.CATEGORY);
      response.data.sort((a, b) => b.SUB_CATEGORY - a.SUB_CATEGORY);

      // response.data.map((val) => {
      //   temp.push({ label: val.EMP_ID, value: val.EMP_NAME, ...val });
      // });

      setTechnician(response.data);
    });
  };
  const getAllEmployees = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllEmployess).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.EMP_NAME, value: val.EMP_ID, ...val });
      });

      setEmployees(temp);
    });
  };
  const getAllCategory = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllCategory).then((response) => {
      let temp = [];
      response.data.map((val) => {
        temp.push({ label: val.CATEGORY_NAME, value: val.CATEGORY_ID, ...val });
      });
      setCategoryData(temp);
    });
  };

  const getSubCategory = async (Category) => {
    let mainData = [];
    await axios
      .get(AXIOS.defaultPort + AXIOS.getSubCategory + Category)
      .then((response) => {
        let temp = [];
        response.data.SUB_CATEGORY.map((val) => {
          temp.push({
            label: val.SUB_CATEGORY_NAME,
            value: val.SUB_CATEGORY_ID,
            ...val,
          });
        });
        mainData = temp;
        setSubCategoryData(temp);
      });
    return mainData;
  };

  const handleSubmit = () => {
    let payload = {
      ITEM_NAME: technicianData.ITEM_NAME,
      CATEGORY: technicianData?.CATEGORY_ID?.value,
      SUB_CATEGORY: technicianData.SUB_CATEGORY_ID.value,
    };

    if (technicianData.CATEGORY_ID == "") {
      toast.error("Please select category");
    } else if (technicianData.SUB_CATEGORY_ID == "") {
      toast.error("Please select sub category");
    } else if (technicianData.ITEM_NAME.trim() == "") {
      toast.error("Please enter Item");
    } else {
      axios
        .post(AXIOS.defaultPort + AXIOS.createItem, {
          ...payload,
        })
        .then((response) => {
          setTechnicianData({
            CLIENT_ID: "",
            CATEGORY_ID: "",
            SUB_CATEGORY_ID: "",
            ITEM_NAME: "",
          });

          toast.success("Item added");
          getItemsData();
        });
    }
  };
  const handleItemUpdate = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.updateItem + ClickedRowData.ITEM_ID, {
        ITEM_NAME: ClickedRowData.ITEM_NAME,
        CATEGORY: ClickedRowData.CATEGORY,
        SUB_CATEGORY: ClickedRowData.SUB_CATEGORY.value,
      })
      .then((response) => {
        toast.success("Updated");
        getItemsData();
        handleEditModalClose();
      });
  };
  const handleItemDelete = (ClickedRowData) => {
    axios
      .post(AXIOS.defaultPort + AXIOS.deleteItem + ClickedRowData.ITEM_ID)
      .then((response) => {
        toast.success("UnMapped");
        getItemsData();
      });
  };

  const handleClickRow = (data) => {
    // delete tempData.SUBCATEGORY_ID

    getSubCategory(data.CATEGORY).then((response) => {
      let tempData = { ...data };

      const subCatData = response.find((val) => {
        return val.value === data.SUB_CATEGORY;
      });
      tempData.SUB_CATEGORY = subCatData;
      setClickedRowData(tempData);
    });
  };
    const CsvHeader = [
      {
        name: "Category ID",
        selector: "CATEGORY",
      },
      {
        name: "Category Name",
        selector: "CATEGORY_NAME",
      },
      {
        name: "Sub Category ID",
        selector: "SUB_CATEGORY",
      },
      {
        name: "Sub Category Name",
        selector: "SUB_CATEGORY_NAME",
      },
      {
        name: "Item ID",
        selector: "ITEM_ID",
      },
      {
        name: "Item Name",
        selector: "ITEM_NAME",
      },
    
    ];
  const handleExcelExport = () => {
   
    let excelData = [...technician];

    console.log("Asdhasdbhjsadasd", excelData);

    if (excelData.length > 0) {
      // Exclude the "Action" column from csvColumns
      const csvColumns = CsvHeader.filter(
        (column) => column.name !== "Action"
      ).map((column) => column.name);

      const csvRows = excelData.map((item) =>
        csvColumns.map((columnName) => {
          const column = CsvHeader.find((col) => col.name === columnName);
          if (column) {
            let cellValue = "";
            if (typeof column.name === "function") {
              cellValue = column.selector(item);
            } else {
              if (column.name == "Status") {
                cellValue =
                  item[column.selector] == true ? "Active" : "Inactive";
              } else {
                cellValue = item[column.selector] || "";
              }
            }
            // Wrap cell value in double quotes to handle commas
            return `"${cellValue}"`;
          }
          return ""; // Return an empty value for excluded columns
        })
      );
      const csvContent =
        csvColumns.join(",") +
        "\n" +
        csvRows.map((row) => row.join(",")).join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8",
      });
      saveAs(blob, "Item.csv"); // Use the saveAs function to download the CSV file
    }
  };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADDITEM}>
      <Toaster />
      <div className="item-input-container">
        <div className="row item-sub-input-container">
          {/* <div className="col-md-4">
            <Label for="basicpill-email-input4">Client</Label>
            <Select
              options={ClientData}
              value={technicianData.CLIENT_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  CLIENT_ID: e,
                }));
              }}
            />
          </div> */}
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Category Name<span className="required-filed">*</span>
            </Label>
            <Select
              options={CategoryData}
              value={technicianData.CATEGORY_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  CATEGORY_ID: e,
                }));

                getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Sub Category<span className="required-filed">*</span>
            </Label>
            <Select
              options={SubCategoryData}
              value={technicianData.SUB_CATEGORY_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  SUB_CATEGORY_ID: e,
                }));

                // getSubCategory(e.value);
              }}
            />
          </div>
          <div className="col-md-4">
            <Label className="modal-label" for="basicpill-email-input4">
              Item<span className="required-filed">*</span>
            </Label>
            <Input
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Item"
              value={technicianData.ITEM_NAME}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  ITEM_NAME: e.target.value,
                }));
              }}
            />
            {/* <Select
              options={employees}
              value={technicianData.EMP_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  EMP_ID: e,
                }));
 
                // getSubCategory(e.value);
              }}
            /> */}
          </div>
        </div>
        <div className="row company-sub-input-container">
          {/* <div className="col-md-4">
            <Label for="basicpill-email-input4">Technician</Label>
            <Select
              options={employees}
              value={technicianData.EMP_ID}
              onChange={(e) => {
                setTechnicianData((prev) => ({
                  ...prev,
                  EMP_ID: e,
                }));
 
                // getSubCategory(e.value);
              }}
            />
          </div> */}
        </div>

        <div style={{ marginRight: "5px" }} className="row item-inner_div">
          <button
            style={{ backgroundColor: "#219bcc" }}
            className="mx-2 col-1 item-button-style"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
        </div>

        <div className="item-table">
          <div className="m-2 d-flex justify-content-end">
            <button
              style={
                {
                  // marginRight: 10,
                }
              }
              onClick={() => {
                handleExcelExport();
              }}
              className="signup-button"
            >
              Excel Export
            </button>
          </div>
          <TableContainer>
            <Table aria-label="customized table" stickyHeader>
              <TableHead className="scroll-effect">
                <tr>
                  {/* <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Client
                  </th> */}

                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    UnMap
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Category
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Sub category
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Item ID
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Item Name
                  </th>

                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </TableHead>

              <TableBody>
                {technician?.map((item) => {
                  return (
                    <tr className="tr">
                      {/* <td>{item.CLIENT_ID}</td> */}
                      <td>
                        <DeleteIcon
                          sx={{ color: "#30344a", height: 20 }}
                          onClick={() => {
                            handleItemDelete(item);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </td>
                      <td>{item.CATEGORY_NAME}</td>
                      <td>{item.SUB_CATEGORY_NAME}</td>
                      <td>{item.ITEM_ID}</td>
                      <td>{item.ITEM_NAME}</td>
                      <td>
                        <EditIcon
                          onClick={() => {
                            handleEditModalOpen();
                            // setClickedRowData(val);
                            handleClickRow(item);
                          }}
                          style={{
                            cursor: "pointer",
                            height: 20,
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Modal
        open={EditModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Label for="basicpill-email-input4">Client</Label>
          <Select
            options={ClientData}
            value={ClickedRowData?.CLIENT_ID}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                CLIENT_ID: e,
              }));
            }}
          /> */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Update Item</h4>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={handleEditModalClose}
            />
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: "#d3d3d3",
              marginBottom: "2%",
            }}
          />
          <Label className="modal-label" for="basicpill-email-input4">
            Category Name
          </Label>
          <Select
            className="modal-input"
            options={CategoryData}
            value={CategoryData.find(
              (val) => val.value == ClickedRowData?.CATEGORY
            )}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                CATEGORY: e.value,
              }));

              getSubCategory(e.value);
            }}
          />
          <Label className="modal-label" for="basicpill-email-input4">
            Sub Category
          </Label>
          <Select
            className="modal-input"
            options={SubCategoryData}
            // value={ClickedRowData?.SUB_CATEGORY_ID}
            value={ClickedRowData?.SUB_CATEGORY}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,

                SUB_CATEGORY: e,
              }));

              // getSubCategory(e.value);
            }}
          />
          {/* <div className="col-md-4">
            <Label for="basicpill-email-input4">Company Name</Label>
            <Input
              type="text"
              name="COMPANYNAME"
              className="form-control"
              placeholder="Enter Company Name"
              value={CompanyCreateData.COMPANY_NAME}
              onChange={(e) => {
                setCompanyCreateData((prev) => ({
                  ...prev,
                  COMPANY_NAME: e.target.value,
                  COMPANY_NAME_ERROR_FLAG: false,
                }));
              }}
            />
          </div> */}
          <Label className="modal-label" for="basicpill-email-input4">
            Item
          </Label>

          {/* <Select
            options={employees}
            value={employees.find(
              (item) => item.value === ClickedRowData?.EMP_ID
            )}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                EMP_ID: e,
              }));
 
              // getSubCategory(e.value);
            }}
          /> */}
          <Input
            type="text"
            name="SUBCATEGORY"
            className="modal-input"
            placeholder="Enter Item"
            value={ClickedRowData?.ITEM_NAME}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                ITEM_NAME: e.target.value,
              }));

              // getSubCategory(e.value);
            }}
          />
          <button
            style={{
              backgroundColor: "#219bcc",
              marginTop: 15,
              padding: "2%",
              margin: "2%",
              width: "30%",
            }}
            className="col item-button-style"
            // sx={{ mt: 1 }}
            onClick={(e) => {
              handleItemUpdate();
            }}
          >
            Update
          </button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

export default AddTechnician;
