import React, { useState } from "react";
import Sidenav from "../Admin/Dashboard_Com/Sidenav";
import NavBar from "../Admin/Dashboard_Com/Navbar";
import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import HowToRegSharpIcon from '@mui/icons-material/HowToRegSharp';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HotelIcon from '@mui/icons-material/Hotel';
import "./style.css"
import CountUp from 'react-countup';
import axios from "axios";


const Dashboard = () => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   let username = sessionStorage.getItem('username');
  //   if(username===''||username===null){
  //     navigate('/login')
  //   }
  // },[navigate])
  
  const [agentStatus, setAgentStatus] = useState();
  const [numberOfAgent, setNumberOfAgent] = useState();
  const [numberOfRegisteredAgents, setNumberOfRegisteredAgents] = useState();
  const [numberOfActiveAgents,setNumberOfActiveAgents] = useState();
  const [numberOfDeactiveAgents, setNumberOfDeactiveAgents]=useState();

  const [numberOfNewReferrals,setNumberOfNewReferrals]=useState();
  const [numberOfAssignedReferrals,setNumberOfAssignedReferrals]=useState();
  const [numberOfRejectedReferrals,setNumberOfRejectedReferrals]=useState();
  const [numberOfCompletedReferrals,setNumberOfCompletedReferrals]=useState();
  


  axios
  .get("http://localhost:8000/agent")
  .then((res)=>{
    console.log(res.data.length)
    setNumberOfAgent(res.data.length)

    const registeredAgents = res.data.filter(agent => agent.status === "Registered");
    const numberOfRegisteredAgents = registeredAgents.length;
    console.log(numberOfRegisteredAgents)
    setNumberOfRegisteredAgents(numberOfRegisteredAgents)

    const activeAgents = res.data.filter(agent => agent.status === "Active");
    const numberOfActiveAgents = activeAgents.length;
    console.log(numberOfActiveAgents)
    setNumberOfActiveAgents(numberOfActiveAgents)
    
    const deactiveAgents = res.data.filter(agent => agent.status === "Deactive");
    const numberOfDeactiveAgents = deactiveAgents.length;
    console.log(numberOfDeactiveAgents)
    setNumberOfDeactiveAgents(numberOfDeactiveAgents)
  })
  .catch((err)=>{
    console.log(err)
  })

  axios
  .get("http://localhost:8001/referrals")
  .then((res)=>{

    const newReferrals = res.data.filter(referral => referral.status === "New");
    const numberOfNewReferrals = newReferrals.length;
    console.log(numberOfNewReferrals)
    setNumberOfNewReferrals(numberOfNewReferrals)

    const assignedReferrals = res.data.filter(referral => referral.status === "In Progress");
    const numberOfAssignedReferrals = assignedReferrals.length;
    console.log(numberOfAssignedReferrals)
    setNumberOfAssignedReferrals(numberOfAssignedReferrals)

    const rejectedReferrals = res.data.filter(referral => referral.status === "Rejected");
    const numberOfRejectedReferrals = rejectedReferrals.length;
    console.log(numberOfRejectedReferrals)
    setNumberOfRejectedReferrals(numberOfRejectedReferrals)
    
    const completedReferrals = res.data.filter(referral => referral.status === "Completed");
    const numberOfCompletedReferrals = completedReferrals.length;
    console.log(numberOfCompletedReferrals)
    setNumberOfCompletedReferrals(numberOfCompletedReferrals)

  })
  .catch((err)=>{
    console.log(err)
  })

  return (
    <div className="bgcolor">
      <NavBar />
      {/* <Sidenav /> */}
      <Box height={120} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 3 }}>
          <Box><h3>Agent Data</h3></Box>
          <Grid container spacing={2}>
            <Grid item>
              <Stack spacing={2} direction="row">
                <Card className="btn btn-warning" sx={{ minWidth: "33.9%",height:150,boxShadow:10  }}>
                  <CardContent>
                    <div className="iconstyle">
                    <PeopleAltSharpIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <p>{agentStatus}</p>
                      <CountUp delay={0.5} end={numberOfAgent} duration={2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Total Number of Agents
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="btn btn-warning" sx={{ minWidth: "33.9%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <HowToRegSharpIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfRegisteredAgents} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Registered Agents
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="btn btn-warning" sx={{ minWidth: "33.9%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <EmojiPeopleIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfActiveAgents} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Active Agents
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="btn btn-warning" sx={{ minWidth: "33.9%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <HotelIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfDeactiveAgents} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Deactive Agents
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
          <Box height={150} />
          <div><h3>Referral Data</h3></div>
          <Grid container spacing={2}>
            <Grid item >
              <Stack spacing={2} direction="row">
                <Card className="btn btn-warning" sx={{ minWidth: "33.6%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <GroupAddIcon/>
                    </div>
                    
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfNewReferrals} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      New Referrals
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="btn btn-warning" sx={{ minWidth: "33.6%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <AssignmentTurnedInIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfAssignedReferrals} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Assigned Referrals
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="btn btn-warning" sx={{ minWidth: "33.6%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <CancelIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfRejectedReferrals} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Rejected Referrals
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="btn btn-warning" sx={{ minWidth: "33.6%",height:150,boxShadow:10 }}>
                  <CardContent>
                    <div className="iconstyle">
                    <CheckCircleIcon/>
                    </div>
                    <Typography gutterBottom variant="h5" component="div">
                      <CountUp delay={0.5} end={numberOfCompletedReferrals} duration={0.2}/>
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Completed Referrals
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

export default Dashboard;
