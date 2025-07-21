import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Button } from "react-bootstrap";
import logo from "../assets/1.-Manvian-Logo-06.png";
import "./Homepage.css";
import { FaUpload } from "react-icons/fa6";

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

        <Container className="form-container text-center p-3">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".pdf"
          />

          {/* Upload Button */}
          <div className="mb-3">
            <Button className="upload-btn" onClick={handleUploadClick}>
              <FaUpload style={{ marginRight: "8px" }} />
              Upload
            </Button>
          </div>

          {/* Drag and Drop Box */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              borderRadius: "25px",
              backgroundColor: "#0d6efd",
              padding: "15px 30px",
              color: "#fff",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            <FaUpload size={22} className="me-2" />
            <span>Drag and Drop Files here</span>
          </div>

          {/* Show file name if uploaded or dropped */}
          {file && (
            <div
              style={{
                marginTop: "10px",
                color: "#0d6efd",
                fontWeight: "bold",
              }}
            >
              Selected File: {file.name}
            </div>
          )}

         
          <div className="mb-3">
            <Link to="/Page">
              <Button
                className="process-btn mt-4"
              >
                Process Resume
              </Button>
            </Link>
          </div>
        </Container>
      </Container>
    </>
  );
};

export default Homepage;

