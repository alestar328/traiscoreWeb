
import './App.css'
import Navbar from './components/Navbar.tsx'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './components/pages/Home.tsx';
import FooterComp  from "./components/FooterComp.tsx";
import Login from './components/pages/Login.tsx';
import CreateRoutine from "./components/TrainerDashboard/CreateRoutine.tsx";
import ClientProfileForm from "./components/pages/ClientProfileForm.tsx";
import MyClientsView from "./components/TrainerDashboard/MyClientsView.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard.tsx";
import TrainerDashboard from "./components/TrainerDashboard/TrainerDashboard.tsx";
import ContactWebForm from "./components/pages/ContactWebForm.tsx";
import ClientRegistrationForm from "./components/TrainerDashboard/ClientRegistrationForm.tsx";

function App() {
  return (
    <>
      <Router>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path='/createRoutine' element={<CreateRoutine/>}/>
                <Route path='/myclients' element={<MyClientsView/>}/>
                <Route path='/clientprofile' element={<ClientProfileForm/>}/>
                <Route path='/trainerdashboard' element={<TrainerDashboard/>}/>
                <Route path='/clientdashboard' element={<ClientDashboard/>}/>
                <Route path='/contactwebform' element={<ContactWebForm/>}/>
                <Route path='/clientregistrationform' element={<ClientRegistrationForm/>}/>
            </Routes>
          <FooterComp/>
      </Router>
    </>
  )
}

export default App
