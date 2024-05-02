import React from "react";
import { useNavigate } from "react-router-dom";

function UnAuth() {
  const navigate = useNavigate();
  const submitHandler = () => {
    navigate('/login')
  }
  return (
    <>
      {/* <div className="container-fluid bg-dark text-light py-3">
        
      </div> */}
      <div style={{boxShadow:"100px"}}>
      <section className="container card mt-5 bg-light p-2 col-5">
        <header className="text-center">
          <h1 className="container-fluid text-dark py-3">Please Log In to access this route</h1>
        </header>
        <form className="row g-3 p-3" onSubmit={submitHandler}>
          <div className="col-12 text-center mt-5">
            <button type="submit" className="btn btn-warning btn-lg ms-2 text-center">
              Redirect me to Login Page
            </button>
          </div>
        </form>
      </section>
      </div>
    </>
  );
}

export default UnAuth;
