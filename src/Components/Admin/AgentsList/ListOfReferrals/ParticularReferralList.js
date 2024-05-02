// Referrals assigned to a particular agent (Code)

// import React from "react";

// export default function ParticularReferralList(){
//     return(
//         <>
//             <h2>Hello</h2>
//         </>
//     )
// }

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
import NavBar from "../../Dashboard_Com/Navbar";
import Sidenav from "../../Dashboard_Com/Sidenav";
import { useParams } from "react-router-dom";
import "../../style.css";
import { Box } from "@mui/material";

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
  
];

export default function ParticularReferralList() {
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const { agentId } = useParams(); // Access agentId from URL parameter
//   const [agents, setAgents] = useState([]);
//   const [selectedAgentId, setSelectedAgentId] = useState(null);

  
  // Fetch referrals related to the agentId
  useEffect(() => {
    fetchReferrals(agentId);
  }, [agentId]);

  const fetchReferrals = async (agentId) => {
    try {
      const response = await fetch(
        `http://localhost:8001/referrals?agentid=${agentId}`, // Use agentId to fetch referrals
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }
      console.log(response)      
      const referralData = await response.json();
      setRows(referralData);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };


  // JSX rendering
  return (
    <div className="bgcolor">
      <NavBar />
      <Box height={120} />
      <Box sx={{ display: "flex", marginRight:"150px" }}>
      <Sidenav />
      {/* Render referral list */}
      <ThemeProvider theme={theme}>
        <Container>
          <Paper className="table-container">
            <Typography className="table-heading" variant="h5">
              Referrals related to the Agent you clicked!
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
                                className={`btn ${
                                  row.status === "New"
                                    ? "btn-success"
                                    : row.status === "In Progress"
                                    ? "btn-warning"
                                    : row.status === "Completed"
                                    ? "btn-success"
                                    : "btn-danger"
                                }`}
                              >
                                {row.status}
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
