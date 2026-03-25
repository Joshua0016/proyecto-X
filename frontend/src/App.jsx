
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Login from './components/login/Login'
import Home from './components/home/Home'
import Finance from './components/finance/Finance';
import Members from './components/membersManagment/members/Members';
import Events from './components/membersManagment/events/Events';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Family from './components/membersManagment/family/Family';
import LedgerAccount from './components/chartsAccounts/LedgerAccount';


function App() {


  return (
    <>
      <ThemeProvider theme={mySettingsStyle}>
        <CssBaseline></CssBaseline>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/home' element={<Home />}>
            <Route path="finance" element={<Finance />}></Route>
            <Route path="members" element={<Members />}></Route>
            <Route path="events" element={<Events />}></Route>
            <Route path="families" element={<Family />}></Route>
            <Route path="report"></Route>
            <Route path='ledgerAccount' element={<LedgerAccount />} >
            </Route>
          </Route>


        </Routes>
      </ThemeProvider>

    </>
  )
}

export default App
//configuracion de colores MUI
const mySettingsStyle = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#007ACC"
    }
  }
})
