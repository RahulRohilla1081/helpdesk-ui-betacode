import React, { useState, useEffect } from "react";
import "./AddCategory.css";
import MainScreenEmployee from "../../components/AppDrawer/MainScreenEmployee";
import {
  Table,
  TableBody,
  TableContainer,
  th,
  tr,
  TableHead,
  TableRow,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Input, Label } from "reactstrap";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { saveAs } from "file-saver";

import { ADDCATEGORY } from "../../Utils/Routes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function AddCategory() {
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const [ClickedRowData, setClickedRowData] = useState(null);
  const [CategoryName, setCategoryName] = useState({
    CATEGORY_NAME: "",
    ERROR_FLAG: false,
  });
  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);

  const [category, setCategory] = useState([]);
  useEffect(() => {
    getCategoryData();
  }, []);

  const getCategoryData = () => {
    axios.get(AXIOS.defaultPort + AXIOS.getAllCategory).then((res) => {
      setCategory(res.data);
    });
  };

  const handleCategoryUpdate = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.updateCategory, {
        ...ClickedRowData,
      })
      .then((res) => {
        toast.success("Category Updated");
        getCategoryData();
        handleEditModalClose();
        // setCategory(res.data);
      })
      .catch((err) => {});
  };
  const CreateNewCategory = () => {
    if (CategoryName.CATEGORY_NAME != "") {
      axios
        .post(AXIOS.defaultPort + AXIOS.createCategory, {
          CATEGORY_NAME: CategoryName.CATEGORY_NAME,
        })
        .then((res) => {
          toast.success("Category Created");
          getCategoryData();

          setCategoryName({
            CATEGORY_NAME: "",
            ERROR_FLAG: false,
          });
        })
        .catch((err) => {});
    } else {
      setCategoryName((prev) => ({
        ...prev,
        ERROR_FLAG: true,
      }));
    }
  };

  const handleUnMapUpdate = (UnMapRow) => {
    let unMapFlag;
    if (UnMapRow?.ACTIVE == true) {
      unMapFlag = false;
    } else {
      unMapFlag = true;
    }
    let payload = { ...UnMapRow, ACTIVE: unMapFlag };

    axios
      .post(AXIOS.defaultPort + AXIOS.updateCategory, {
        ...payload,
      })
      .then((res) => {
        toast.success("UnMaped Successfully");
        getCategoryData();

        // setCategory(res.data);
      })
      .catch((err) => {});
  };
  const CsvHeader = [
    {
      name: "Category ID",
      selector: "CATEGORY_ID",
    },
    {
      name: "Category Name",
      selector: "CATEGORY_NAME",
    },
    {
      name: "Status",
      selector: "ACTIVE",
    },
  ];
  const handleExcelExport = () => {
    let excelData = [...category];
    // excelData.map((val) => {
    //   let pending = [];
    //   val.PRIORITY = constants.priorityText[val.PRIORITY];
    //   val.PENDING_WITH.map((pendg) => {
    //     pending.push(pendg.USER_NAME);
    //   });
    //   val.PENDING_WITH = pending;
    // });
    // console.log(
    //   "jhsfgjsgf",
    //   excelData.filter((val) => val.TICKET_ID == "100042")
    // );
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
              } else if (column.selector == "LOGGED_DATE") {
                cellValue =
                  new Date(item[column.selector]).toDateString() || "";
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
      saveAs(blob, "Category.csv"); // Use the saveAs function to download the CSV file
    }
  };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADDCATEGORY}>
      <Toaster />
      <div
        style={{ marginTop: "3%", marginLeft: "20%" }}
        className="row category-input-container"
      >
        <div className="col-md-6">
          <Label for="basicpill-email-input4">
            Category<span className="required-filed">*</span>
          </Label>
          <Input
            type="text"
            name="CATEGORY"
            className="form-control"
            value={CategoryName.CATEGORY_NAME}
            placeholder="Enter Category"
            onChange={(e) => {
              setCategoryName({
                CATEGORY_NAME: e.target.value,
                ERROR_FLAG: false,
              });
            }}
          />
          {CategoryName.ERROR_FLAG && (
            <p
              style={{
                color: "red",
              }}
            >
              Please fill Category Name{" "}
            </p>
          )}
        </div>

        <div style={{ marginRight: "5px" }} className="row category-inner_div">
          <button
            style={{ backgroundColor: "#219bcc" }}
            className="mx-2 col-2 button"
            onClick={() => {
              CreateNewCategory();
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="category-table">
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
        <TableContainer sx={{ minHeight: "60vh" }}>
          <Table
            // className="table"
            // sx={{minHeight:"80vh", maxHeight:"100vh"}}
            aria-label="customized table"
            stickyHeader
          >
            <TableHead className="scroll-effect">
              <tr>
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
                  Category ID
                </th>
                <th
                  sx={{
                    columnWidth: "100%",
                    color: "#2d344b",
                  }}
                >
                  Category Name
                </th>
                <th
                  sx={{
                    columnWidth: "100%",
                    color: "#2d344b",
                  }}
                >
                  Status
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
              {category.map((val) => {
                return (
                  <tr>
                    <td
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <div
                        onClick={() => {
                          handleUnMapUpdate(val);
                        }}
                      >
                        <DeleteIcon sx={{ color: "#30344a", height: 20 }} />
                      </div>
                    </td>
                    <td style={{ fontSize: 14 }}>{val.CATEGORY_ID}</td>
                    <td style={{ fontSize: 14 }}>{val.CATEGORY_NAME}</td>
                    <td style={{ fontSize: 14 }}>
                      {val.ACTIVE ? "Active" : "Inactive"}
                    </td>
                    <td
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleEditModalOpen();
                        setClickedRowData(val);
                      }}
                    >
                      <EditIcon sx={{ color: "#30344a", height: 18 }} />
                    </td>
                  </tr>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal
        open={EditModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Label for="basicpill-email-input4">Category Name</Label>
          <Input
            type="text"
            // name="CATEGORY"
            className="form-control"
            placeholder="Enter Category"
            value={ClickedRowData?.CATEGORY_NAME}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                CATEGORY_NAME: e.target.value,
              }));
            }}
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={(e) => {
              handleCategoryUpdate();
            }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

export default AddCategory;
