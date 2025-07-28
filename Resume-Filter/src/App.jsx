import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Page from './components/Page.jsx';
import SideBar from './components/SideBar.jsx';
import Homepage from './components/Homepage.jsx';
import MailTemplatePage from './components/MailTemplatePage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JobDescription from './components/JobDescription.jsx';
import Chatbot from './components/Chatbot.jsx'
import BroadCast from './components/BroadCast.jsx'
function App() {
  return (
    <BrowserRouter>
      <div className="d-flex">
        {/* Sidebar visible on all pages */}
        <SideBar />

        {/* Page content based on routing */}
        <div className="flex-grow-1 p-0">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/page" element={<Page />} />
            <Route path="/mail-template" element={<MailTemplatePage />} />
            <Route path='/jobdescription' element={<JobDescription />} />
             <Route path='/Chatbot' element={<Chatbot />} />
            <Route path='/broadcast' element={<BroadCast />} /> 
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
