import ClientCard from "../components/ClientCard.tsx";
import '../../../styles/MyClientsView.css';

const clients = [
    { fullName: "Ana", lastName: "López", age: 28, gender: "Femenino", sport: "CrossFit" , photoUrl:""},
    { fullName: "Carlos", lastName: "Martínez", age: 35, gender: "Masculino", sport: "Ciclismo" },
    { fullName: "Lucía", lastName: "Pérez", age: 24, gender: "Femenino", sport: "Yoga" },
    { fullName: "David", lastName: "Gómez", age: 40, gender: "Masculino", sport: "Boxeo" },
    { fullName: "Laura", lastName: "Ramírez", age: 32, gender: "Femenino", sport: "Pilates" },
    { fullName: "Jorge", lastName: "Fernández", age: 30, gender: "Masculino", sport: "Running" },
    { fullName: "Sofía", lastName: "Torres", age: 22, gender: "Femenino", sport: "Natación" },
    { fullName: "Mario", lastName: "Ruiz", age: 27, gender: "Masculino", sport: "Triatlón" },
    { fullName: "Elena", lastName: "Mendoza", age: 31, gender: "Femenino", sport: "Pádel" },
    { fullName: "Andrés", lastName: "Vega", age: 29, gender: "Masculino", sport: "CrossFit" },
    { fullName: "Isabel", lastName: "Romero", age: 34, gender: "Femenino", sport: "Ciclismo" },
    { fullName: "Pedro", lastName: "Navarro", age: 38, gender: "Masculino", sport: "Fútbol" },
];





function MyClientsView() {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Mis clientes</h1>

            <div className="ClientsContainer">
                {clients.map((client, index) => (
                    <ClientCard
                        key={index}
                        fullName={client.fullName}
                        lastName={client.lastName}
                        age={client.age}
                        gender={client.gender}
                        sport={client.sport}
                        photoUrl={client.photoUrl}
                    />
                ))}
            </div>
        </div>
    );
}

export default MyClientsView;