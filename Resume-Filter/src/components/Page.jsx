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
    email: "marco.silva@example.com",
    phone: "+1-555-123-4567"
  },
  {
    name: "Rajat Mehra",
    matched: "6/21",
    skills: ["Stack", "Redux", "React", "+3"],
    experience: "4/4",
    email: "rajat.mehra@example.com",
    phone: "+91-98765-43210"
  },
  {
    name: "Tomáš Novák",
    matched: "7/21",
    skills: ["Jest", "Apis", "Redux", "+4"],
    experience: "4/4",
    email: "tomas.novak@example.com",
    phone: "+420-777-888-999"
  },
  {
    name: "Priya Desai",
    matched: "9/21",
    skills: ["Jest", "Redux", "React", "+6"],
    experience: "3/4",
    email: "priya.desai@example.com",
    phone: "+91-91234-56789"
  },
  {
    name: "María Fernanda Ruiz",
    matched: "4/21",
    skills: ["Aria", "React", "Github", "+1"],
    experience: "3/4",
    email: "maria.ruiz@example.com",
    phone: "+52-123-456-7890"
  },
  {
    name: "Fatima Al",
    matched: "1/21",
    skills: ["Figma"],
    experience: "0/4",
    email: "fatima.al@example.com",
    phone: "+971-50-123-4567"
  },
  {
    name: "Amirthavarshini L",
    matched: "0/21",
    skills: ["No skills"],
    experience: "0/4",
    email: "amirtha.l@example.com",
    phone: "+91-90000-00000"
  }
];


const Page = () => {
  return (
    <>
      <Container fluid className="page-container">
        {/* Breadcrumb */}
        <div className="header-container mb-4">
          <Row className="breadcrumb-section ">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-custom mb-0">
                <li className="breadcrumb-item">
                  <a href="#" className="text-dark text-decoration-none">
                    Jobs
                  </a>
                </li>
                <li
                  className="breadcrumb-item active fw-bold"
                  aria-current="page"
                >
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
                <Badge bg="warning" text="dark">
                  Jest
                </Badge>
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
              <th>Email</th>
              <th>Phone Number</th>
              <th>Experience</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index}>
                <td><Form.Check type="checkbox" /></td>
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
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.experience}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination className="justify-content-center">
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item >{2}</Pagination.Item>
          <Pagination.Item >{3}</Pagination.Item>
          <Pagination.Next />
        </Pagination>


        <Row>
        <Col>1 of 3</Col>
        <Col>2 of 3</Col>
        <Col>3 of 3</Col>
      </Row>

            <Button variant="outline-primary">Primary</Button>

      </Container>

      
    </>
  );
};

export default Page;
