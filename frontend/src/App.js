// File: frontend/src/App.js
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Pages
import HomePage from "./components/user/HomePage";
import Login from "./components/common/Login";
import SignUp from "./components/common/SignUp";
import Complaint from "./components/user/Complaint";
import Status from "./components/user/Status";
import AdminHome from "./components/admin/AdminHome";
import AgentHome from "./components/agent/AgentHome";
import UserInfo from "./components/admin/UserInfo";
import Home from "./components/common/Home";
import AgentInfo from "./components/admin/AgentInfo";
import UserDashboard from "./components/user/UserDashboard";
import RegisterComplaint from "./components/common/RegisterComplaint";

// ✅ New Imports
import CustomNavbar from "./components/common/CustomNavbar";
import Profile from "./components/common/Profile";

function App() {
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <div className="App">
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />

        {/* ✅ Optional: Place CustomNavbar globally if needed */}
        {isLoggedIn && <CustomNavbar />}

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />

          {isLoggedIn ? (
            <>
              <Route path="/AgentInfo" element={<AgentInfo />} />
              <Route path="/AgentHome" element={<AgentHome />} />
              <Route path="/UserInfo" element={<UserInfo />} />
              <Route path="/AdminHome" element={<AdminHome />} />
              <Route path="/Homepage" element={<HomePage />} />
              <Route path="/Complaint" element={<Complaint />} />
              <Route path="/Status" element={<Status />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/RegisterComplaint" element={<RegisterComplaint />} />
              <Route path="/profile" element={<Profile />} /> {/* ✅ Profile route */}
            </>
          ) : (
            <Route path="/Login" element={<Login />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

