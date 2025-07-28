
import React, { useState } from 'react';
import { Container, Col, Form, InputGroup, Button } from "react-bootstrap";
import { MdSend } from "react-icons/md";
import botImage from "../assets/chatbot.png";
import "./Chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How may I assist you today?" }
  ]);

  const handleSend = () => {
    if (input.trim() === "") return;

    
    const newMessages = [...messages, { sender: "user", text: input }];

   
    const botReply = getBotReply(input);
    newMessages.push({ sender: "bot", text: botReply });

    setMessages(newMessages);
    setInput("");
  };

  const getBotReply = (message) => {
  
    message = message.toLowerCase();
    if (message.includes("hello") || message.includes("hi")) return "Hello! ";
    if (message.includes("your name")) return "I'm your friendly chatbot assistant.";
    if (message.includes("help")) return "Sure! Tell me what you need help with.";
    return "I'm not sure how to respond to that yet.";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Col className="bg-primary bg-opacity-25 d-flex flex-column justify-content-between">
        
        {/* Chatbot Header */}
        <div className="text-center mt-4">
          <img src={botImage} alt="Chatbot" className="chatbot-image" style={{ width: "150px" }} />
          <h4 className="mt-3">
            How may I <span className="text-primary">assist</span> you today?
          </h4>
        </div>

        {/* Message display area */}
        <div className="chat-area flex-grow-1 px-5 my-3 overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.sender === "user" ? "text-end" : "text-start"}`}>
              <span className={`message-bubble ${msg.sender}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="px-5 pb-4">
          <InputGroup className="shadow rounded-pill">
            <Form.Control
              placeholder="Ask your queries..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border-0 rounded-start-pill px-4"
            />
            <Button variant="primary" className="rounded-end-pill px-4" onClick={handleSend}>
              <MdSend size={20} />
            </Button>
          </InputGroup>
        </div>
      </Col>
    </Container>
  );
};

export default Chatbot;
