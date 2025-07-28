import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Button, Row, Col, Form } from "react-bootstrap";
import logo from "../assets/1.-Manvian-Logo-06.png";
import "./Homepage.css";
import { FaUpload } from "react-icons/fa6";
import home from "../assets/Home.png";

const Homepage = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");

  const navigate = useNavigate(); // ✅ For navigation with state

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setSelectedFileName(selectedFiles[0].name);
    }
    console.log("Selected files:", selectedFiles);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      setSelectedFileName(droppedFiles[0].name);
      console.log("Dropped files:", droppedFiles);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleProcessResumes = async () => {
    if (files.length === 0) {
      alert("Please upload at least one PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", files[0]);

    try {
      const response = await fetch("http://localhost:5000/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }

      const result = await response.json();
      console.log("Backend Response:", result);
     

      // ✅ Navigate to Page and send resume data
      navigate("/Page", { state: { candidates: [result] } });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to process resume. Please try again.");
    }
  };

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
              <Col className="text-center align-self-center pt-5">
                <img src={home} alt="Home" style={{ height: "400px" }} />
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <h1 className="home-title">
                  Hire <span>Smart</span>. Hire <span>Skilled</span>. Hire{" "}
                  <span>Success</span>.
                </h1>
                <p className="home-subtitle">
                  Upload your resume and let us filter it for you.
                </p>
              </Col>
            </Row>
          </Col>

          <Col>
            <Container
              className="form-container text-center p-5 shadow"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf"
              />

              <Button
                className="mt-2 mb-3"
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
                <FaUpload className="me-2" />
                Upload Resume
              </Button>

              <p className="text-muted mb-3" style={{ fontWeight: 500 }}>
                or drop PDF files here
              </p>

              {files.length > 0 && (
                <>
                  <Form.Select
                    className="mb-3"
                    value={selectedFileName}
                    onChange={(e) => setSelectedFileName(e.target.value)}
                  >
                    {files.map((file, index) => (
                      <option key={index} value={file.name}>
                        {file.name}
                      </option>
                    ))}
                  </Form.Select>

                  <p className="text-muted">
                    Total Files Uploaded: <strong>{files.length}</strong>
                  </p>
                </>
              )}
            </Container>

            <div className="mb-3 d-flex justify-content-center align-items-center">
              <Button
                className="process-btn mt-3"
                onClick={handleProcessResumes}
              >
                Process Resume
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Homepage;
