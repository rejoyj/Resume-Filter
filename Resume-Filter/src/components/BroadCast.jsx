import React, { useState } from 'react';
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import { FaBullhorn } from "react-icons/fa";
import "./BroadCast.css"; // <-- Custom styles

const BroadCast = () => {
  const [message, setMessage] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [recipients, setRecipients] = useState([
    { name: "Akshaya R", email: "rathinamakshaya4@gmail.com", selected: false },
    { name: "Rejoy", email: "rejoy@gmail.com", selected: false }
  ]);

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setRecipients(recipients.map(r => ({ ...r, selected: newState })));
  };

  const handleSelect = (index) => {
    const updated = [...recipients];
    updated[index].selected = !updated[index].selected;
    setRecipients(updated);
    setSelectAll(updated.every(r => r.selected));
  };

  const handleSend = () => {
    const selectedRecipients = recipients.filter(r => r.selected);
    if (!message.trim()) {
      alert("Please write a message.");
      return;
    }
    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }

    alert(`Message sent to: ${selectedRecipients.map(r => r.name).join(", ")}`);
    clearForm();
  };

  const handleCancel = () => {
    clearForm();
  };

  const clearForm = () => {
    setMessage("");
    setRecipients(recipients.map(r => ({ ...r, selected: false })));
    setSelectAll(false);
  };

  return (
    <Container fluid className='container-wrapper'>
      <Container className="d-flex justify-content-center mt-5">
        <div className="broadcast-box shadow-lg">
          <div className="broadcast-header text-white text-center py-2">
            <FaBullhorn className="me-2" />
            <strong>BROADCASTING MESSAGES</strong>
          </div>

          <Form className="p-3">
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="custom-textarea"
              />
            </Form.Group>

            <ListGroup className="mb-3 recipient-list">
              <ListGroup.Item className="list-header">
                <Form.Check
                  type="checkbox"
                  label="Select all"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </ListGroup.Item>
              {recipients.map((r, idx) => (
                <ListGroup.Item key={idx} className="list-item">
                  <Form.Check
                    type="checkbox"
                    label={<span className="recipient-label">{r.name} <small className="text-muted">({r.email})</small></span>}
                    checked={r.selected}
                    onChange={() => handleSelect(idx)}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleCancel}>Cancel</Button>
              <Button variant="primary" onClick={handleSend}>Send Message</Button>
            </div>
          </Form>
        </div>
      </Container>
    </Container>
  );
};

export default BroadCast;
