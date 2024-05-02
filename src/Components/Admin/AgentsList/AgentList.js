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
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Link } from "react-router-dom";
import NavBar from "../Dashboard_Com/Navbar";
import Sidenav from "../Dashboard_Com/Sidenav";
import { Box } from "@mui/material";
import "../../Style/styles.css"

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
    fontSize: 14,
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
  { id: "id", label: "ID", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "fname", label: "Name", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 150 },
  { id: "action", label: "Action", minWidth: 150 },
];
function AgentList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/agent");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //Handle View Click

  const handleStatusChange = async (id, newStatus) => {
    // const newStatus = event.target.value;
    console.log("newStatus: ", newStatus);
    console.log("id: ", id)

    // Log the structure of each row
    console.log("Row structure:");
    rows.forEach((row) => {
      console.log(row);
    });

    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        console.log("Matching row found with id:", id);
        return { ...row, status: newStatus };
      }
      return row;
    });

    console.log("Updated rows:", updatedRows);
    setRows(updatedRows);

    try {
      const response = await fetch(`http://localhost:8000/agent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedRows.find((row) => row.id === id) }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  return (
    <div className="bgcolor">
      <NavBar/>
      <Box height={120} />
      <Box sx={{ display: "flex", marginRight:"150px" }}>
      <Sidenav />
      <ThemeProvider theme={theme}>
        <Container>
          <Paper className="table-container">
            <Typography className="table-heading" variant="h5">
              Agents
            </Typography>
            <Divider />
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <StyledTableRow key={row.id}>
                        {columns.map((column) => (
                          <StyledTableCell key={column.id} align="left">
                            {column.id === "status" ? (
                              <div
                                className={`status-${row.status.toLowerCase()}`}
                              >
                                {row.status}
                              </div>
                            ) : column.id === "action" ? (
                              row.status === "Inactive" ? (
                                <Typography variant="body2">N/A</Typography>
                              ) : (
                                <div className="btn-group">
                                  <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    Action
                                  </button>
                                  <div className="dropdown-menu zindex-dropdown">
                                    {row.status === "Registered" ? (
                                      <>
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          onClick={() =>
                                            handleStatusChange(
                                              row.id,
                                              "Active"
                                            )
                                          }
                                        >
                                          Approve
                                        </Link>
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          onClick={() =>
                                            handleStatusChange(
                                              row.id,
                                              "Inactive"
                                            )
                                          }
                                        >
                                          Decline
                                        </Link>
                                        <Divider
                                          style={{ border: "solid black 1px" }}
                                        />
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          onClick={()=>window.location.href=`/preflist/${row.id}`} // Handle Complete click
                                        >
                                          <RemoveRedEyeIcon className="me-1" />
                                          View
                                        </Link>
                                      </>
                                    ) : row.status === "Active" ? (
                                      <>
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          onClick={() =>
                                            handleStatusChange(
                                              row.id,
                                              "Deactive"
                                            )
                                          }
                                        >
                                          Deactivate
                                        </Link>
                                        <Divider
                                          style={{ border: "solid black 1px" }}
                                        />
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          onClick={()=>window.location.href=`/preflist/${row.id}`} // Handle Complete click
                                        >
                                          <RemoveRedEyeIcon className="me-1" />
                                          View
                                        </Link>
                                      </>
                                    ) : (
                                      <>
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          onClick={() =>
                                            handleStatusChange(
                                              row.id,
                                              "Active"
                                            )
                                          }
                                        >
                                          Activate
                                        </Link>
                                        <Divider
                                          style={{ border: "solid black 1px" }}
                                        />
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          onClick={()=>window.location.href=`/preflist/${row.id}`} // Handle Complete click
                                        >
                                          <RemoveRedEyeIcon className="me-1" />
                                          View
                                        </Link>
                                      </>
                                    )}
                                  </div>
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

export default AgentList