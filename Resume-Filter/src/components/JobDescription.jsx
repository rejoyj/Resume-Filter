import React, { useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Button,
  Badge,
} from "react-bootstrap";
import "./JobDescription.css";
const skillsList = [
  "Photoshop",
  "After Effects",
  "Indesign",
  "Blender",
  "Da Vinci",
  "Illustrator",
  "Figma",
  "Premiere pro",
  "3DS MAX",
];

const JobDescription = () => {
  const [mandatorySkills, setMandatorySkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");

  const handleSkillSelect = (skill, type) => {
    if (type === "mandatory" && !mandatorySkills.includes(skill)) {
      setMandatorySkills([...mandatorySkills, skill]);
    }
    if (type === "preferred" && !preferredSkills.includes(skill)) {
      setPreferredSkills([...preferredSkills, skill]);
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

    // Get existing jobs from localStorage or initialize as empty array
    const existingJobs = JSON.parse(localStorage.getItem("jobDescriptions")) || [];

    // Add new job
    existingJobs.push(jobData);

    // Save back to localStorage
    localStorage.setItem("jobDescriptions", JSON.stringify(existingJobs));

    alert("Job Description Saved Successfully!");

    // Clear form
    setJobTitle("");
    setExperience("");
    setMandatorySkills([]);
    setPreferredSkills([]);
    setDescription("");
  };

  return (
      

     
      <Container className="job-form-container text-center ">

    
   
      <h5 className="text-white text-center">
        ADD JOB DESCRIPTION
      </h5>

      <Form onSubmit={handleSubmit} className="mt-4">
      
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} className=" text-white  p-2 text-center">
            JOB TITLE
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              placeholder="Graphic Designer/Video Editor"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Experience */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} className="text-white rounded-pill p-2 text-center">
            YEARS OF EXPERIENCE
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              placeholder="e.g., 4 Years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Mandatory Skills */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3} className=" text-white rounded-pill p-2 text-center">
            MANDATORY SKILLS
          </Form.Label>
          <Col sm={9}>
            <DropdownButton title="Select Skill" onSelect={(eventKey) => handleSkillSelect(eventKey, "mandatory")}>
              {skillsList.map((skill, idx) => (
                <Dropdown.Item key={idx} eventKey={skill}>
                  {skill}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <div className="mt-2">
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
          <Form.Label column sm={3} className=" text-white rounded-pill p-2 text-center">
            PREFERRED SKILLS
          </Form.Label>
          <Col sm={9}>
            <DropdownButton title="Select Skill" onSelect={(eventKey) => handleSkillSelect(eventKey, "preferred")}>
              {skillsList.map((skill, idx) => (
                <Dropdown.Item key={idx} eventKey={skill}>
                  {skill}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <div className="mt-2">
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

        {/* Job Description */}
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Job description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit" className="rounded-pill px-4">
            SUBMIT
          </Button>
        </div>
      </Form>
    
      </Container>
     
   
  );
};

export default JobDescription;
