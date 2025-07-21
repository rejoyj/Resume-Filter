import React, { useState } from 'react';
import { Navbar,Form, Button, Container, Row, Col, Alert, Badge } from 'react-bootstrap';
import logo from "../assets/1.-Manvian-Logo-06.png";

const templates = {
  positive: "Hi [Name],\n\nGreat news! You've been accepted. Welcome aboard!\n\nBest,\nTeam",
  negative: "Hi [Name],\n\nWe regret to inform you that you were not selected.\n\nRegards,\nTeam",
  info: "Hi [Name],\n\nHere is some important information regarding your application.\n\nThanks,\nTeam"
};

function MailTemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('positive');
  const [content, setContent] = useState(templates['positive']);
  const [currentEmail, setCurrentEmail] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddEmail = () => {
    const email = currentEmail.trim();
    if (!email) return;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return;
    }
    if (recipients.includes(email)) {
      setError('This email is already added.');
      return;
    }

    setRecipients([...recipients, email]);
    setCurrentEmail('');
    setError('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setRecipients(recipients.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSend = () => {
    if (recipients.length === 0) {
      setError('Please add at least one recipient email.');
      return;
    }
    setError('');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setSelectedTemplate(template);
    setContent(templates[template]);
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
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h3>Send Mail</h3>

          <Form.Group className="mb-3">
            <Form.Label>Recipient Emails</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Control
                type="email"
                placeholder="Enter email and press Enter or click Add"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="secondary" onClick={handleAddEmail}>Add</Button>
            </div>

            <div className="mb-3">
              {recipients.map((email) => (
                <Badge
                  pill
                  bg="info"
                  className="me-2 mb-2"
                  key={email}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemoveEmail(email)}
                >
                  {email} ✕
                </Badge>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Template</Form.Label>
            <Form.Select value={selectedTemplate} onChange={handleTemplateChange}>
              <option value="positive">Positive Mail</option>
              <option value="negative">Negative Mail</option>
              <option value="info">Info Mail</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mail Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSend}>Send Mail</Button>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          {showAlert && (
            <Alert variant="success" className="mt-3">
              ✅ Mail sent to: <strong>{recipients.join(', ')}</strong>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
       </>
  );
}

export default MailTemplatePage;
