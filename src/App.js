import { ToastContainer } from "react-toastify";
import RPage from "./Components/RPage";
import LPage from "./Components/LPage";
import Dashboard from "./Components/Admin/Dashboard"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import NF from "./Components/Not_Found";
import Protected from "./Components/Protected";
import Dashboard2 from "./Components/Agent/Dashboard2";
import AgentProfile from "./Components/Agent/Dashboard_Com/AgentProfile/AgentProfile"
import UnAuth from "./Components/UnAuth";
import ProductUI from "./Components/Agent/Dashboard_Com/Product/ProductUI";
import AddProduct from "./Components/Agent/Dashboard_Com/Product/AddProduct";
import ReferralList from "./Components/Admin/ReferralList/ReferralList";
import ParticularReferralList from "./Components/Admin/AgentsList/ListOfReferrals/ParticularReferralList";
import AgentList from "./Components/Admin/AgentsList/AgentList";
import AssignedReferralList from "./Components/Agent/Dashboard_Com/Referral/AssignedReferralList";
import CompletedReferralList from "./Components/Agent/Dashboard_Com/Referral/CompletedReferralList";
import RejectedReferralList from "./Components/Agent/Dashboard_Com/Referral/RejectedReferralList";
import EditProduct from "./Components/Agent/Dashboard_Com/Product/EditProduct";
import AssignedReferralAdminList from "./Components/Admin/ReferralList/AssignedReferralsAdmin";
import CompletedReferralAdmin from "./Components/Admin/ReferralList/CompletedReferralsAdmin";
import RejectedReferralAdmin from "./Components/Admin/ReferralList/RejectedReferralsAgent";
import ForgotPassword from "./ForgotPassword";
import Reset from "./Components/Reset";
import OTPInput from "./Components/OTPInput";

function App() {
      var role = sessionStorage.getItem('role')
      return(
        <>
          <Router>
            <Routes>
              <Route path="/" element={<RPage />}/>
              <Route path="/login" element={<LPage />}/>
              <Route path="/forpass" element={<ForgotPassword/>} />
              <Route path="/reset/:id" element={<Reset/>} />
              <Route path="/otp/" element={<OTPInput/>} />
              <Route path="/unauth" element={<UnAuth />}/>
              <Route path="/dashboard" element={ role==='Admin' ? <Protected Component={Dashboard} /> : <LPage />}/>
              <Route path="/dashboard2" element={role==='Agent' ? <Protected Component={Dashboard2} /> : <LPage />}/>
              <Route path="/agent" element={role==='Admin' ? <Protected Component={AgentList} /> : <LPage />} />
              <Route path="/agentprofile" element={role==='Agent' ? <Protected Component={AgentProfile} /> : <LPage />} />
              <Route path="/referrallist" element={role==='Admin' ? <Protected Component={ReferralList} /> : <LPage />} />
              {/* <Route path="/referrallist" element={role==='Admin' ? <Protected Component={NewReferralAdmin} /> : <LPage />} /> */}
              <Route path="/adassi" element={role==='Admin' ? <Protected Component={AssignedReferralAdminList} /> : <LPage />} />
              <Route path="/adcom" element={role==='Admin' ? <Protected Component={CompletedReferralAdmin} /> : <LPage />} />
              <Route path="/adrej" element={role==='Admin' ? <Protected Component={RejectedReferralAdmin} /> : <LPage />} />
              <Route path="/pdtui" element={role==='Agent' ? <Protected Component={ProductUI} /> : <LPage />} />
              <Route path="/addpdt" element={role==='Agent' ? <Protected Component={AddProduct} /> : <LPage />} />
              <Route path="/editpdt/:pdtId" element={role==='Agent' ? <Protected Component={EditProduct} /> : <LPage />} />
              <Route path="/refui" element={role==='Agent' ? <Protected Component={AssignedReferralList} /> : <LPage />} />
              {/* <Route path="/assiref" element={role==='Agent' ? <Protected Component={AssignedReferralList} /> : <LPage />} /> */}
              <Route path="/comref" element={role==='Agent' ? <Protected Component={CompletedReferralList} /> : <LPage />} />
              <Route path="/rejref" element={role==='Agent' ? <Protected Component={RejectedReferralList} /> : <LPage />} />
              <Route path="/preflist/:agentId" element={role==='Admin' ? <Protected Component={ParticularReferralList} /> : <LPage />} />
              <Route path="*" element={<NF />} />
            </Routes>
            <ToastContainer />
          </Router>
        </>
      )
    }
export default App