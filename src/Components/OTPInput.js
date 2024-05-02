import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OTPInput() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");
  const otp = parseInt(sessionStorage.getItem("otp"));
  const id = sessionStorage.getItem("id");
  const [timerCount, setTimer] = React.useState(0.5);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);

  function resendOTP() {
    if (disable) return;
    // Generate a new OTP
    const newOTP = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit OTP
    
    axios
      .post("http://localhost:5000/send_recovery_email", {
        OTP: newOTP, // Use the new OTP
        recipient_email: email,
      })
      .then(() => {
        setDisable(true);
        setTimer(60); // Reset the timer
        sessionStorage.setItem('otp', newOTP); // Store the new OTP in sessionStorage
        toast.success("A new OTP has successfully been sent to your email.");
      })
      .catch(console.log);
  }
  

  function verfiyOTP(e) {
    e.preventDefault(); // Prevent default form submission behavior
    const enteredOTP = parseInt(OTPinput.join(""), 10);
    if (enteredOTP === otp) {
      navigate(`/reset/${id}`);
      toast.success("Success!");
    } else {
      toast.error("Incorrect Pin!")
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);

  const handleInputChange = (index, value) => {
    if (index < OTPinput.length - 1 && value !== "") {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
    const newOTPinput = [...OTPinput];
    newOTPinput[index] = value;
    setOTPinput(newOTPinput);

    // Replace entered digit with asterisk after one second
    // setTimeout(() => {
    //   const updatedOTPinput = [...OTPinput];
    //   updatedOTPinput[index] = '*'; // Replace entered digit with asterisk
    //   setOTPinput(updatedOTPinput);
    // }, 100);
  };

  return (
    <>
      <div
        className="container-fluid card bg-light py-3"
        style={{ height: "500px", width: "700px", marginTop: "110px" }}
      >
        <div style={{ marginLeft: "30px" }}>
          <header className="text-center mt-4">
            <h1>Email Verification</h1>
          </header>
          <div className="text-center text-muted">
            <p>We've sent you a code to your email {email}</p>
          </div>
        </div>
        <section className="container d-flex justify-content-center">
          <form className="row g-3 p-2 col-xs-2" onSubmit={verfiyOTP}>
            <div>
              <div className="row d-flex justify-content-center m-3">
                {OTPinput.map((value, index) => (
                  <div key={index} className="col-1 m-3">
                    <input
                      maxLength={1}
                      className="form-control form-control-sm"
                      type="text"
                      id={`input-${index}`}
                      style={{
                        width: "4rem",
                        height: "5rem",
                        fontFamily: "sans-serif",
                        fontSize: "40px",
                      }}
                      value={value}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-warning btn-lg ms-2">
                Verify Account
              </button>
            </div>

            <div className="text-center">
              <p>Didn't receive code?</p>{" "}
              <Link
                className="flex flex-row items-center"
                style={{
                  color: disable ? "gray" : "blue",
                  cursor: disable ? "none" : "pointer",
                  textDecorationLine: disable ? "none" : "underline",
                }}
                onClick={resendOTP}
              >
                {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default OTPInput;

// import axios from "axios";
// import React from "react";
// import { useState } from "react";
// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// function OTPInput() {
//     const navigate = useNavigate();
//     const email = sessionStorage.getItem('email');
//     const otp = parseInt(sessionStorage.getItem('otp'));
//     const id = sessionStorage.getItem('id');
//     const [timerCount, setTimer] = React.useState(60);
//     const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
//     const [disable, setDisable] = useState(true);

//     function resendOTP() {
//       if (disable) return;
//       axios
//         .post("http://localhost:5000/send_recovery_email", {
//           OTP: otp,
//           recipient_email: email,
//         })
//         .then(() => setDisable(true))
//         .then(() => alert("A new OTP has successfully been sent to your email."))
//         .then(() => setTimer(60))
//         .catch(console.log);
//     }

//     function verfiyOTP(e) {
//       e.preventDefault(); // Prevent default form submission behavior
//       const enteredOTP = parseInt(OTPinput.join(""), 10);
//       if (enteredOTP === otp) {
//         navigate(`/reset/${id}`);
//         toast.success('Success!')
//       } else {
//         alert(
//           "The code you have entered is not correct, try again or re-send the link"
//         );
//       }
//     }

//     useEffect(() => {
//       let interval = setInterval(() => {
//         setTimer((lastTimerCount) => {
//           lastTimerCount <= 1 && clearInterval(interval);
//           if (lastTimerCount <= 1) setDisable(false);
//           if (lastTimerCount <= 0) return lastTimerCount;
//           return lastTimerCount - 1;
//         });
//       }, 1000); //each count lasts for a second
//       //cleanup the interval on complete
//       return () => clearInterval(interval);
//     }, [disable]);

//     const handleInputChange = (index, value) => {
//       if (index < OTPinput.length - 1 && value !== '') {
//         const nextInput = document.getElementById(`input-${index + 1}`);
//         if (nextInput) {
//           nextInput.focus();
//         }
//       }
//       const newOTPinput = [...OTPinput];
//       newOTPinput[index] = value;
//       setOTPinput(newOTPinput);
//     };

//     return (
//       <>
//         <div
//           className="container-fluid card bg-light py-3"
//           style={{ height: "500px", width: "700px", marginTop: "110px" }}
//         >
//           <div style={{ marginLeft: "30px" }}>
//             <header className="text-center mt-4">
//               <h1>Email Verification</h1>
//             </header>
//             <div className="text-center text-muted">
//               <p>We've sent you a code to your email {email}</p>
//             </div>
//           </div>
//           <section className="container d-flex justify-content-center">
//             <form className="row g-3 p-2 col-xs-2" onSubmit={verfiyOTP}>
//               <div>
//                 <div className="row d-flex justify-content-center m-3">
//                 <div className="col-1 m-3">
//                   <input
//                     maxLength={1}
//                     className="form-control form-control-sm"
//                     type="text"
//                     name=""
//                     id=""
//                     style={{
//                       width: "4rem",
//                       height: "5rem",
//                       fontFamily: "sans-serif",
//                       fontSize: "40px",
//                     }}
//                     onChange={(e) =>
//                       setOTPinput([
//                         e.target.value,
//                         OTPinput[1],
//                         OTPinput[2],
//                         OTPinput[3],
//                       ])
//                     }
//                   />
//                 </div>
//                 <div className="col-1 m-3">
//                   <input
//                     maxLength={1}
//                     className="form-control form-control-sm"
//                     type="text"
//                     name=""
//                     id=""
//                     style={{
//                       width: "4rem",
//                       height: "5rem",
//                       fontFamily: "sans-serif",
//                       fontSize: "40px",
//                     }}
//                     onChange={(e) =>
//                       setOTPinput([
//                         OTPinput[0],
//                         e.target.value,
//                         OTPinput[2],
//                         OTPinput[3],
//                       ])
//                     }
//                   />
//                 </div>
//                 <div className="col-1 m-3">
//                   <input
//                     maxLength={1}
//                     className="form-control form-control-sm"
//                     type="text"
//                     name=""
//                     id=""
//                     style={{
//                       width: "4rem",
//                       height: "5rem",
//                       fontFamily: "sans-serif",
//                       fontSize: "40px",
//                     }}
//                     onChange={(e) =>
//                       setOTPinput([
//                         OTPinput[0],
//                         OTPinput[1],
//                         e.target.value,
//                         OTPinput[3],
//                       ])
//                     }
//                   />
//                 </div>
//                 <div className="col-1 m-3">
//                   <input
//                     maxLength={1}
//                     className="form-control form-control-sm"
//                     type="text"
//                     name=""
//                     id=""
//                     style={{
//                       width: "4rem",
//                       height: "5rem",
//                       fontFamily: "sans-serif",
//                       fontSize: "40px",
//                     }}
//                     onChange={(e) =>
//                       setOTPinput([
//                         OTPinput[0],
//                         OTPinput[1],
//                         OTPinput[2],
//                         e.target.value,
//                       ])
//                     }
//                   />
//                 </div>
//                 </div>
//               </div>

//               <div className="col-12 text-center">
//                 <button type="submit" className="btn btn-warning btn-lg ms-2">
//                   Verify Account
//                 </button>
//               </div>

//               <div className="text-center">
//                 <p>Didn't receive code?</p>{" "}
//                 <Link
//                   className="flex flex-row items-center"
//                   style={{
//                     color: disable ? "gray" : "blue",
//                     cursor: disable ? "none" : "pointer",
//                     textDecorationLine: disable ? "none" : "underline",
//                   }}
//                   onClick={resendOTP}
//                 >
//                   {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
//                 </Link>
//               </div>

//             </form>
//           </section>
//         </div>
//       </>
//     );
//   }

//   export default OTPInput;
