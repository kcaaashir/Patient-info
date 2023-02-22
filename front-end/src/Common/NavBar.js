import React from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { CREATE_PATIENT, PATIENT_LIST, SIGN_OUT } from ".././Constants/Routes";



export const NavBar = () => {

  const navigate = useNavigate();

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link to={PATIENT_LIST} className="nav-link">
            Patient Information System
          </Link>
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <NavDropdown title="Patient" id="navbarScrollingDropdown">
            <NavDropdown.Item onClick={() => navigate(PATIENT_LIST)}>
              Patient List
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => navigate(CREATE_PATIENT)}>
              Create Patient
            </NavDropdown.Item>
          </NavDropdown>
          <Nav>
            <Link to={SIGN_OUT} className="nav-link">
              Sign Out
            </Link>
          </Nav>
        </Nav>
      </Container>
    </Navbar>
  )
};
