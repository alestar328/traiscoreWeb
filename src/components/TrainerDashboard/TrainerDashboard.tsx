import "../../styles/TrainerDashboard.css";
import { FaUsers } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { GiPear } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';


function TrainerDashboard(){



    const navigate = useNavigate();
    return (
        <div className="trainer-dashboard">
            <header className="dashboard-header">
                <h1>Panel de Entrenador</h1>
                <p>Bienvenido al panel de control del entrenador.</p>
            </header>
            <main className="dashboard-main">
                <div className="dashboard-row">




                    <section className="dashboard-section utils-section">
                        <h2>Accesos</h2>
                        <div className="access-buttons">
                            <button
                                className="access-btn black"
                                onClick={() => navigate('/myclients')}
                            >
                                <FaUsers className="access-icon"/>
                                <span>Clientes</span>
                            </button>
                            <button className="access-btn yellow" onClick={() => navigate('/createRoutine')}>
                                <TfiAgenda className="access-icon"/>
                                <span>Rutinas</span>
                            </button>
                            <button className="access-btn green">
                                <GiPear className="access-icon"/>
                                <span>Dietas</span>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}


export default TrainerDashboard;