
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Login from './components/login/Login'
import Home from './components/home/Home'

import Members from './components/membersManagment/members/Members';
import Events from './components/membersManagment/events/Events';

import CssBaseline from '@mui/material/CssBaseline';
import Family from './components/membersManagment/family/Family';
import LedgerAccount from './components/chartsAccounts/LedgerAccount';
import JournalEntry from './components/finance/journalEntry/JournalEntry';


function App() {


  return (
    <>

      <CssBaseline></CssBaseline>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home' element={<Home />}>

          <Route path="members" element={<Members />}></Route>
          <Route path="events" element={<Events />}></Route>
          <Route path="families" element={<Family />}></Route>
          <Route path="report"></Route>
          <Route path='ledgerAccount' element={<LedgerAccount />} ></Route>
          <Route path='journalEntry' element={<JournalEntry />} ></Route>
        </Route>


      </Routes>


    </>
  )
}

export default App
//configuracion de colores MUI

