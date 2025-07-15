import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Page from './components/Page.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Page/>
  )
}

export default App
