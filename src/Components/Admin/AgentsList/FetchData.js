import React, { useEffect } from "react";
import axios from "axios";

function FetchData(){
    useEffect(()=>{
        axios.get('http://localhost:8000/agent')
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    return(
        <h1>Data Fetching</h1>
    )
}

export default FetchData