import "../../styles/TrainerDashboard.css";
import { FaUsers } from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";
import { GiPear } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';


function TrainerDashboard(){
    const membershipData = [
        { tier: "Básica", count: 10, price: 20 },
        { tier: "Estándar", count: 5, price: 35 },
        { tier: "Premium", count: 3, price: 50 },
        { tier: "Élite", count: 2, price: 80 },
    ];

    const totalRevenue = membershipData.reduce((acc, plan) => acc + plan.count * plan.price, 0);

    const upcomingReviews = [
        { name: "Carlos Gómez", reviewDate: "2025-05-10" },
        { name: "Lucía Pérez", reviewDate: "2025-05-12" },
        { name: "Miguel Torres", reviewDate: "2025-05-15" },
        { name: "Ana Martínez", reviewDate: "2025-05-18" },
    ];
    const navigate = useNavigate();
    return (
        <div className="trainer-dashboard">
            <header className="dashboard-header">
                <h1>Panel de Entrenador</h1>
                <p>Bienvenido al panel de control del entrenador.</p>
            </header>
            <main className="dashboard-main">
                <div className="dashboard-row">
                    <section className="dashboard-section membership-section">
                        <h2 className="membership-title">INGRESOS MENSUALES</h2>
                        <p className="membership-total">{totalRevenue} €</p>
                        <div className="membership-summary">
                            {membershipData.map((plan, index) => (
                                <div key={index} className={`membership-card ${plan.tier.toLowerCase()}`}>
                                    <h3>{plan.tier}</h3>
                                    <p className="price">{plan.price} €</p>
                                    <div className="card-footer">{plan.count} usuarios</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="dashboard-section review-section">
                        <h2>Próximas Revisiones de Clientes</h2>
                        <table className="review-table">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Fecha de Revisión</th>
                            </tr>
                            </thead>
                            <tbody>
                            {upcomingReviews.map((client, index) => (
                                <tr key={index}>
                                    <td>{client.name}</td>
                                    <td>{client.reviewDate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>

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