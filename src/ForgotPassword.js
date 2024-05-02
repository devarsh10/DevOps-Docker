import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const OTP = Math.floor(Math.random() * 9000 + 1000);
  // console.log(OTP);

  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    const crole = role.toLowerCase();
    console.log(crole)
    fetch(`http://localhost:8000/${crole}?email=${email}`)
      .then((res) => res.json())
      .then((resp) => {
        if (Object.keys(resp).length === 0) {
          toast.error("Email not found");
        } else {
          const userId = resp[0].id;
          const email = resp[0].email;
          const password = resp[0].password;
          sessionStorage.setItem("id", userId);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("password", password);
          sessionStorage.setItem("otp", OTP);

          axios.post("http://localhost:5000/send_recovery_email", {
            OTP: OTP,
            recipient_email: email,
          });

          toast.success("OTP Sent!");
          navigate("/otp");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div
        className="container-fluid card bg-light py-3"
        style={{ width: "400px", marginTop: "70px" }}
      >
        <header className="text-center">
          <h1>Forgot Password</h1>
        </header>

        <section className="container d-flex justify-content-center">
          <form className="row g-3 p-2" onSubmit={submitHandler}>
            <div className="col">
              <div className="mb-3">
                <label htmlFor="inputRole" className="form-label">
                  Role <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="inputRole"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option>--Choose Role--</option>
                  <option>Admin</option>
                  <option>Agent</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="inputEmail4" className="form-label">
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail4"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-warning btn-lg ms-2">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default ForgotPassword;
