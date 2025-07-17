import React, { useState } from "react";
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
import { Link } from 'react-router-dom';

const candidates = [
  {
    name: "Marco Silva",
    matched: "8/21",
    skills: ["Jest", "React", "Agile", "+5"],
    experience: "9/4",
    email: "marco.silva@example.com",
    phone: "+1-555-123-4567",
  },
  {
    name: "Rajat Mehra",
    matched: "6/21",
    skills: ["Stack", "Redux", "React", "+3"],
    experience: "4/4",
    email: "rajat.mehra@example.com",
    phone: "+91-98765-43210",
  },
  {
    name: "Tomáš Novák",
    matched: "7/21",
    skills: ["Jest", "Apis", "Redux", "+4"],
    experience: "4/4",
    email: "tomas.novak@example.com",
    phone: "+420-777-888-999",
  },
  {
    name: "Priya Desai",
    matched: "9/21",
    skills: ["Jest", "Redux", "React", "+6"],
    experience: "3/4",
    email: "priya.desai@example.com",
    phone: "+91-91234-56789",
  },
  {
    name: "María Fernanda Ruiz",
    matched: "4/21",
    skills: ["Aria", "React", "Github", "+1"],
    experience: "3/4",
    email: "maria.ruiz@example.com",
    phone: "+52-123-456-7890",
  },
  {
    name: "Fatima Al",
    matched: "1/21",
    skills: ["Figma"],
    experience: "0/4",
    email: "fatima.al@example.com",
    phone: "+971-50-123-4567",
  },
  {
    name: "Amirthavarshini L",
    matched: "0/21",
    skills: ["No skills"],
    experience: "0/4",
    email: "amirtha.l@example.com",
    phone: "+91-90000-00000",
  },
  {
    name: "James Carter",
    matched: "5/21",
    skills: ["Node.js", "MongoDB", "Express", "+2"],
    experience: "2/4",
    email: "james.carter@example.com",
    phone: "+1-234-567-8901",
  },
  {
    name: "Aisha Khan",
    matched: "10/21",
    skills: ["React", "Redux", "Next.js", "+4"],
    experience: "3/4",
    email: "aisha.khan@example.com",
    phone: "+91-88888-12345",
  },
  {
    name: "Chen Wei",
    matched: "7/21",
    skills: ["TypeScript", "React", "Testing", "+2"],
    experience: "4/4",
    email: "chen.wei@example.com",
    phone: "+86-10-8888-9999",
  },
  {
    name: "John Smith",
    matched: "6/21",
    skills: ["Vue", "Vite", "Firebase", "+1"],
    experience: "3/4",
    email: "john.smith@example.com",
    phone: "+1-999-999-9999",
  },
  {
    name: "Nina Patel",
    matched: "9/21",
    skills: ["Angular", "RxJS", "TypeScript", "+3"],
    experience: "4/4",
    email: "nina.patel@example.com",
    phone: "+91-99876-54321",
  },
  {
    name: "Lucas Moreira",
    matched: "2/21",
    skills: ["HTML", "CSS"],
    experience: "1/4",
    email: "lucas.moreira@example.com",
    phone: "+55-11-99999-8888",
  },
  {
    name: "Sana Rahman",
    matched: "11/21",
    skills: ["React", "Redux", "Node", "MongoDB"],
    experience: "4/4",
    email: "sana.rahman@example.com",
    phone: "+971-50-111-2222",
  },
  {
    name: "Ivan Petrov",
    matched: "4/21",
    skills: ["Docker", "Kubernetes", "+2"],
    experience: "2/4",
    email: "ivan.petrov@example.com",
    phone: "+7-495-123-4567",
  },
  {
    name: "Sophia Lee",
    matched: "5/21",
    skills: ["UI/UX", "Figma", "Prototyping"],
    experience: "3/4",
    email: "sophia.lee@example.com",
    phone: "+82-10-2222-3333",
  },
  {
    name: "Ahmed El Sayed",
    matched: "3/21",
    skills: ["PHP", "Laravel", "MySQL"],
    experience: "2/4",
    email: "ahmed.elsayed@example.com",
    phone: "+20-100-123-4567",
  },
  {
    name: "Emily Thompson",
    matched: "8/21",
    skills: ["Scrum", "Agile", "Jira", "+1"],
    experience: "4/4",
    email: "emily.thompson@example.com",
    phone: "+1-222-333-4444",
  },
  {
    name: "Rohan Das",
    matched: "6/21",
    skills: ["Java", "Spring", "REST API", "+1"],
    experience: "3/4",
    email: "rohan.das@example.com",
    phone: "+91-98765-43210",
  },
  {
    name: "Hiroshi Tanaka",
    matched: "7/21",
    skills: ["Python", "Flask", "SQLAlchemy"],
    experience: "3/4",
    email: "hiroshi.tanaka@example.com",
    phone: "+81-90-1111-2222",
  },
  {
    name: "Ana Oliveira",
    matched: "2/21",
    skills: ["Illustrator", "Design"],
    experience: "1/4",
    email: "ana.oliveira@example.com",
    phone: "+351-912-345-678",
  },
  {
    name: "George Miller",
    matched: "3/21",
    skills: ["React Native", "iOS", "Android"],
    experience: "2/4",
    email: "george.miller@example.com",
    phone: "+1-666-777-8888",
  },
  {
    name: "Neha Reddy",
    matched: "5/21",
    skills: ["HTML", "CSS", "JavaScript"],
    experience: "2/4",
    email: "neha.reddy@example.com",
    phone: "+91-90000-12345",
  },
  {
    name: "Daniel Kim",
    matched: "4/21",
    skills: ["Next.js", "React", "+1"],
    experience: "2/4",
    email: "daniel.kim@example.com",
    phone: "+82-10-4444-5555",
  },
  {
    name: "Yuki Nakamura",
    matched: "5/21",
    skills: ["Node", "GraphQL", "+1"],
    experience: "3/4",
    email: "yuki.nakamura@example.com",
    phone: "+81-70-5555-6666",
  },
  {
    name: "Mohammed Irfan",
    matched: "2/21",
    skills: ["MongoDB", "Express"],
    experience: "1/4",
    email: "m.irfan@example.com",
    phone: "+91-88999-11223",
  },
  {
    name: "Léa Dubois",
    matched: "6/21",
    skills: ["React", "Docker", "CI/CD"],
    experience: "4/4",
    email: "lea.dubois@example.com",
    phone: "+33-6-12-34-56-78",
  },
  {
    name: "Oscar Rodriguez",
    matched: "7/21",
    skills: ["React", "Redux", "Testing"],
    experience: "4/4",
    email: "oscar.rodriguez@example.com",
    phone: "+34-600-123-456",
  },
  {
    name: "Sara Lee",
    matched: "5/21",
    skills: ["UI", "HTML", "CSS"],
    experience: "2/4",
    email: "sara.lee@example.com",
    phone: "+1-888-999-0000",
  },
  {
    name: "Kevin Wang",
    matched: "6/21",
    skills: ["Full Stack", "React", "MongoDB"],
    experience: "3/4",
    email: "kevin.wang@example.com",
    phone: "+86-188-0000-1111",
  },
  {
    name: "Tanya Sharma",
    matched: "8/21",
    skills: ["React", "Firebase", "Jest"],
    experience: "4/4",
    email: "tanya.sharma@example.com",
    phone: "+91-95555-66778",
  },
  {
    name: "William Brown",
    matched: "9/21",
    skills: ["DevOps", "AWS", "Terraform"],
    experience: "4/4",
    email: "william.brown@example.com",
    phone: "+1-111-222-3333",
  },
  {
    name: "Julia Rossi",
    matched: "3/21",
    skills: ["CSS", "SASS", "Bootstrap"],
    experience: "1/4",
    email: "julia.rossi@example.com",
    phone: "+39-333-444-5555",
  },
  {
    name: "Ali Reza",
    matched: "4/21",
    skills: ["Vue", "Nuxt", "JS"],
    experience: "3/4",
    email: "ali.reza@example.com",
    phone: "+98-912-345-6789",
  },
  {
    name: "Chloe Martinez",
    matched: "5/21",
    skills: ["Figma", "Prototyping"],
    experience: "2/4",
    email: "chloe.martinez@example.com",
    phone: "+1-321-654-0987",
  },
  {
    name: "David Green",
    matched: "6/21",
    skills: ["Redux", "Thunk", "Saga"],
    experience: "3/4",
    email: "david.green@example.com",
    phone: "+44-20-1234-5678",
  },
  {
    name: "Isla McCarthy",
    matched: "3/21",
    skills: ["Python", "Pandas", "ML"],
    experience: "2/4",
    email: "isla.mccarthy@example.com",
    phone: "+44-7890-123456",
  },
  {
    name: "Zainab Ahmed",
    matched: "7/21",
    skills: ["Java", "Jenkins", "CI/CD"],
    experience: "3/4",
    email: "zainab.ahmed@example.com",
    phone: "+92-301-1234567",
  },
  {
    name: "Leo Fischer",
    matched: "2/21",
    skills: ["Go", "Docker"],
    experience: "1/4",
    email: "leo.fischer@example.com",
    phone: "+49-151-12345678",
  },
  {
    name: "Tanvi Iyer",
    matched: "5/21",
    skills: ["React", "Tailwind", "+1"],
    experience: "2/4",
    email: "tanvi.iyer@example.com",
    phone: "+91-99887-76655",
  },
  {
    name: "Pedro Gonzalez",
    matched: "3/21",
    skills: ["Flask", "PostgreSQL"],
    experience: "2/4",
    email: "pedro.gonzalez@example.com",
    phone: "+34-699-888-777",
  },
  {
    name: "Ella Johansson",
    matched: "6/21",
    skills: ["Scrum", "Agile", "Jira"],
    experience: "3/4",
    email: "ella.johansson@example.com",
    phone: "+46-70-123-4567",
  },
  {
    name: "Harshit Verma",
    matched: "8/21",
    skills: ["React", "Redux", "Testing", "+2"],
    experience: "4/4",
    email: "harshit.verma@example.com",
    phone: "+91-91234-12345",
  },
  {
    name: "Anika Sharma",
    matched: "6/21",
    skills: ["UI", "UX", "Design Systems"],
    experience: "3/4",
    email: "anika.sharma@example.com",
    phone: "+91-88990-88990",
  },
  {
    name: "Carlos Mendes",
    matched: "3/21",
    skills: ["PHP", "MySQL"],
    experience: "2/4",
    email: "carlos.mendes@example.com",
    phone: "+351-934-567-890",
  },
  {
    name: "Nikolai Ivanov",
    matched: "4/21",
    skills: ["Linux", "DevOps"],
    experience: "2/4",
    email: "nikolai.ivanov@example.com",
    phone: "+7-926-111-2222",
  },
];

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCandidates = candidates.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(candidates.length / itemsPerPage);
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
            {currentCandidates.map((candidate, index) => (
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
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
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

        {/* Download BTN */}
        <Row className="justify-content-md-center mt-5">
          <Col xs lg="2">
            <Button variant="outline-primary">Excel Download</Button>
          </Col>
          <Col xs lg="1">
          <Link to="/mail-template">
            <Button variant="outline-primary">Email</Button>
          </Link>
          </Col>
          <Col xs lg="2">
            <Button variant="outline-primary">CSV Download</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Page;
