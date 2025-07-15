import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Page from './components/Page.jsx';
import './App.css'
import SideBar from './components/SideBar.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='d-flex'>
      <SideBar />
      <div className='flex-grow-1 p-3'>
        <Page />
      </div>
    </div>
   
  //   <>
  //  <SideBar />
  //   <Page/>
  //   </>
   
  )
}

export default App
