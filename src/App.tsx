
import './App.css'
import Navbar from './components/Navbar.tsx'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './features/routines/pages/Home.tsx';
import Login from './features/routines/pages/Login.tsx';
import CreateRoutine from "./features/routines/pages/CreateRoutine.tsx";
import ClientProfileForm from "./features/routines/pages/ClientProfileForm.tsx";
import MyClientsView from "./features/routines/pages/MyClientsView.tsx";

function App() {
  return (
    <>
      <Router>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path="/login" element={<Login />} />
                <Route path='/createRoutine' element={<CreateRoutine/>}/>
                <Route path='/myclients' element={<MyClientsView/>}/>
                <Route path='/clientprofile' element={<ClientProfileForm/>}/>
            </Routes>
      </Router>
    </>
  )
}

export default App
