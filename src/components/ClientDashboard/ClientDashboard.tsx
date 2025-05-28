import "../../styles/ClientDashboard.css";
import {FaChartLine, FaDumbbell, FaUser} from "react-icons/fa";
import {Link} from "react-router-dom";

function ClientDashboard() {
    return (
        <div className="client-dashboard">
            <header className="dashboard-header">
                <h1>Panel del Cliente</h1>
            </header>
            <main className="dashboard-main">
                <section className="dashboard-cards">
                    <Link to="/clientprofileboard" className="dashboard-card">
                        <FaUser className="card-icon" />
                        <h3>Mis datos</h3>
                    </Link>

                    <div className="dashboard-card">
                        <FaDumbbell className="card-icon" />
                        <h3>Mis rutinas</h3>
                    </div>



                    <Link to="/progressdashboard" className="dashboard-card">
                        <FaChartLine className="card-icon" />
                        <h3>Mi progreso</h3>
                    </Link>


                </section>
            </main>
        </div>
    );
}
export default ClientDashboard;