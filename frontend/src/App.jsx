import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import DNCUpload from './pages/DNCUpload';
import Files from './pages/Files';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // custom styles

function App() {
  return (
    <Router>
      <Navbar bg="white" expand="lg" className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-primary">
            📞 Ringba Automation
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="px-3">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/schedule" className="px-3">Schedule</Nav.Link>
              <Nav.Link as={Link} to="/dnc-upload" className="px-3">DNC Upload</Nav.Link>
              <Nav.Link as={Link} to="/files" className="px-3">Files</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/dnc-upload" element={<DNCUpload />} />
        <Route path="/files" element={<Files />} />
      </Routes>
    </Router>
  );
}

export default App;