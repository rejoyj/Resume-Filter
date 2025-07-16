import React from "react";
import {
  Navbar,
  Container,
  Form,
  Button,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import logo from "../assets/1.-Manvian-Logo-06.png";
import "./Homepage.css";
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <>
      {/* Header */}
      <Container fluid>
      <Navbar expand="lg" className="navbar-custom shadow-sm">
        <Container>
          <Navbar.Brand href="/" className="brand-text">
            <img
              src={logo}
              alt="Manvian logo"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="form-container">
        {/* Upload Button */}
        <div className="text-center mb-3">
          <Button className="upload-btn">Upload</Button>
        </div>

        {/* Job Title Dropdown */}
        <Dropdown className="mb-3">
           
          <Dropdown.Toggle className="dropdown-job w-100">
            Job Title
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Software Engineer</Dropdown.Item>
            <Dropdown.Item>Product Manager</Dropdown.Item>
            <Dropdown.Item>UI/UX Designer</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Skills Dropdowns */}
        <Row className="mb-3">
          <Col>
            <Dropdown>
              <Dropdown.Toggle className="dropdown-skills w-100">
                Mandatory Skills
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>React</Dropdown.Item>
                <Dropdown.Item>JavaScript</Dropdown.Item>
                <Dropdown.Item>Python</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown>
              <Dropdown.Toggle className="dropdown-skills w-100">
                Preferred Skills
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Node.js</Dropdown.Item>
                <Dropdown.Item>TypeScript</Dropdown.Item>
                <Dropdown.Item>AWS</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Description..."
            className="textarea-custom"
          />
        </Form.Group>

        {/* Submit Button */}
        <div className="text-center">
          <Link to='/Page'><Button className="submit-btn">Submit</Button></Link>
          
        </div>
      </Container>
        </Container>
    </>
  );
};

export default Homepage;
