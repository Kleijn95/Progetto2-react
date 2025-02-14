import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

const TopBar = () => {
  const location = useLocation();
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-3">
      <Container fluid>
        <Navbar.Brand>
          <img
            src="https://i.ibb.co/Q7XBD8Xp/DALL-E-2025-02-14-11-11-17-A-cute-and-friendly-logo-for-a-weather-app-The-logo-features-a-smiling-su.webp"
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="Logo Weather Site"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className="fw-bold nav-link">
              Home
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
