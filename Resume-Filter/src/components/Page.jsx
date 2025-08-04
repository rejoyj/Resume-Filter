import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Table,
  Badge,
  Form,
  Row,
  Col,
  Button,
  Pagination,
} from "react-bootstrap";
import "./Page.css";
import { Link, useLocation } from "react-router-dom";
import { FaDownload, FaRegShareFromSquare, FaBullhorn } from "react-icons/fa6";
import logo from "../assets/1.-Manvian-Logo-06.png";

const Page = () => {
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (location.state && location.state.candidates) {
      setCandidates(location.state.candidates);
    } else {
      const fetchCandidates = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/parse-resume");
          const data = await response.json();
          setCandidates(Array.isArray(data) ? data : [data]);
        } catch (error) {
          console.error("Failed to fetch candidates:", error);
        }
      };

      fetchCandidates();
    }
  }, [location.state]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = candidates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(candidates.length / itemsPerPage);

  // ✅ CSV Download Function
  const downloadCSV = () => {
    const headers = ["Name", "Phone Number", "Email", "Skills", "Experience"];
    const rows = candidates.map((c) => [
      c.name,
      c.phone,
      c.email,
      (c.skills || []).join(", "),
      c.experience,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "candidates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Excel Download Function
  const downloadExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheetData = candidates.map((c) => ({
        Name: c.name,
        "Phone Number": c.phone,
        Email: c.email,
        Skills: (c.skills || []).join(", "),
        Experience: c.experience,
      }));
      const worksheet = xlsx.utils.json_to_sheet(worksheetData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Candidates");
      xlsx.writeFile(workbook, "candidates.xlsx");
    });
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-custom shadow-sm">
        <Container>
          <Navbar.Brand href="/" className="brand-text">
            <img src={logo} alt="Manvian logo" height="40" className="d-inline-block align-top" />
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid className="page-container">
        <div className="header-container mb-4">
          <Row className="breadcrumb-section">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-custom mb-0">
                <li className="breadcrumb-item">
                  <a href="#" className="text-dark text-decoration-none">
                    Jobs
                  </a>
                </li>
                <li className="breadcrumb-item active fw-bold" aria-current="page">
                  Frontend Engineer
                </li>
              </ol>
            </nav>
          </Row>

          <Row className="Skills-section">
            <Col>
              <div className="d-flex flex-wrap gap-2 mb-2">
                <strong>Mandatory Skills:</strong>
                <Badge bg="warning" text="dark">Jest</Badge>
                <Badge bg="success">Aria</Badge>
                <Badge bg="primary">React</Badge>
                <Badge bg="secondary">+6</Badge>
              </div>
            </Col>
            <Col className="text-end">
              <div className="d-flex flex-wrap gap-2 mb-4">
                <strong>Preferred Skills:</strong>
                <Badge bg="warning">Apis</Badge>
                <Badge bg="success">Agile</Badge>
                <Badge bg="primary">Bonus</Badge>
                <Badge bg="secondary">+9</Badge>
              </div>
            </Col>
          </Row>
        </div>

        {/* Search Box */}
        <Form.Control
          className="mb-3 w-25"
          type="search"
          placeholder="Search job title or skills"
        />

        {/* ✅ Updated Table Column Order */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Skills</th>
              <th>Experience</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((candidate, index) => (
              <tr key={index}>
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <td>{candidate.name}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.email}</td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    {candidate.skills?.map((skill, i) => (
                      <Badge key={i} bg="light" text="dark" className="border">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td>{candidate.experience}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>

        {/* Action Buttons */}
        <Row className="justify-content-center mt-5">
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Button variant="outline-primary" onClick={downloadExcel}>
              <FaDownload className="me-2 mb-1" />
              Excel Download
            </Button>

            <Link to="/mail-template">
              <Button variant="outline-primary">
                <FaRegShareFromSquare className="me-2 mb-1" />
                Email
              </Button>
            </Link>

            <Button variant="outline-primary" onClick={downloadCSV}>
              <FaDownload className="me-2 mb-1" />
              CSV Download
            </Button>

            <Link to="/broadcast" state={{ recipients: candidates }}>
              <Button variant="outline-primary">
                <FaBullhorn className="me-2 mb-1" />
                Broadcast
              </Button>
            </Link>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Page;
