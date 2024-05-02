// import React, { useEffect } from "react";
import AgentNavBar from "../Agent/Dashboard_Com/AgentNavbar"
import AgentSidenav from "../Agent/Dashboard_Com/AgentSidenav"
import React, { useState } from "react";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import HowToRegSharpIcon from '@mui/icons-material/HowToRegSharp';
import CountUp from 'react-countup';
import axios from "axios";



function Dashboard2(){

  const [totalNumberOfReferral,setTotalNumberOfReferral]=useState();
  const [numberOfCompletedReferral,setNumberOfCompletedReferral]=useState();

  // const navigate = useNavigate();
  // useEffect(() => {
  //   let username = sessionStorage.getItem('username');
  //   if(username===''||username===null){
  //     navigate('/login')
  //   }
  // },[navigate])
  const id = sessionStorage.getItem('id')
  axios
  .get(`http://localhost:8001/referrals?agentid=${id}`)
  .then((res)=>{
    console.log(res.data.length)
    setTotalNumberOfReferral(res.data.length)

    const activeAgents = res.data.filter(referral => referral.status === "Completed");
    const numberOfCompletedReferral = activeAgents.length;
    console.log(numberOfCompletedReferral)
    setNumberOfCompletedReferral(numberOfCompletedReferral)
})
.catch((err)=>{
  console.log(err)
})

  return (
    <div className="bgcolor">
      <AgentNavBar />
      {/* <Sidenav /> */}
      <Box height={120} />
      <Box sx={{ display: "flex" }}>
        <AgentSidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 17 }}>
          <Box><h3>Referral Data</h3></Box>
          <Grid container spacing={2}>
            <Grid item>
              <Stack spacing={2} direction="row">
                <Card className="btn btn-warning" sx={{ minWidth: "33.9%",height:150,boxShadow:10  }}>
                  <CardContent>
                    <div className="iconstyle">
                    <PeopleAltSharpIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={totalNumberOfReferral} duration={2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Total Number of Referrals
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="btn btn-warning" sx={{ minWidth: "33.9%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <HowToRegSharpIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfCompletedReferral} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Referrals with Status Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard2;
