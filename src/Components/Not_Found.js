import React from "react";
import { useNavigate } from "react-router-dom";

function NF() {
  const navigate = useNavigate();
  const submitHandler = () => {
    navigate('/')
  }
  return (
    <>
      <div className="container-fluid bg-dark text-light py-3">
        <header className="text-center">
          <h1>404 Page Not Found</h1>
        </header>
      </div>
      <section className="container card my-5 bg-light p-2">
        <form className="row g-3 p-3" onSubmit={submitHandler}>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-warning btn-lg ms-2 text-center">
              Redirect me to Home Page
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default NF;
