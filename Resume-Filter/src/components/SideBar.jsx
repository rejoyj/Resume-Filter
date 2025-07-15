import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaBriefcase, FaUserCircle } from "react-icons/fa";
import { RiFolderUserFill } from "react-icons/ri";


const SideBar = () => {
  return (
  
     <Nav
      className="flex-column align-items-center bg-light border-end vh-100"
      style={{ width: '60px' }}>
     

      <Nav.Link  className="py-3 border-bottom" title="Jobs">
        <FaBriefcase size={20}/>
      </Nav.Link>

        <Nav.Link  className="py-3 border-bottom" title="Candidates">
       <RiFolderUserFill size={20} />
      </Nav.Link>

    <Nav.Link  className="py-3 border-bottom" title="Candidates">
      <FaUserCircle />
      </Nav.Link>

    </Nav>
  )
}

export default SideBar