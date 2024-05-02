import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Protected(props) {
  const { Component } = props
  const navigate = useNavigate();
  useEffect(()=>{
    // const id = sessionStorage.getItem('id');
    const username = sessionStorage.getItem('username')
    if(username===''||username===null){
        navigate('/unauth')
    }
  })
  return (
    <>
      <Component />
    </>
  );
}

export default Protected;
