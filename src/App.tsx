
import './App.css'
import Navbar from './components/Navbar.tsx'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './components/pages/Home.tsx';
import FooterComp  from "./components/FooterComp.tsx";
import Login from './components/pages/Login.tsx';
import CreateRoutine from "./components/TrainerDashboard/CreateRoutine.tsx";
import ClientProfileTUI from "./components/pages/ClientProfileTUI.tsx";
import MyClientsView from "./components/TrainerDashboard/MyClientsView.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard.tsx";
import TrainerDashboard from "./components/TrainerDashboard/TrainerDashboard.tsx";
import ContactWebForm from "./components/pages/ContactWebForm.tsx";
import ClientRegistrationForm from "./components/TrainerDashboard/ClientRegistrationForm.tsx";
import ClientProfileBoard from "./components/ClientDashboard/ClientProfileBoard.tsx";
import UserProfileFormWrapper from "./components/pages/UserProfileFormWrapper.tsx";
import AuthDebugComponent from "./contexts/AuthDebugComponent.tsx";
import ProgressDashboard from "./components/pages/ProgressDashboard.tsx";
import ClientRoutines from "./components/ClientDashboard/ClientRoutines.tsx";
import ClientStats from "./components/pages/ClientStats.tsx";
import PrivacyPolicy from "./components/pages/PrivacyPolicy.tsx";
import TermsOfService from "./components/pages/TermsOfService.tsx";
import DataDeletionRequest from "./components/DataDeletionRequest.tsx";
import CookieConsent from "./components/CookieConsent.tsx";
import LegalCompliance from "./components/pages/LegalCompliance.tsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/profile" element={<UserProfileFormWrapper onGoBack={() => window.history.back()} />} />
            <Route path="/createRoutine" element={<CreateRoutine />} />
            <Route path="/myclients" element={<MyClientsView />} />
            <Route path="/authdebug" element={<AuthDebugComponent />} />
            <Route path="/clientprofile/:uid" element={<ClientProfileTUI />} />
            <Route path="/trainerdashboard" element={<TrainerDashboard />} />
            <Route path="/clientdashboard" element={<ClientDashboard />} />
            <Route path="/contactwebform" element={<ContactWebForm />} />
            <Route path="/clientregistrationform" element={<ClientRegistrationForm />} />
            <Route path="/clientprofileboard" element={<ClientProfileBoard />} />
            <Route path="/progressdashboard" element={<ProgressDashboard />} />
            <Route path="/clientroutines" element={<ClientRoutines />} />
            <Route path="/clientstats/:uid" element={<ClientStats />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/data-deletion-request" element={<DataDeletionRequest />} />
            <Route path="/legal-compliance" element={<LegalCompliance />} />
          </Routes>
        </main>
        <FooterComp />
      {/*  <CookieConsent />*/}
      </Router>
    </div>
  );
}

export default App
