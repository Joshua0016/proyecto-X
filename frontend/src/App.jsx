
import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './components/login/Login'
import Home from './components/home/Home'
function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home' element={<Home />}></Route>
      </Routes>
    </>
  )
}

export default App
