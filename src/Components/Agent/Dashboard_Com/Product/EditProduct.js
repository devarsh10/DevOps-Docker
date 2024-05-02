import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AgentNavBar from "../AgentNavbar";
import { Box } from "@mui/material";
import AgentSidenav from "../AgentSidenav";
// import defaultImage from "../../../../images/download.png";
import { Form } from "react-bootstrap";

function EditProduct() {
  const [pdtName, setPdtName] = useState("");
  const [pdtDesc, setPdtDesc] = useState("");
  const [pdtPrice, setPdtPrice] = useState("");
  const [pdtDate, setPdtDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  // const [agentName, setAgentName] = useState("");
  const [brandName, setBrandName] = useState("");
  let [image, setImage] = useState();
  // const [countryOrigin, setCountryOrigin] = useState("");

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { pdtId } = useParams();
  const navigate = useNavigate();

   useEffect(() => {
    fetchReferrals(pdtId);
  }, [pdtId]);

  const fetchReferrals = async (pdtId) => {
    try {
      const response = await fetch(
        `http://localhost:8002/addpdt?id=${pdtId}`, // Use agentId to fetch referrals
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
      const referralData = await response.json();
      // console.log(referralData);

      const parts = referralData[0].pdtdate.split("-");
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      setPdtName(referralData[0].pdtname);
      setPdtDesc(referralData[0].pdtdesc);
      setPdtPrice(referralData[0].pdtprice);
      setPdtDate(formattedDate);
      setBrandName(referralData[0].brandname);
      setImage(referralData[0].image);
      // console.log(image)
      setSelectedCountry(referralData[0].countryorigin);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  useEffect(() => {
    // Get the current date
    const today = new Date();
    // Calculate the first day of the current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Calculate the last day of the current month
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // Set minDate to the ISO string format of the first day of the current month
    setMinDate(firstDayOfMonth.toISOString().split("T")[0]);
    // Set maxDate to the ISO string format of the last day of the current month
    setMaxDate(lastDayOfMonth.toISOString().split("T")[0]);
  }, []);

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

  const handleProfileImageChange = (e) => {
    console.log(e.target.files[0]);
    if (
      e.target.files[0].type === "image/png" ||
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/jpg"
    ) {
      const reader = new FileReader();
      reader.onload = (r) => {
        setImage(r.target.result);
        // console.log(r.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      toast.error("Invalid File!");
      image = null;
    }
  };

  const handleUpdateProduct = async (e, productId) => {
    e.preventDefault();
    
    // Retrieve agent ID from session (assuming it's stored as 'agentId' in session)
    const agentId = sessionStorage.getItem("id");
    const agentName = sessionStorage.getItem("name");
  
    // Format the date in the desired format (DD-MM-YYYY)
    const formattedDate = pdtDate.split("-").reverse().join("-");
    
    // Prepare the updated product object
    const updatedProduct = {
      agentid: agentId,
      agentname: agentName,
      pdtname: pdtName,
      pdtdesc: pdtDesc,
      pdtprice: pdtPrice,
      pdtdate: formattedDate,
      brandname: brandName,
      countryorigin: selectedCountry,
      image: image,
    };
  
    try {
      await axios.put(`http://localhost:8002/addpdt/${productId}`, updatedProduct);
      toast.success("Product Updated!");
      navigate("/pdtui");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again later.");
    }
  };
  

  // const handleAddProduct = async (e,productId) => {

  //   // Retrieve agent ID from session (assuming it's stored as 'agentId' in session)
  //   const agentId = sessionStorage.getItem("id");
  //   const agentName = sessionStorage.getItem("name");

  //   // Fetch the existing products from the database
  //   const response = await axios.get("http://localhost:8002/addpdt");

  //   // Extract the last ID from the response data
  //   const lastId = response.data[response.data.length - 1]?.id;

  //   // Set the new ID counter based on the last ID
  //   const newId = lastId ? parseInt(lastId) + 1 : 1;

  //   // Format the date in the desired format (DD-MM-YYYY)
  //   const formattedDate = pdtDate.split("-").reverse().join("-");

  //   // Prepare the new product object
  //   const newProduct = {
  //     agentid: agentId,
  //     agentname: agentName,
  //     id: newId.toString(),
  //     pdtname: pdtName,
  //     pdtdesc: pdtDesc,
  //     pdtprice: pdtPrice,
  //     pdtdate: formattedDate,
  //     brandname: brandName,
  //     countryorigin: selectedCountry,
  //     image: image,
  //     //image: {imageDataURL} Object ma pan store karaay, pan pachi traverse karvu aghru thai jase
  //   };

  //   if (image == null) {
  //     return;
  //   }

  //   await axios
  //     .post(`http://localhost:8002/addpdt/${productId}`, newProduct)
  //     .then((res) => res.data)
  //     .then((data) => {
  //       console.log(data);
  //       toast.success("Product Added!");
  //       navigate("/pdtui");
  //     })
  //     .catch((err)=>{
  //       console.log(err)
  //       toast.error("Image not uploaded!")
  //     })
  // };

  // const handleAddProduct = async (e) => {
  //   e.preventDefault();

  //   // Retrieve agent ID from session (assuming it's stored as 'agentId' in session)
  //   const agentId = sessionStorage.getItem("id");
  //   const agentName = sessionStorage.getItem("name");

  //   // Convert image to base64
  //   const reader = new FileReader();
  //   reader.readAsDataURL(image);
  //   reader.onload = async () => {
  //     // Prepare the new product object with base64 encoded image
  //     const newProduct = {
  //       agentid: agentId,
  //       agentname: agentName,
  //       pdtname: pdtName,
  //       pdtdesc: pdtDesc,
  //       pdtprice: pdtPrice,
  //       pdtdate: pdtDate,
  //       brandname: brandName,
  //       countryorigin: selectedCountry,
  //       image: reader.result, // base64 encoded image
  //     };

  //     try {
  //       // Add the new product to the database
  //       await axios.post("http://localhost:8002/addpdt", newProduct);
  //       toast.success("Product Added!");
  //       navigate("/pdtui");
  //     } catch (error) {
  //       console.error("Error adding product:", error);
  //       toast.error("Failed to add product. Please try again later.");
  //     }
  //   };
  // };

  // const handleAddProduct = async (e) => {
  //   e.preventDefault();

  //   // Retrieve agent ID from session (assuming it's stored as 'agentId' in session)
  //   const agentId = sessionStorage.getItem("id");
  //   const agentName = sessionStorage.getItem("name");

  //   // Fetch the existing products from the database
  //   const response = await axios.get("http://localhost:8002/addpdt");

  //   // Extract the last ID from the response data
  //   const lastId = response.data[response.data.length - 1]?.id;

  //   // Set the new ID counter based on the last ID
  //   const newId = lastId ? parseInt(lastId) + 1 : 1;

  //   // Format the date in the desired format (DD-MM-YYYY)
  //   const formattedDate = pdtDate.split("-").reverse().join("-");

  //   // Prepare the new product object
  //   const newProduct = {
  //     agentid: agentId,
  //     agentname: agentName,
  //     id: newId.toString(),
  //     pdtname: pdtName,
  //     pdtdesc: pdtDesc,
  //     pdtprice: pdtPrice,
  //     pdtdate: formattedDate,
  //     brandname: brandName,
  //     countryorigin: selectedCountry,
  //     image: URL.createObjectURL(image),
  //   };

  //   // Add the new product to the database
  //   await axios.post("http://localhost:8002/addpdt", newProduct)

  //   toast.success("Product Added!");
  //   navigate("/pdtui");
  // };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="bgcolor">
      <AgentNavBar />
      <Box height={40} />
      <Box sx={{ display: "flex" }}>
        <AgentSidenav />

        <div className="container card my-5 bg-light p-2 col-4">
          <section className="">
          <form
  className="row g-3 p-3"
  onSubmit={(e) => handleUpdateProduct(e, pdtId)}
>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtName" className="form-label">
                  Product Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPdtName"
                  value={pdtName}
                  onChange={(e) => {
                    setPdtName(e.target.value);
                  }}
                  placeholder="Laptop"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtDesc" className="form-label">
                  Description <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="inputPdtDesc"
                  rows="2"
                  value={pdtDesc}
                  onChange={(e) => {
                    setPdtDesc(e.target.value);
                  }}
                  placeholder="Efficient gadget"
                  required
                ></textarea>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtPrice" className="form-label">
                  Price <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="inputPdtPrice"
                    value={pdtPrice}
                    onChange={(e) => {
                      setPdtPrice(e.target.value);
                    }}
                    placeholder="52000"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtDate" className="form-label">
                  Date <span style={{ color: "red" }}>*</span>
                </label>
                {/* <input
                  type="date"
                  className="form-control"
                  id="inputPdtDate"
                  value={pdtDate} onChange={(e)=>{setPdtDate(e.target.value)}}
                  required
                /> */}
                <input
                  type="date"
                  className="form-control"
                  id="inputPdtDate"
                  value={pdtDate}
                  onChange={(e) => setPdtDate(e.target.value)}
                  // Set minimum and maximum allowed dates
                  min={minDate}
                  max={maxDate}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputBrandName" className="form-label">
                  Brand Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputBrandName"
                  value={brandName}
                  onChange={(e) => {
                    setBrandName(e.target.value);
                  }}
                  placeholder="Apple"
                  required
                />
              </div>
              <div className="col-md-6 mb-4">
                <label htmlFor="inputCountryOrigin" className="form-label">
                  Country Origin <span style={{ color: "red" }}>*</span>
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
              <div className="col-md-12 mb-3">
                <img
                  className="mb-3 me-3"
                  style={{ objectFit: "cover" }}
                  width={150}
                  height={150}
                  src={image}
                  alt=""
                />
                <Form.Control type="file" onChange={handleProfileImageChange} />

                {/* <label htmlFor="inputBrandName" className="form-label">
                  Upload an Image <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="inputImage"
                  onChange={(e) =>
                    setImage(URL.createObjectURL(e.target.files[0]))
                  }
                  required
                /> */}
              </div>

              <div className="col-12 text-center">
                <button type="submit" className="btn btn-warning btn-lg ms-2">
                  Save
                </button>
              </div>
            </form>
          </section>
        </div>
      </Box>
    </div>
  );
}

export default EditProduct;
