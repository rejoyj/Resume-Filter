import React, { useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Badge,
  Card,
  InputGroup,
  Navbar 
} from "react-bootstrap";
import "./JobDescription.css";
import logo from "../assets/1.-Manvian-Logo-06.png";

const JobDescription = () => {
  const [mandatorySkills, setMandatorySkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [newMandatorySkill, setNewMandatorySkill] = useState("");
  const [newPreferredSkill, setNewPreferredSkill] = useState("");

  const addSkill = (type) => {
    if (type === "mandatory" && newMandatorySkill.trim() !== "") {
      setMandatorySkills([...mandatorySkills, newMandatorySkill.trim()]);
      setNewMandatorySkill("");
    }
    if (type === "preferred" && newPreferredSkill.trim() !== "") {
      setPreferredSkills([...preferredSkills, newPreferredSkill.trim()]);
      setNewPreferredSkill("");
    }
  };

  const removeSkill = (skill, type) => {
    if (type === "mandatory") {
      setMandatorySkills(mandatorySkills.filter((s) => s !== skill));
    } else {
      setPreferredSkills(preferredSkills.filter((s) => s !== skill));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      jobTitle,
      experience,
      mandatorySkills,
      preferredSkills,
      description,
      createdAt: new Date().toISOString(),
    };

    const existingJobs =
      JSON.parse(localStorage.getItem("jobDescriptions")) || [];

    existingJobs.push(jobData);
    localStorage.setItem("jobDescriptions", JSON.stringify(existingJobs));

    alert("Job Description Saved Successfully!");

    setJobTitle("");
    setExperience("");
    setMandatorySkills([]);
    setPreferredSkills([]);
    setDescription("");
  };

  return (
    <>
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
   
    <Container className="py-5">
       
      <Card className="shadow-lg border-0 p-4 bg-light">
        <h4 className="text-center text-primary mb-4">Add Job Description</h4>
        <Form onSubmit={handleSubmit}>
          {/* Job Title */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="fw-semibold text-end">
              Job Title
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Graphic Designer / Video Editor"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          {/* Experience */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="fw-semibold text-end">
              Experience
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="e.g. 2+ Years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </Col>
          </Form.Group>

          {/* Mandatory Skills */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="fw-semibold text-end">
              Mandatory Skills
            </Form.Label>
            <Col sm={9}>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Type a skill and press Add"
                  value={newMandatorySkill}
                  onChange={(e) => setNewMandatorySkill(e.target.value)}
                />
                <Button
                  variant="outline-primary"
                  onClick={() => addSkill("mandatory")}
                  className="rounded-pill px-4 fw-semibold"
                >
                  Add
                </Button>
              </InputGroup>
              <div>
                {mandatorySkills.map((skill, index) => (
                  <Badge
                    pill
                    bg="primary"
                    key={index}
                    className="me-2 mb-1"
                    onClick={() => removeSkill(skill, "mandatory")}
                    style={{ cursor: "pointer" }}
                  >
                    {skill} &times;
                  </Badge>
                ))}
              </div>
            </Col>
          </Form.Group>

          {/* Preferred Skills */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="fw-semibold text-end">
              Preferred Skills
            </Form.Label>
            <Col sm={9}>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Type a skill and press Add"
                  value={newPreferredSkill}
                  onChange={(e) => setNewPreferredSkill(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => addSkill("preferred")}
                  className="rounded-pill px-4 fw-semibold"
                >
                  Add
                </Button>
              </InputGroup>
              <div>
                {preferredSkills.map((skill, index) => (
                  <Badge
                    pill
                    bg="secondary"
                    key={index}
                    className="me-2 mb-1"
                    onClick={() => removeSkill(skill, "preferred")}
                    style={{ cursor: "pointer" }}
                  >
                    {skill} &times;
                  </Badge>
                ))}
              </div>
            </Col>
          </Form.Group>

          {/* Description */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3} className="fw-semibold text-end">
              Job Description
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write the full job description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Col>
          </Form.Group>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <Button
              type="submit"
              variant="primary"
              className="px-5 rounded-pill"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
     </>
  );
};

export default JobDescription;
