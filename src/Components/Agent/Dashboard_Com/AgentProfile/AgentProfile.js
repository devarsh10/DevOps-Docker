import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  // MDBBtn,
  // MDBBreadcrumb,
  // MDBBreadcrumbItem,
  // MDBProgress,
  // MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import axios from "axios";
import AgentNavBar from "../AgentNavbar";
import AgentSidenav from "../AgentSidenav";
import { Box } from "@mui/material";

export default function AgentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState();
  const [fname, setFirstName] = useState();
  const [lname, setLastName] = useState();
  const [email, setEmail] = useState();
  const [contact, setContact] = useState();
  const [address, setAddress] = useState();

  useEffect(() => {
    // Fetch data from the endpoint when the component mounts
    const id = sessionStorage.getItem("id");
    axios
      .get(`http://localhost:8000/agent/${id}`)
      .then((response) => {
        const agentData = response.data;
        setFirstName(agentData.fname);
        setLastName(agentData.lname);
        setEmail(agentData.email);
        setContact(agentData.contact);
        setAddress(agentData.address);
      })
      .catch((error) => {
        console.error("Error fetching agent data:", error);
      });
  }, [id]);

  function capitalizeFirstLetter(string) {
    if (string && string.length > 0) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return string; // return the string as is if it's undefined or empty
    }
  }

  const updatedDetails = {
    fname: fname,
    lname: lname,
    email: email,
    contact: contact,
    address: address,
    // Add more fields as needed
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
    axios
      .patch(`http://localhost:8000/agent/${id}`, updatedDetails)
      .then((response) => {
        console.log("Details updated successfully:", response.data);
        // Optionally, you can perform additional actions after successful update
      })
      .catch((error) => {
        console.error("Error updating details:", error);
        // Optionally, handle errors or display a message to the user
      });
  };

  return (
    <>
      {/* <div className="container-fluid bg-dark text-light py-3">
        <header className="text-center">
          <h1>Profile Page</h1>
        </header>
      </div> */}
      <div className="bgcolor">
        <AgentNavBar />
        <Box height={80} />
        <AgentSidenav />
        <section style={{ marginLeft: "15em" }}>
          <div className="container d-flex justify-content-end p-4">
            {isEditing ? (
              <>
                <button className="btn btn-warning" onClick={handleSaveClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="19"
                    fill="currentColor"
                    className="bi bi-floppy-fill me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"></path>
                    <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"></path>
                  </svg>
                  Save
                </button>
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: "10px" }}
                  onClick={() => setIsEditing(false)}
                >
                  <i className="bi bi-x-circle-fill pe-2"></i>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-warning p-2" onClick={handleEditClick}>
                <i className="bi bi-pencil-fill me-2"></i>
                Edit
              </button>
            )}
          </div>

          <MDBContainer className="py-2">
            <MDBRow>
              <MDBCol lg="4">
                <MDBCard className="mb-4">
                  <MDBCardBody className="text-center">
                    {/* <MDBCardImage
                    src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: "150px", maxWidth: "100%", height: "auto" }}
                    fluid
                  /> */}
                    <div className=" d-flex justify-content-center text-center align-items-center">
                      <div
                        className="rounded-circle image-fluid"
                        style={{
                          width: "100px",
                          height: "100px",
                          background:"lightgrey",
                        }}
                      >
                        <div style={{marginTop:'12px'}}>
                        <b style={{ fontSize: '50px', color: 'white' }}>
                        {fname ? fname.charAt(0).toUpperCase() : ""}
                        {lname ? lname.charAt(0) : ""}
                          </b>
                          </div>
                      </div>
                    </div>
                    <p className="text-muted mt-2">
                      {capitalizeFirstLetter(fname)}
                    </p>
                    {/* <p className="text-muted mb-2">Complete Profession</p> */}
                  </MDBCardBody>
                </MDBCard>

                {/* Remove below card if not needed*/}
                {/* <MDBCard className="mb-lg-0">
                <MDBCardBody className="p-3">
                  <MDBListGroup className="rounded-3">
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fas icon="globe fa-lg text-warning" />
                      <MDBCardText>Add remaining</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="github fa-lg"
                        style={{ color: "#333333" }}
                      />
                      <MDBCardText>information</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="twitter fa-lg"
                        style={{ color: "#55acee" }}
                      />
                      <MDBCardText>if not,</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="instagram fa-lg"
                        style={{ color: "#ac2bac" }}
                      />
                      <MDBCardText>remove this</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="facebook fa-lg"
                        style={{ color: "#3b5998" }}
                      />
                      <MDBCardText>Card</MDBCardText>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard> */}
                {/* Remove above card if not needed*/}
              </MDBCol>
              <MDBCol lg="8">
                <MDBCard
                  className="container card p-4"
                  style={{ height: "608px" }}
                >
                  <MDBCardBody>
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText className="font-weight-bold mb-0">
                          First Name
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            value={fname}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        ) : (
                          <MDBCardText className="text-muted">
                            {capitalizeFirstLetter(fname)}
                          </MDBCardText>
                        )}
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText className="font-weight-bold mb-0">
                          Last Name
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            value={lname}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        ) : (
                          <MDBCardText className="text-muted">
                            {capitalizeFirstLetter(lname)}
                          </MDBCardText>
                        )}
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText className="font-weight-bold mb-0">
                          Email
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        <MDBCardText className="text-muted">
                          {email}
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText className="font-weight-bold mb-0">
                          Contact
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-control"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                          />
                        ) : (
                          <MDBCardText className="text-muted">
                            {contact}
                          </MDBCardText>
                        )}
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol sm="3">
                        <MDBCardText className="font-weight-bold mb-0">
                          Address
                        </MDBCardText>
                      </MDBCol>
                      <MDBCol sm="9">
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        ) : (
                          <MDBCardText className="text-muted">
                            {address}
                          </MDBCardText>
                        )}
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                  <hr />
                  <MDBCardText className="text-end mt-3">
                    <a href="/dashboard2" className="btn btn-warning">
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Dashboard
                    </a>
                  </MDBCardText>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </div>
    </>
  );
}
