import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAppStore } from "../../../appStore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"]),
}));

export default function AgentNavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordFromDB, setPasswordFromDB] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showConPassword, setShowConPassword] = useState(false);
  const [conPassword, setConPassword] = useState("");
  const [name,setName] = useState("");

  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const id = sessionStorage.getItem("id");
      const response = await fetch(`http://localhost:8000/agent/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data.password);
      setPasswordFromDB(data.password);
      setName(data.fname)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handlePassword = (e) => {
    setOldPassword(e.target.value); // Update oldPassword state with the value from input
    if (e.target.value !== passwordFromDB) {
      setError("Old password does not match.");
    } else {
      setError(""); // Clear error if old password matches
    }
  };

  const handleNewPassword = (e) => {
    const newPassword = e.target.value
    if (newPassword.length < 8) {
      setNewError("Password must contain at least 8 characters");
    } else if (!/[@$#&*%]/.test(newPassword)) {
      setNewError("Password must contain at least one Special Character");
    } else if (!/[A-Z]/.test(newPassword)) {
      setNewError("Password must contain at least one capital letter");
    } else if (newPassword === oldPassword) {
      setNewError("New Password should not be same as Old one!");
    } else {
      setNewError("");
      console.log(newPassword)
    }
    setNewPassword(newPassword)
  }

  const handleConPassword = (e) => {
    const password = e.target.value;
    setConPassword(password);
    if (newPassword !== password) {
      setConfirmError("Password doesn't match.");
    } else {
      setConfirmError("");
    }
  }

  const handleSaveChange = async (e) => {

    if (error || newError || confirmError) {
      // If there are errors, don't proceed with saving changes
      toast.error("Cannot save changes due to validation errors");
      return;
    }

    const id = sessionStorage.getItem("id");
    await axios
    .patch(`http://localhost:8000/agent/${id}`, {
      password: newPassword,
      cpass: conPassword,
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error("Failed to update password");
      }
      toggleModal()
      toast.success("Password Updated!")
    })
    .catch((error)=>{
      console.error("Error updating password:", error);
    })
    
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const handleProfile = (event) => {
    navigate("/agentprofile");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem onClick={toggleModal}>Change Password</MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/login" style={{ color: "black", textDecoration: "None" }}>
          Log Out
        </Link>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          style={{
            padding: "16",
            backgroundColor: "#121212",
            color: "white",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => updateOpen(!dopen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Agent Portal
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <div
              onClick={handleProfileMenuOpen}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Typography variant="body1" color="inherit" sx={{ ml: 1 }}>
                {name}
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Box>
      <Modal show={showModal} onHide={toggleModal} className="mt-5">
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="field_label">Old Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="inputPassword4"
                value={oldPassword}
                onChange={handlePassword}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash-fill"></i> // Eye slash icon when password is visible
                ) : (
                  <i className="bi bi-eye-fill"></i> // Eye icon when password is hidden
                )}
              </button>
            </div>
            <div className="text-danger">{error}</div>
          </div>
          <div className="form-group">
            <label className="field_label">New Password</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control"
                id="inputPassword5"
                value={newPassword}
                onChange={handleNewPassword}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <i className="bi bi-eye-slash-fill"></i> // Eye slash icon when password is visible
                ) : (
                  <i className="bi bi-eye-fill"></i> // Eye icon when password is hidden
                )}
              </button>
            </div>
            <div className="text-danger">{newError}</div>
          </div>
          <div className="form-group">
            <label className="field_label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConPassword ? "text" : "password"}
                className="form-control"
                id="inputPassword6"
                value={conPassword}
                onChange={handleConPassword}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowConPassword(!showConPassword)}
              >
                {showConPassword ? (
                  <i className="bi bi-eye-slash-fill"></i> // Eye slash icon when password is visible
                ) : (
                  <i className="bi bi-eye-fill"></i> // Eye icon when password is hidden
                )}
              </button>
            </div>
            <div className="text-danger">{confirmError}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
