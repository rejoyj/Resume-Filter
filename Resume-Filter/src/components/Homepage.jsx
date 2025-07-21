import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Button ,Row , Col } from "react-bootstrap";
import logo from "../assets/1.-Manvian-Logo-06.png";
import "./Homepage.css";
import { FaUpload } from "react-icons/fa6";
import home from "../assets/Home.png";

const Homepage = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setFile(files[0]);
      console.log("Selected file:", files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      console.log("Dropped file:", droppedFile);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <>
      <Container fluid className="home-container p-0">
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
        <Row className="home-row">
          <Col>
          <Row>
            <Col className="text-center align-self-center">
            <img src={home} alt="Home" style={{height:"400px"}} />
            </Col>
          </Row>
          </Col>
          <Col>
        <Container
  className="form-container text-center p-5 shadow"
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  {/* Hidden File Input */}
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: "none" }}
    accept=".pdf"
  />

  {/* Upload Button */}
  <Button className="mt-5"
    onClick={handleUploadClick}
    style={{
      backgroundColor: "#0d6efd",
      border: "none",
      padding: "10px 30px",
      borderRadius: "30px",
      fontSize: "16px",
      fontWeight: "500",
    }}
  >
    Upload Image
  </Button>

  {/* Drag/drop or paste instructions */}
  <p className="text-muted mt-4 mb-1" style={{ fontWeight: 500 }}>
    or drop a file,
  </p>
 

  {/* Show selected file */}
  {file && (
    <div className="mt-3 text-primary fw-bold">
      Selected File: {file.name}
    </div>
  )}

  {/* Process Button */}
  
</Container>
<div
  className="mb-3"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Link to="/Page">
    <Button className="process-btn mt-3">Process Resume</Button>
  </Link>
</div>


          </Col>
        </Row>
        
      </Container>
    </>
  );
};

export default Homepage;
