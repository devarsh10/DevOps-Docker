// Import necessary libraries
import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import Sidenav from "../Dashboard_Com/Sidenav";
import NavBar from "../Dashboard_Com/Navbar";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
// import "../ReferralList/style.css"

// Create a custom theme
const theme = createTheme({
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    action: {
      hover: "#eee",
    },
  },
});

// Define custom styles for table cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Define custom styles for table row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Define table columns
const columns = [
  { id: "id", label: "ID", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "rfname", label: "Name", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 150 },
  { id: "action", label: "Action", minWidth: 150 },
];

function NewReferralAdmin() {
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  // const [showModal, setShowModal] = useState(false);

  // Fetch agents on component mount
  useEffect(() => {
    fetchData();
  }, []);


  // Fetch referrals data from the server
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8001/referrals");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const id = sessionStorage.getItem('id');
      const data = await response.json();
      // Filter the rows to only contain the row with ID '1'
      const filteredRow = data.filter((row) => row.agentid === id && row.status === "In Progress");
      setRows(filteredRow);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  // Handle assigning referral to an agent
  // const handleAssignClick = (row) => {
  //   toggleModal();
  // };

  // Handle completing referral
  const handleCompleteClick = async (row) => {
    try {
      // Send request to mark referral as "Complete"
      const response = await fetch(
        `http://localhost:8001/referrals/${row.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({status:"Completed"}),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to complete referral");
      }
      // Update referral status to "Completed"
      const updatedRows = rows.map((r) =>
        r.id === row.id ? { ...r, status: "Completed" } : r
      );
      setRows(updatedRows);
      // Filter out the completed referral from the rows state
    const filteredRows = rows.filter((r) => r.id !== row.id);
    setRows(filteredRows);

      toast.success("Referral marked as Complete!");
    } catch (error) {
      console.error("Error completing referral:", error);
    }
  };

  // Handle rejecting referral
  const handleRejectClick = async (row) => {
    try {
      // Send request to delete referral
      const response = await fetch(
        `http://localhost:8001/referrals/${row.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({status:"Rejected"}),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete referral from the database");
      }
      // Remove referral from rows
      const updatedRows = rows.map((r) =>
        r.id === row.id ? { ...r, status: "Rejected" } : r
      );
      setRows(updatedRows);
      // Filter out the rejected referral from the rows state
      const filteredRows = rows.filter((r) => r.id !== row.id);
    setRows(filteredRows);
      toast.error("Referral Status Updated!");
    } catch (error) {
      console.error("Error deleting referral:", error);
    }
  };


  // // Handle selecting an agent for referral
  // const handleAgentSelect = async (agent, referralId) => {
  //   try {
  //     const agentId = agent.id;
  //     const response = await fetch(`http://localhost:8001/referrals/${referralId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ agentId, status: "In Progress" }), // Include status update in the body
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to update referral with the selected agent");
  //     }
  //     const updatedRows = rows.map((r) =>
  //       r.id === referralId ? { ...r, status: "In Progress" } : r
  //     );
  //     setRows(updatedRows);
  //     toggleModal();
  //     toast.success("Agent assigned!");
  //   } catch (error) {
  //     console.error("Error updating referral with selected agent:", error);
  //   }
  // };


  // // Toggle modal
  // const toggleModal = () => {
  //   setShowModal(!showModal);
  // };

  // JSX rendering
  return (
    <div className="bgcolor">
      <NavBar />
      <Box height={120} />
      <Box sx={{ display: "flex" }}>
      <Sidenav />
      <ThemeProvider theme={theme}>
        <Container>
          <Paper className="table-container">
            <Typography className="table-heading" variant="h5">
              Referrals
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
                              <div className="btn btn-warning">
                                {row.status}
                              </div>
                            ) : column.id === "action" ? (
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
                                <div className="dropdown-menu">
                                  {row.status === "In Progress" && (
                                    <>
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      onClick={() => handleCompleteClick(row)} // Handle Complete click
                                    >
                                      Complete
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      onClick={() => handleRejectClick(row)} // Handle Reject click
                                    >
                                      Reject
                                    </Link>
                                  </>
                                  )}
                                  {row.status === "Completed" && (
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      onClick={() => handleRejectClick(row)} // Handle Complete click
                                    >
                                      Reject
                                    </Link>
                                  )}
                                  {row.status === "Rejected" && (
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      onClick={() => handleCompleteClick(row)} // Handle Complete click
                                    >
                                      Complete
                                    </Link>
                                  )}
                                </div>
                              </div>
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
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(+event.target.value);
                setPage(0);
              }}
            />
          </Paper>
        </Container>
      </ThemeProvider>
      </Box>
    </div>
  );
}

export default NewReferralAdmin;
