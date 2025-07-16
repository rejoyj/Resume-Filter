import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Page from './components/Page.jsx';
import './App.css'
import SideBar from './components/SideBar.jsx';
import Homepage from './components/Homepage.jsx';


function App() {
  

  return (
   
    <div className='d-flex'>
      <SideBar />
     
      <div className='flex-grow-1 p-3'>
        <Page />
       <Homepage />
      </div>
    </div>
   
   
  )
}

export default App
