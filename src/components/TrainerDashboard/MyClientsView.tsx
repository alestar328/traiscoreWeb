import React, { useEffect, useState } from 'react';
import { Users, UserPlus, RefreshCw, Plus, Search } from 'lucide-react';
import { collection, getDocs, query, where, doc, updateDoc } from '@firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { UserEntity, ClientProfile } from '../../models/UserEntity';
import ClientCard from '../ClientCard';
import '../../../src/styles/MyClientsView.css';

interface MyClientsViewProps {
    onClientClick?: (client: ClientProfile) => void;
    onAddClientClick?: () => void;
    onInvitationsClick?: () => void;
}

const MyClientsView: React.FC<MyClientsViewProps> = ({
                                                         onClientClick,
                                                         onAddClientClick,
                                                         onInvitationsClick
                                                     }) => {
    const { currentUser } = useAuth();
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{
        show: boolean;
        clientId: string;
        clientName: string;
    }>({
        show: false,
        clientId: '',
        clientName: ''
    });

    // Cargar clientes del entrenador actual
    const loadClients = async () => {
        if (!currentUser?.uid) {
            setError('No se pudo identificar al entrenador');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            console.log('🔍 Cargando clientes para entrenador:', currentUser.uid);

            // Buscar usuarios que tengan linkedTrainerUid igual al UID del entrenador actual
            const q = query(
                collection(db, 'users'),
                where('linkedTrainerUid', '==', currentUser.uid),
                where('userRole', '==', 'CLIENT')
            );

            const snapshot = await getDocs(q);
            console.log('📄 Documentos encontrados:', snapshot.size);

            const clientsList: ClientProfile[] = [];

            snapshot.forEach((doc) => {
                try {
                    const data = doc.data() as UserEntity;
                    console.log('👤 Cliente encontrado:', doc.id, data);

                    // Convertir birthYear a birthDate si existe

                    const client: ClientProfile = {
                        uid: doc.id,
                        email: data.email,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        photoURL: data.photoURL,
                        birthYear: data.birthYear,
                        gender: data.gender?.toLowerCase() as 'MALE' | 'FEMALE' | 'OTHER', // Convertir a lowercase para compatibilidad
                        userRole: 'CLIENT',
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        isActive: data.isActive,
                        linkedTrainerUid: data.linkedTrainerUid,
                    };

                    clientsList.push(client);
                } catch (parseError) {
                    console.error('❌ Error parseando cliente:', doc.id, parseError);
                }
            });

            // Ordenar por nombre
            clientsList.sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });

            console.log('✅ Clientes cargados exitosamente:', clientsList.length);
            setClients(clientsList);

        } catch (err) {
            console.error('❌ Error cargando clientes:', err);
            setError('Error al cargar clientes. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar vinculación con cliente
    const handleRemoveClient = async (clientId: string) => {
        if (!currentUser?.uid) return;

        try {
            console.log('🗑️ Eliminando vinculación con cliente:', clientId);

            // Actualizar el documento del cliente para remover la vinculación
            const clientRef = doc(db, 'users', clientId);
            await updateDoc(clientRef, {
                linkedTrainerUid: null,
                isActive: false // Marcar como inactivo
            });

            // Actualizar la lista local
            setClients(prev => prev.filter(client => client.uid !== clientId));

            console.log('✅ Cliente desvinculado exitosamente');
            setDeleteConfirm({ show: false, clientId: '', clientName: '' });

        } catch (err) {
            console.error('❌ Error eliminando cliente:', err);
            setError('Error al eliminar cliente. Inténtalo de nuevo.');
        }
    };

    // Filtrar clientes por término de búsqueda
    const filteredClients = clients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        const email = client.email.toLowerCase();
        const search = searchTerm.toLowerCase();

        return fullName.includes(search) || email.includes(search);
    });

    // Cargar clientes al montar el componente
    useEffect(() => {
        loadClients();
    }, [currentUser?.uid]);

    return (
        <div className="myclients-wrapper">
            {/* Header */}
            <div className="myclients-header">
                <div className="header-title">
                    <Users size={32} />
                    <h1>Mis Clientes</h1>
                    <span className="clients-count">
                        {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="header-actions">
                    {/* Barra de búsqueda */}
                    <div className="search-container">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="action-buttons">
                        <button
                            className="refresh-btn"
                            onClick={loadClients}
                            disabled={isLoading}
                            title="Actualizar lista"
                        >
                            <RefreshCw size={20} className={isLoading ? 'spinning' : ''} />
                        </button>

                        {onInvitationsClick && (
                            <button
                                className="invitations-btn"
                                onClick={onInvitationsClick}
                                title="Ver invitaciones"
                            >
                                <UserPlus size={20} />
                                Invitaciones
                            </button>
                        )}

                        {onAddClientClick && (
                            <button
                                className="add-client-btn"
                                onClick={onAddClientClick}
                                title="Agregar cliente"
                            >
                                <Plus size={20} />
                                Agregar Cliente
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando clientes...</p>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={loadClients} className="retry-btn">
                        <RefreshCw size={16} />
                        Reintentar
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredClients.length === 0 && clients.length === 0 && (
                <div className="empty-state">
                    <Users size={64} className="empty-icon" />
                    <h3>No tienes clientes registrados</h3>
                    <p>Comienza a gestionar tus clientes agregando el primero</p>
                    {onAddClientClick && (
                        <button
                            className="add-first-client-btn"
                            onClick={onAddClientClick}
                        >
                            <Plus size={20} />
                            Agregar Primer Cliente
                        </button>
                    )}
                </div>
            )}

            {/* No Search Results */}
            {!isLoading && !error && filteredClients.length === 0 && clients.length > 0 && (
                <div className="no-results-state">
                    <Search size={48} className="no-results-icon" />
                    <h3>No se encontraron clientes</h3>
                    <p>No hay clientes que coincidan con "{searchTerm}"</p>
                    <button
                        className="clear-search-btn"
                        onClick={() => setSearchTerm('')}
                    >
                        Limpiar búsqueda
                    </button>
                </div>
            )}

            {/* Clients Grid */}
            {!isLoading && !error && filteredClients.length > 0 && (
                <div className="ClientsContainer">
                    {filteredClients.map((client) => (
                        <ClientCard
                            key={client.uid}
                            uid={client.uid}
                            firstName={client.firstName}
                            lastName={client.lastName}
                            birthYear={client.birthYear}
                            gender={client.gender}
                            photoURL={client.photoURL}
                            userRole={client.userRole}
                            email={client.email}
                            onDelete={() => setDeleteConfirm({
                                show: true,
                                clientId: client.uid,
                                clientName: `${client.firstName} ${client.lastName}`
                            })}
                            onClick={onClientClick ? () => onClientClick(client) : undefined}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <h3>Confirmar eliminación</h3>
                        <p>
                            ¿Estás seguro de que quieres desvincular al cliente
                            <strong> {deleteConfirm.clientName}</strong>?
                        </p>
                        <p className="warning-text">
                            Esta acción eliminará la vinculación entre tú y este cliente.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setDeleteConfirm({ show: false, clientId: '', clientName: '' })}
                            >
                                Cancelar
                            </button>
                            <button
                                className="confirm-delete-btn"
                                onClick={() => handleRemoveClient(deleteConfirm.clientId)}
                            >
                                Desvincular
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClientsView;