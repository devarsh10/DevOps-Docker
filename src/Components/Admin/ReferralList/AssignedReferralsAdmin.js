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
import NavBar from "../Dashboard_Com/Navbar";
import Sidenav from "../Dashboard_Com/Sidenav";
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
//   { id: "action", label: "Action", minWidth: 150 },
];

function AssignedReferralAdminList() {
  // State variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

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
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // JSX rendering
  return (
    <div className="bgcolor">
      {/* Render navbar */}
      <NavBar />

      {/* Render sidenav */}
      <Box height={120} />
      <Box sx={{ display: "flex", marginRight:"150px" }}>
      <Sidenav />
      {/* Render referral list */}
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
                  .filter(row => row.status === "In Progress")
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <StyledTableRow key={row.id}>
                        {columns.map((column) => (
                          <StyledTableCell key={column.id} align="left">
                            {column.id === "status" ? (
                              <div
                                className={`btn btn-warning`}
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

export default AssignedReferralAdminList;
