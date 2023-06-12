import React from "react";
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import { Container, Nav} from "react-bootstrap"
import "./barNav.scss";


export const BarNav = () => 
{

  return (
    <Navbar bg="primary" variant="dark">
        <Container>
        <Navbar.Brand href="#home">
          <Link className="navbar-brand" to="/">
            Home
          </Link>
        </Navbar.Brand>
        <Nav className="me-auto">
            <Nav.Link href="#home">
              <Link className="navbar-brand" to="/model">
                Model
              </Link>
            </Nav.Link>
            <Nav.Link href="#features">
              <Link className="navbar-brand" to="/about">
                About
              </Link>
            </Nav.Link>
        </Nav>
        </Container>
     </Navbar>
  );
};