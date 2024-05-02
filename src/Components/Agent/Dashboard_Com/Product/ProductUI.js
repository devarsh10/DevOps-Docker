import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../../../Style/styles.css";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import AgentNavBar from "../AgentNavbar";
import AgentSidenav from "../AgentSidenav";
import axios from "axios";
import { toast } from "react-toastify";
import { Box } from "@mui/material";

const theme = createTheme({
  palette: {
    common: {
      black: "#000", // Define your black color here
      white: "#fff", // Define your white color here
    },
    action: {
      hover: "#eee", // Define your hover color here
    },
    // Add more palette colors if needed
  },
  // Add other theme customizations as needed
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "pdtdate", label: "Date", minWidth: 150 },
  { id: "brandname", label: "Brand Name", minWidth: 100 },
  { id: "countryorigin", label: "Country Origin", minWidth: 150 },
  { id: "pdtname", label: "Product Name", minWidth: 140 },
  { id: "pdtdesc", label: "Description", minWidth: 130 },
  { id: "image", label: "Image", minWidth: 130 },
  { id: "pdtprice", label: "Price", minWidth: 100 },
  { id: "pdtaction", label: "Action", minWidth: 140 },
];

function ProductUI() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [pdtName, setPdtName] = useState();
  const [pdtDesc, setPdtDesc] = useState();
  const [pdtPrice, setPdtPrice] = useState();
  const [pdtDate, setPdtDate] = useState("");
  const [brandName, setBrandName] = useState("");
  const [countryOrigin, setCountryOrigin] = useState("");
  // const [productId, setProductId] = useState(null); // Added state to track edited product ID
  const productId = 0;
  const [products, setProducts] = useState();
  const [showModal, setShowModal] = useState(false);
  // State to manage productId to delete
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8002/addpdt");
      const agentId = sessionStorage.getItem("id");

      // console.log(res.data)
      const filteredProducts = res.data.filter(
        (entry) => entry.agentid === agentId
      );

      setRows(filteredProducts);
    } catch (err) {
      console.error("Unable to fetch: ", err);
    }
  };

  const handleAddProduct = () => {
    navigate("/addpdt");
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Set showModal to true to show the modal
      setShowModal(true);

      // Set productIdToDelete state to manage which product is being deleted
      setProductIdToDelete(productId);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error deleting product:", error.message);
    }
  };

  const confirmDelete = async () => {
    try {
      // Proceed with deletion logic for the productIdToDelete
      await axios.delete(`http://localhost:8002/addpdt/${productIdToDelete}`);

      // If products is not initialized, initialize it to an empty array
      const updatedProducts = products
        ? products.filter((product) => product.id !== productIdToDelete)
        : [];

      // Update the products state with the filtered products
      setProducts(updatedProducts);

      // Optionally, you can show a success message or perform any other action
      toast.error("Product deleted successfully!");
      console.log("Product deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error deleting product:", error.message);
    } finally {
      // Close the modal after deletion
      setShowModal(false);
      // Reset productIdToDelete state
      setProductIdToDelete(null);
    }
  };

  // const handleEditProduct = (productId) => {
  //   const productToEdit = rows.find((product) => product.id === productId);
  //   setPdtName(productToEdit.pdtname);
  //   setPdtDesc(productToEdit.pdtdesc);
  //   setPdtPrice(productToEdit.pdtprice);
  //   setPdtDate(productToEdit.pdtdate);
  //   setBrandName(productToEdit.brandname);
  //   setCountryOrigin(productToEdit.countryorigin);
  //   setIsEditing(true);
  //   setProductId(productId);
  // };

  // const handleSaveEdit = async (productId) => {
  //   try {
  //     const agentId = sessionStorage.getItem("id");
  //     // const agentName = sessionStorage.getItem("name");

  //     const updatedProduct = {
  //       id: productId,
  //       agentid: agentId,
  //       pdtname: pdtName,
  //       pdtdesc: pdtDesc,
  //       pdtprice: pdtPrice,
  //       pdtdate: pdtDate,
  //       brandname: brandName,
  //       countryorigin: countryOrigin,
  //     };

  //     // Send a PUT request to the server to update the product
  //     await axios.put(
  //       `http://localhost:8002/addpdt/${productId}`,
  //       updatedProduct
  //     );

  //     // Update the product in the UI or the state
  //     // Assuming you have already set up state for 'rows' to manage product data
  //     setRows(
  //       rows.map((row) => {
  //         if (row.id === productId) {
  //           return {
  //             ...row,
  //             pdtname: pdtName,
  //             pdtdesc: pdtDesc,
  //             pdtprice: pdtPrice,
  //           };
  //         }
  //         return row;
  //       })
  //     );

  //     // Reset editing state after successful update
  //     setIsEditing(false);

  //     // Optionally, you can show a success message or perform any other action
  //     toast.success("Product Updated Successfully!");
  //   } catch (error) {
  //     // Handle errors, e.g., show an error message
  //     console.error("Error updating product:", error.message);
  //   }
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const agentName = sessionStorage.getItem("name");

  return (
    <div className="bgcolor">
      <AgentNavBar />
      <Box height={120} />
      <Box sx={{ display: "flex" }}>
        <AgentSidenav />
        <ThemeProvider theme={theme}>
          <Container>
            <Paper className="table-container">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px",
                }}
              >
                <Typography className="table-heading" variant="h5">
                  Products
                </Typography>
                <div>
                  <button
                    className="btn btn-warning"
                    onClick={handleAddProduct}
                  >
                    Add Product
                  </button>
                </div>
              </div>

              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <StyledTableCell
                          key={column.id}
                          align="left"
                          style={{ minWidth: column.minWidth }}
                        >
                          <strong>{column.label}</strong>
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <StyledTableRow key={row.id}>
                          {columns.map((column) => (
                            <StyledTableCell key={column.id} align="left">
                              {column.id !== "id" ? (
                                column.id !== "pdtaction" ? (
                                  column.id === "image" ? ( // Check if it's the Image column
                                    <img
                                      src={row[column.id]}
                                      alt="Product"
                                      style={{ maxWidth: "100px" }}
                                    />
                                  ) : row.id === productId ? (
                                    <input
                                      type={
                                        column.id === "pdtprice"
                                          ? "number"
                                          : "text"
                                      }
                                      className="form-control p-1 m-1"
                                      //I have added, the required code in index.html file.
                                      //So that it will not show the spinner(counter) beside pdtPrice
                                      style={{ fontSize: "15px" }}
                                      value={
                                        column.id === "pdtname"
                                          ? pdtName
                                          : column.id === "pdtdesc"
                                          ? pdtDesc
                                          : column.id === "pdtprice"
                                          ? pdtPrice
                                          : column.id === "pdtdate"
                                          ? pdtDate
                                          : column.id === "agentname"
                                          ? agentName
                                          : column.id === "brandname"
                                          ? brandName
                                          : column.id === "countryorigin"
                                          ? countryOrigin
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        switch (column.id) {
                                          case "pdtname":
                                            setPdtName(inputValue);
                                            break;
                                          case "pdtdesc":
                                            setPdtDesc(inputValue);
                                            break;
                                          case "pdtprice":
                                            // Check if the input value is a valid numeric value
                                            const isValidNumericInput =
                                              /^\d*\.?\d*$/.test(inputValue);
                                            if (
                                              isValidNumericInput ||
                                              inputValue === ""
                                            ) {
                                              // Update the state with the input value
                                              setPdtPrice(inputValue);
                                            } else {
                                              // Display an error message or handle invalid input
                                              alert(
                                                "Please enter a valid numeric value."
                                              );
                                            }
                                            break;
                                          case "pdtdate":
                                            // Check if the input value matches the date format (DD-MM-YYYY)
                                            const isValidDateInput =
                                              /^\d{2}-\d{2}-\d{4}$/.test(
                                                inputValue
                                              );
                                            if (
                                              isValidDateInput ||
                                              inputValue === ""
                                            ) {
                                              // Update the state with the input value
                                              setPdtDate(inputValue);
                                            } else {
                                              // Display an error message or handle invalid input
                                              alert(
                                                "Please enter a valid date in the format DD-MM-YYYY."
                                              );
                                            }
                                            break;
                                          case "brandname":
                                            setBrandName(inputValue);
                                            break;
                                          case "countryorigin":
                                            setCountryOrigin(inputValue);
                                            break;
                                          default:
                                            break;
                                        }
                                      }}
                                    />
                                  ) : (
                                    row[column.id]
                                  )
                                ) : (
                                  <div className="action-icons">
                                    <>
                                      <button
                                        className="btn btn-primary"
                                        // onClick={() =>
                                        //   handleEditProduct(row.id)
                                        // }
                                        onClick={()=>window.location.href=`/editpdt/${row.id}`} // Handle Complete click
                                      >
                                        <i className="bi bi-pencil-fill"></i>
                                      </button>
                                      <i
                                        className="btn btn-danger bi bi-trash m-2"
                                        onClick={() =>
                                          handleDeleteProduct(row.id)
                                        }
                                      ></i>
                                      <div
                                        className={`modal fade ${
                                          showModal ? "show" : ""
                                        }`}
                                        style={{
                                          display: showModal ? "block" : "none",
                                        }}
                                        tabIndex="-1"
                                        role="dialog"
                                      >
                                        <div
                                          className="modal-dialog modal-dialog-centered"
                                          role="document"
                                        >
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h5
                                                className="modal-title"
                                                id="exampleModalLongTitle"
                                              >
                                                Warning Message
                                              </h5>
                                            </div>
                                            <div className="modal-body">
                                              Are you sure you want to delete
                                              this product?
                                            </div>
                                            <div className="modal-footer">
                                              <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() =>
                                                  setShowModal(false)
                                                }
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => confirmDelete()}
                                              >
                                                Yes
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className={`modal-backdrop fade ${
                                          showModal ? "show" : ""
                                        }`}
                                        style={{
                                          display: showModal ? "block" : "none",
                                        }}
                                      ></div>
                                    </>
                                </div>
                                )
                              ) : (
                                row[column.id]
                              )}
                            </StyledTableCell>
                          ))}
                        </StyledTableRow>
                      ))}
                  </TableBody>
                  
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 8, 10]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Container>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default ProductUI;
