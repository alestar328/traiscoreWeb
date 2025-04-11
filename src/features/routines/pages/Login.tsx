import '../../../styles/Login.css';
import '../../../App.css';
import { useState } from 'react';
import {Button} from "../../../components/Button.tsx";
import logo from "../../../assets/navLogoWhiteS.png";
import {Link} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        // Aquí puedes integrar autenticación
    };
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Acceso</h2>
                <img src={logo} alt="React logo" className="login-icon" />

                <form onSubmit={handleSubmit} className="login-form">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <Link to="/myclients">
                        <Button buttonStyle="btn--outline" buttonSize="btn--large" className="login-btn">
                            Entrar
                        </Button>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;