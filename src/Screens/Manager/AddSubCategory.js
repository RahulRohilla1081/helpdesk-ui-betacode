import React, { useEffect, useState } from "react";
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
  Button,
} from "@mui/material";
import { Input, Label } from "reactstrap";
import "./AddSubCategory.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AXIOS from "../../Utils/AXIOS";
import axios from "axios";
import Select from "react-select";
import cogoToast from "cogo-toast";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import { ADDSUBCATEGORY } from "../../Utils/Routes";
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

function AddSubCategory() {
  const [category, setCategory] = useState([]);
  const [categorySelected, setCategorySelected] = useState("");
  const [editCategorySelected, setEditCategorySelected] = useState({});
  const [subCat, setSubCat] = useState("");
  const [ClickedRowData, setClickedRowData] = useState(null);
  const [EditModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);
  const getCategoryData = () => {
    axios(AXIOS.defaultPort + AXIOS.getAllCategory).then((res) => {
      let temp = [...res.data];
      temp.map((val) => {
        val.label = val.CATEGORY_NAME;
        val.value = val.CATEGORY_ID;
      });
      console.log("Asdasndksadas", res.data);
      setCategory(temp);
    });
  };
  useEffect(() => {
    getCategoryData();
  }, []);
  const handleUnMapUpdate = (UnMapRow) => {
    let unMapFlag;
    if (UnMapRow?.ACTIVE == true) {
      unMapFlag = false;
    } else {
      unMapFlag = true;
    }
    let payload = { ...UnMapRow, ACTIVE: unMapFlag };

    axios
      .post(AXIOS.defaultPort + AXIOS.updateSub_Category, {
        ...payload,
      })
      .then((res) => {
        cogoToast.success("UnMaped Successfully");
        getCategoryData();

        // setCategory(res.data);
      })
      .catch((err) => {});
  };
  const handleSubCategoryUpdate = () => {
    axios
      .post(AXIOS.defaultPort + AXIOS.updateSub_Category, {
        ...ClickedRowData,
      })
      .then((res) => {
        cogoToast.success("Category Updated");
        getCategoryData();
        handleEditModalClose();
        // setCategory(res.data);
      })
      .catch((err) => {});
  };

  const CreateNewSubCat = () => {
    if (categorySelected == "") {
      toast.error("Please select category");
    } else if (subCat == "") {
      toast.error("Please enter sub category");
    } else {
      axios
        .post(AXIOS.defaultPort + AXIOS.createSub_Category, {
          CATEGORY_ID: categorySelected.value,
          SUB_CATEGORY: subCat,
        })
        .then(() => {
          cogoToast.success("Sub-Category added");
          setCategorySelected({});
          getCategoryData();
          setSubCat("");
        });
    }
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
      name: "Sub Category ID",
      selector: "SUB_CATEGORY_ID",
    },
    {
      name: "Sub Category Name",
      selector: "SUB_CATEGORY_NAME",
    },
    {
      name: "Status",
      selector: "ACTIVE",
    },
  ];
  const handleExcelExport = () => {
    let tempData = [];

    category.map((val) => {
      val.SUB_CATEGORY.map((item) => {
        tempData.push({
          CATEGORY_ID: val.CATEGORY_ID,
          CATEGORY_NAME: val.CATEGORY_NAME,
          ...item,
        });
      });
    });
    let excelData = [...tempData];

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
      saveAs(blob, "SubCategory.csv"); // Use the saveAs function to download the CSV file
    }
  };
  return (
    <MainScreenEmployee drawerWidth={282} Activekey={ADDSUBCATEGORY}>
      <Toaster />
      <div>
        <div
          style={{ marginTop: "3%", marginLeft: "10%", padding: "1%" }}
          className="row subcategory-input-container"
        >
          <div className="col-md-6">
            <Label className="modal-label" for="basicpill-email-input4">
              Category Name<span className="required-filed">*</span>
            </Label>
            <Select
              value={categorySelected}
              options={category}
              onChange={(e) => {
                setCategorySelected(e);
                axios(AXIOS.defaultPort + AXIOS.getAllCategory).then((res) => {
                  let temp = [...res.data];
                  temp.map((val) => {
                    val.label = val.CATEGORY_NAME;
                    val.value = val.CATEGORY_ID;
                  });
                  setCategory(temp);
                });
              }}
            />
          </div>
          <div className="col-md-6">
            <Label className="modal-label" for="basicpill-email-input4">
              Sub Category<span className="required-filed">*</span>
            </Label>
            <Input
              type="text"
              name="SUBCATEGORY"
              className="form-control"
              placeholder="Enter Sub Category"
              value={subCat}
              onChange={(e) => {
                setSubCat(e.target.value);
              }}
            />
          </div>

          <div
            style={{ marginRight: "5px", marginTop: "1%" }}
            className="row subcategory-inner_div"
          >
            <button
              style={{ backgroundColor: "#219bcc" }}
              className="mx-2 col-2 button"
              onClick={() => {
                CreateNewSubCat();
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
                    Cat Name
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    SubCat ID
                  </th>
                  <th
                    sx={{
                      columnWidth: "100%",
                      color: "#2d344b",
                    }}
                  >
                    Sub Cat Description
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
                {category.map((item) => {
                  return item?.SUB_CATEGORY?.map((val) => {
                    return (
                      <>
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
                              <DeleteIcon
                                sx={{ color: "#30344a", height: 20 }}
                              />
                            </div>
                          </td>
                          <td>{item.CATEGORY_NAME}</td>
                          <td>{val.SUB_CATEGORY_ID}</td>
                          <td>{val.SUB_CATEGORY_NAME}</td>
                          <td>{val.ACTIVE ? "Active" : "Inactive"}</td>
                          <td
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleEditModalOpen();
                              setClickedRowData({
                                ...val,
                                CATEGORY_ID: item.CATEGORY_ID,
                              });
                              let tempCat = [...category];
                              let filtered = tempCat.find(
                                (cat) => cat.CATEGORY_ID == item.CATEGORY_ID
                              );
                              setEditCategorySelected(filtered);
                            }}
                          >
                            <EditIcon sx={{ color: "#30344a", height: 20 }} />
                          </td>
                        </tr>
                      </>
                    );
                  });
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Update Sub Category</h4>
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
          {/* <div className="col-md-6"> */}
          <Label className="modal-label" for="basicpill-email-input4">
            Category Name
          </Label>
          <Select
            className="modal-input"
            value={editCategorySelected}
            options={category}
            onChange={(e) => {
              setEditCategorySelected(e);
              let temp = { ...ClickedRowData };
              ClickedRowData.CATEGORY_ID = e.value;
            }}
          />
          {/* </div> */}
          <Label className="modal-label" for="basicpill-email-input4">
            Subcategory Name
          </Label>
          <Input
            type="text"
            // name="CATEGORY"
            className="modal-input"
            placeholder="Enter Category"
            value={ClickedRowData?.SUB_CATEGORY_NAME}
            onChange={(e) => {
              setClickedRowData((prev) => ({
                ...prev,
                SUB_CATEGORY_NAME: e.target.value,
              }));
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
            className="mx-2 col-1 subcategory-button-style"
            onClick={(e) => {
              handleSubCategoryUpdate();
            }}
          >
            Update
          </button>
        </Box>
      </Modal>
    </MainScreenEmployee>
  );
}

export default AddSubCategory;
