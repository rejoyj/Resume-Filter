import React from "react";
import {
  Container,
  Table,
  Badge,
  Form,
  Row,
  Col,
  Breadcrumb,
  Button,
  Pagination,
} from "react-bootstrap";
import "./Page.css";

const candidates = [
  {
    name: "Marco Silva",
    matched: "8/21",
    skills: ["Jest", "React", "Agile", "+5"],
    experience: "9/4",
  },
  {
    name: "Rajat Mehra",
    matched: "6/21",
    skills: ["Stack", "Redux", "React", "+3"],
    experience: "4/4",
  },
  {
    name: "Tomáš Novák",
    matched: "7/21",
    skills: ["Jest", "Apis", "Redux", "+4"],
    experience: "4/4",
  },
  {
    name: "Priya Desai",
    matched: "9/21",
    skills: ["Jest", "Redux", "React", "+6"],
    experience: "3/4",
  },
  {
    name: "María Fernanda Ruiz",
    matched: "4/21",
    skills: ["Aria", "React", "Github", "+1"],
    experience: "3/4",
  },
  {
    name: "Fatima Al",
    matched: "1/21",
    skills: ["Figma"],
    experience: "0/4",
  },
  {
    name: "Amirthavarshini L",
    matched: "0/21",
    skills: ["No skills"],
    experience: "0/4",
  },
];

const Page = () => {
  return (
    <>
      <Container fluid className="page-container">
        <h4 className="mb-3">
          Jobs &gt; <strong>Frontend Engineer</strong>
        </h4>

        {/* Breadcrumb */}
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

          {/* Mandatory Skills */}
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
            <Col className="text-end">2 of 2</Col>
          </Row>
        </div>

        {/* Preferred Skills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <strong>Preferred Skills:</strong>
          <Badge bg="warning">Apis</Badge>
          <Badge bg="success">Agile</Badge>
          <Badge bg="primary">Bonus</Badge>
          <Badge bg="secondary">+9</Badge>
        </div>

        {/* Search Input */}
        <Form.Control
          className="mb-3 w-25"
          type="search"
          placeholder="Search job title or skills"
        />

        {/* Candidates Table */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Matched Skills</th>
              <th>Relevant Exp.</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index}>
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <td>{candidate.name}</td>
                <td>
                  <div>{candidate.matched}</div>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {candidate.skills.map((skill, i) => (
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
        <Pagination className="justify-content-end">
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </Container>
    </>
  );
};

export default Page;
