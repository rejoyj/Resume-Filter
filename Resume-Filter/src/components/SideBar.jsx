import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaBriefcase, FaUserCircle , FaFile} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { TbTableShare } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import './SideBar.css'

const SideBar = () => {
  return (
  
    <Nav
  className="sidebar sidebar-custom flex-column align-items-center border-end vh-100"
  style={{ width: '80px' }}
>
  <Nav.Link href="/" className="py-3 border-bottom" title="Home">
    <AiFillHome size={40} />
  </Nav.Link>

  <Nav.Link href="/page" className="py-3 border-bottom" title="Results">
    <TbTableShare size={40} />
  </Nav.Link>

  <Nav.Link href="/mail-template" className="py-3 border-bottom" title="Email">
    <MdEmail size={40} />
  </Nav.Link>

  <Nav.Link href="/jobdescription" className="py-3 border-bottom" title="Email">
    <FaFile size={40}/>
  </Nav.Link>

  <Nav.Link href="/" className="py-3 border-bottom" title="Email">
  <FaMessage size={40}/>
  </Nav.Link>


</Nav>

  )
}

export default SideBar