
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Login from './components/login/Login'
import Home from './components/home/Home'

import Members from './components/membersManagment/members/Members';
import Events from './components/membersManagment/events/Events';
import EventDetails from './components/membersManagment/events/EventDetails';

import CssBaseline from '@mui/material/CssBaseline';
import Family from './components/membersManagment/family/Family';
import LedgerAccount from './components/chartsAccounts/LedgerAccount';
import JournalEntry from './components/finance/journalEntry/JournalEntry';
import Donations from './components/finance/donations/Donations';
import FamilyDetails from './components/membersManagment/family/FamilyDetails';
import Profile from './components/security/Profile';



function App() {


  return (
    <>

      <CssBaseline></CssBaseline>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home' element={<Home />}>
          <Route path='donations' element={<Donations />}></Route>
          <Route path="members" element={<Members />}></Route>
          <Route path="events" element={<Events />}></Route>
          <Route path="families" element={<Family />}></Route>
          <Route path="report"></Route>
          <Route path='ledgerAccount' element={<LedgerAccount />} ></Route>
          <Route path='journalEntry' element={<JournalEntry />} ></Route>
          <Route path="event/:id" element={<EventDetails />}></Route>
          <Route path="family/:id" element={<FamilyDetails />}></Route>
          <Route path='profile' element={<Profile />}></Route>

        </Route>


      </Routes>


    </>
  )
}

export default App


