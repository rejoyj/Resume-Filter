import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Page from './components/Page.jsx';
import SideBar from './components/SideBar.jsx';
import Homepage from './components/Homepage.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex">
        {/* Sidebar visible on all pages */}
        <SideBar />

        {/* Page content based on routing */}
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/page" element={<Page />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
