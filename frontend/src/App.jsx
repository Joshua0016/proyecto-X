
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import Login from './components/login/Login'
import Home from './components/home/Home'
import Finance from './components/finance/Finance';
import Members from './components/members/Members';
import Admin from './components/admin/Admin';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
            <Route path="events"></Route>
            <Route path="report"></Route>
            <Route path='admin' element={<Admin />}>
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
