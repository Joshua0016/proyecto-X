
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Login from './components/login/Login'
import Home from './components/home/Home'
import Finance from './components/finance/Finance';
import Members from './components/members/Members';
import Admin from './components/admin/Admin';

function App() {


  return (
    <>

      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home' element={<Home />}>
          <Route path="finance" element={<Finance />}></Route>
          <Route path="members" element={<Members />}></Route>
          <Route path="events"></Route>
          <Route path="report"></Route>
          <Route path='admin' element={<Admin />}>
          </Route>
        </Route>


      </Routes>
    </>
  )
}

export default App
