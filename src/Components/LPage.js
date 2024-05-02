import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function LPage() {
  const [role, setRole] = useState("");
  const [id, setID] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("")
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");

  const navigate = useNavigate();
  // useEffect(() => {
  //   sessionStorage.clear();
  // }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const crole = role.toLowerCase();
    if (validate() === true) {
      fetch(`http://localhost:8000/${crole}?email=${email}`)
        .then((res) => res.json())
        .then((resp) => {
          if (Object.keys(resp).length === 0) {
            toast.error("Email not found");
          } else {
            const userId = resp[0].id;
            const userName = resp[0].fname;
            setID(userId);
            setName(userName)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  
  useEffect(() => {
    if (id !== "") {
      const crole = role.toLowerCase();
      fetch(`http://localhost:8000/${crole}/${id}`)
        .then((res) => res.json())
        .then((resp) => {
          if (Object.keys(resp).length === 0) {
            toast.error("Enter valid email id");
          } else {
            if (resp.password === password) {
              if (role === "Admin") {
                navigate("/dashboard");
                toast.success("Logged In!!");
              } else if (role === "Agent") {
                if (resp.status === "Registered") {
                  console.log(resp.status)
                  toast.error("You are not authorized by the admin yet");
                } else {
                  navigate("/dashboard2");
                  toast.success("Logged In!!");
                }
              }
              sessionStorage.setItem("id", id);
              sessionStorage.setItem("username", email);
              sessionStorage.setItem("name", name);
              sessionStorage.setItem("role", role);
              
            } else {
              toast.error("Please enter valid credentials");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, name, role, password, email, navigate]);
  

  const validate = () => {
    let result = true;
    if (email === null || email === "") {
      result = false;
      toast.warning("Please Enter Email");
    }
    if (password === null || password === "") {
      result = false;
      toast.warning("Please Enter Password");
    }
    return result;
  };

  return (
    <>
      <div
        className="container-fluid card bg-light py-3"
        style={{ width: "400px", marginTop: "70px" }}
      >
        <header className="text-center">
          <h1>Log In</h1>
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
              <div className="mb-3">
                <label htmlFor="inputPassword4" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="inputPassword4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-warning btn-lg ms-2">
                Login as {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
              <hr />
              <div className="mb-2">
              <Link to="/"><strong>Don't have an Account? Create account</strong></Link>
              </div>
              <div className="mt-2">
              <Link to="/forpass"><strong>Forgot Password?</strong></Link>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default LPage;
