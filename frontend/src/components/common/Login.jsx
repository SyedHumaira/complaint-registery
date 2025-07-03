// File: frontend/src/components/common/Login.jsx
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import FooterC from './FooterC';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/Login", user);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Successfully logged in ✅");

      const { userType } = res.data;
      switch (userType) {
        case "Admin":
          navigate("/AdminHome");
          break;
        case "Ordinary":
          navigate("/dashboard");
          break;
        case "Agent":
          navigate("/AgentHome");
          break;
        default:
          navigate("/Login");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Invalid email or password ❌");
      } else {
        toast.error("Login failed ❌");
      }
    }
  };

  return (
    <>
     
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white">
                <div className="card-body p-5 text-center">
                  <form onSubmit={handleSubmit}>
                    <h2 className="fw-bold mb-4">Login</h2>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label">Email</label>
                    </div>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        autoComplete="off"
                        required
                      />
                      <label className="form-label">Password</label>
                    </div>
                    <button className="btn btn-outline-light btn-lg px-5" type="submit">
                      Login
                    </button>
                  </form>
                  <p className="mb-0 mt-3">
                    Don't have an account? <Link to="/SignUp">SignUp</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterC />
    </>
  );
};

export default Login;
