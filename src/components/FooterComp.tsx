import { FaFacebookF, FaTwitter, FaPaperPlane, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/FooterComp.css';

const FooterComp = () => {
    return (
        <footer className="footerContainer">
            <div className="topSection">
                <div className="logo">
                    <div className="bar bar-pink" />
                    <div className="bar bar-orange" />
                    <div className="bar bar-blue" />
                </div>

                <nav className="navMenu">
                    <a href="#">About</a>
                    <a href="#">Features</a>
                    <a href="#">Pricing</a>
                    <a href="#">Gallery</a>
                    <a href="#">Team</a>
                </nav>

                <div className="searchContainer">
                    <input type="text" placeholder="search..." className="searchInput" />
                    <button className="searchButton">🔍</button>
                </div>

                <div className="socialIcons">
                    <a href="#"><FaFacebookF /></a>
                    <a href="#"><FaTwitter /></a>
                    <a href="#"><FaPaperPlane /></a>
                    <a href="#"><FaInstagram /></a>
                </div>
            </div>

            <hr className="separator" />

            <div className="bottomSection">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-service">Terms of Service</Link>
                <Link to="/data-deletion-request">Delete My Data</Link>
                <a href="#contact">Contact Us</a>
                <a href="#support">Support</a>
            </div>
        </footer>
    );
};

export default FooterComp;