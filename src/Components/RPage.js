import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

function RPage() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [role, setRole] = useState("Admin");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [idCounter, setIdCounter] = useState(1);
  const [idCounterAgent, setIdCounterAgent] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await axios.get(
          "https://api.countrystatecity.in/v1/countries",
          {
            headers: {
              "X-CSCAPI-KEY":
                "NnpmYnhnU2dUd3pteGRYMWZRTkFpVklEeVJDU3JtZ0pwblFoUUxOaQ==",
            },
          }
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchStates() {
      if (selectedCountry) {
        try {
          const country = countries.find(
            (country) => country.name === selectedCountry
          );
          if (country) {
            const response = await axios.get(
              `https://api.countrystatecity.in/v1/countries/${country.iso2}/states`,
              {
                headers: {
                  "X-CSCAPI-KEY":
                    "NnpmYnhnU2dUd3pteGRYMWZRTkFpVklEeVJDU3JtZ0pwblFoUUxOaQ==",
                },
              }
            );
            setStates(response.data);
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      }
    }

    fetchStates();
  }, [countries, states, selectedCountry]);

  useEffect(() => {
    async function fetchCity() {
      if (selectedState) {
        try {
          const country = countries.find(
            (country) => country.name === selectedCountry
          );
          const state = states.find((state) => state.name === selectedState);
          if (country && state) {
            const response = await axios.get(
              `https://api.countrystatecity.in/v1/countries/${country.iso2}/states/${state.iso2}/cities`,
              {
                headers: {
                  "X-CSCAPI-KEY":
                    "NnpmYnhnU2dUd3pteGRYMWZRTkFpVklEeVJDU3JtZ0pwblFoUUxOaQ==",
                },
              }
            );
            setCities(response.data);
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      }
    }

    fetchCity();
  }, [states, countries, selectedState, selectedCountry]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/admin")
      .then((response) => {
        const lastId = response.data[response.data.length - 1]?.id;
        setIdCounter(lastId ? parseInt(lastId) + 1 : 1);
      })
      .catch((error) => {
        console.error("Error fetching last ID:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/agent")
      .then((response) => {
        const lastId = response.data[response.data.length - 1]?.id;
        setIdCounterAgent(lastId ? parseInt(lastId) + 1 : 1);
      })
      .catch((error) => {
        console.error("Error fetching last ID:", error);
      });
  }, []);

  const checkExistingEmail = async () => {
    try {
      const adminResponse = await axios.get("http://localhost:8000/admin");
      const adminEmails = adminResponse.data.map((entry) => entry.email);
      if (adminEmails.includes(email)) {
        return true;
      }

      const agentResponse = await axios.get("http://localhost:8000/agent");
      const agentEmails = agentResponse.data.map((entry) => entry.email);
      if (agentEmails.includes(email)) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const emailExists = await checkExistingEmail();
    if (emailExists) {
      toast.warning("Email already exists");
      return;
    }

    axios
      .get("http://localhost:8000/")
      .then(() => {
        if (role === "Agent") {
          alert("Going to agent's db");
          storeDataInAgentDatabase();
        } else if (role === "Admin") {
          alert("Going to admin db");
          storeDataInAdminDatabase();
        } else {
          toast.error("Please select Role");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const storeDataInAdminDatabase = () => {
    let regObj = {
      id: idCounter.toString(),
      fname,
      lname,
      address,
      role,
      country: selectedCountry,
      city: selectedCity,
      state: selectedState,
      contact,
      email,
      password,
      confirmPassword,
      gender,
    };

    axios
      .post("http://localhost:8000/admin/", regObj)
      .then((res) => {
        toast.success("Successfully Registered");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Failed :" + error.message);
      });
  };

  const storeDataInAgentDatabase = () => {
    let regObj = {
      id: idCounterAgent.toString(),
      fname,
      lname,
      address,
      role,
      country: selectedCountry,
      city: selectedCity,
      state: selectedState,
      contact,
      email,
      password,
      confirmPassword,
      gender,
      status: "Registered",
    };

    axios
      .post("http://localhost:8000/agent/", regObj)
      .then((res) => {
        toast.success("Successfully Registered");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Failed :" + error.message);
      });
  };

  const handlePassword = (e) => {
    const newPassword = e.target.value;
    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters");
    } else if (!/[@$#&*%]/.test(newPassword)) {
      setError("Password must contain at least one Special Character");
    } else if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one capital letter");
    } else {
      setError("");
    }
    setPassword(newPassword);
  };
  const handleConfirmPassword = (e) => {
    const newPassword = e.target.value;
    setConfirmPassword(newPassword);
    if (newPassword !== password) {
      setConfirmError("Password doesn't match.");
    } else {
      setConfirmError("");
    }
  };

  // Event handler for country selection
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <>
      <div className="container-fluid bg-dark text-light py-2">
        <header className="text-center">
          <h1>Registration Form</h1>
        </header>
      </div>
      <section className="container card my-4 bg-light p-2">
        <form className="row g-3 p-3" onSubmit={submitHandler}>
          <div className="col-md-4">
            <label htmlFor="validationCustom01" className="form-label">
              First name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="validationCustom01"
              value={fname}
              onChange={(e) => {
                setFname(e.target.value);
              }}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="validationCustom02" className="form-label">
              Last name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="validationCustom02"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="inputRole" className="form-label">
              Role <span className="text-danger">*</span>
            </label>
            <select
              id="inputRole"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option>Choose</option>
              <option>Admin</option>
              <option>Agent</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="inputContact" className="form-label">
              Contact Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              className="form-control"
              id="inputEmail4"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="inputEmail5" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="inputGender4" className="form-label">
              Gender <span className="text-danger">*</span>
            </label>
            <div className="input-group mt-2">
              <input
                type="radio"
                className="form-check-input me-2"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <label className="form-check-label me-3" htmlFor="maleRadio">
                Male
              </label>
              <input
                type="radio"
                className="form-check-input me-2"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <label className="form-check-label me-3" htmlFor="femaleRadio">
                Female
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="inputPassword4" className="form-label">
              Password <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="inputPassword4"
                value={password}
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
          <div className="col-md-6">
            <label htmlFor="inputPassword5" className="form-label">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="inputPassword5"
                value={confirmPassword}
                onChange={handleConfirmPassword}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash-fill"></i> // Eye slash icon when password is visible
                ) : (
                  <i className="bi bi-eye-fill"></i> // Eye icon when password is hidden
                )}
              </button>
            </div>
            <div className="text-danger">{confirmError}</div>
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="1234 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress2" className="form-label">
              Address 2
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress2"
              placeholder="Apartment, studio, or floor"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="inputCountry" className="form-label">
              Country <span className="text-danger">*</span>
            </label>
            <select
              id="inputCountry"
              className="form-select"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="" className="dropdown-item">
                Select Country...
              </option>
              {countries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  className="dropdown-item"
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="inputState" className="form-label">
              State <span className="text-danger">*</span>
            </label>
            <select
              id="inputState"
              className="form-select"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">Select State...</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="inputCity" className="form-label">
              City <span className="text-danger">*</span>
            </label>
            <select
              id="inputCity"
              className="form-select"
              value={selectedCity}
              onChange={handleCityChange}
              required
            >
              <option value="">Select City...</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
            {/* <select
              id="inputCity"
              className="form-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option>Choose...</option>
              <option>...</option>
            </select> */}
          </div>
          <div className="col-12"></div>
          <div className="col-12 d-flex justify-content-center">
            <button type="submit" className="btn btn-warning btn-lg">
              Register as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
            </div>
            <div className="d-flex justify-content-center">
            <Link to="/login"><strong><b>Already have an account? Please Log In</b></strong></Link>
            </div>
        </form>
      </section>
    </>
  );
}

export default RPage;
