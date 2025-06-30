// File: frontend/src/components/common/CustomNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import useLogout from "../../hooks/useLogout";

const CustomNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const logout = useLogout();

  // 🔁 Determine dashboard route based on userType
  const getDashboardRoute = () => {
    if (!user) return "/";
    switch (user.userType?.toLowerCase()) {
      case "admin":
        return "/AdminHome";
      case "agent":
        return "/AgentHome";
      case "ordinary":
        return "/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">ComplaintCare</Navbar.Brand>
        <Nav className="ms-auto">
          {!user ? (
            <>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/Login">Login</Nav.Link>
              <Nav.Link as={Link} to="/SignUp">SignUp</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to={getDashboardRoute()}>Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/Profile">Profile</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
