
import './App.css'
import Navbar from './components/Navbar.tsx'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './components/pages/Home.tsx';
import FooterComp  from "./components/FooterComp.tsx";
import ContactWebForm from "./components/pages/ContactWebForm.tsx";
import PrivacyPolicy from "./components/pages/PrivacyPolicy.tsx";
import TermsOfService from "./components/pages/TermsOfService.tsx";
import DataDeletionRequest from "./components/DataDeletionRequest.tsx";
//import CookieConsent from "./components/CookieConsent.tsx";
import LegalCompliance from "./components/pages/LegalCompliance.tsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contactwebform" element={<ContactWebForm />} />
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
