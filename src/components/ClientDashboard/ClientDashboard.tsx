import "../../styles/ClientDashboard.css";

function ClientDashboard() {
    return (
        <div className="client-dashboard">
            <header className="dashboard-header">
                <h1>Panel del Cliente</h1>
            </header>
            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Bienvenido, Cliente</h2>
                    <p>Aquí puedes ver tus estadísticas y actividades recientes.</p>
                    {/* Agrega más componentes o información relevante aquí */}
                </section>
            </main>
        </div>
    );
}
export default ClientDashboard;