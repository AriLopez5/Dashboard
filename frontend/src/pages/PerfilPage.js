import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

const COLORES_FONDO = [
    { label: 'Crema (defecto)', value: '#F7F6F3' },
    { label: 'Blanco', value: '#FFFFFF' },
    { label: 'Menta suave', value: '#EAF7EE' },
    { label: 'Lavanda suave', value: '#F0EBFF' },
    { label: 'Melocotón suave', value: '#FEF0EA' },
    { label: 'Azul suave', value: '#EAF2FB' },
    { label: 'Gris oscuro', value: '#1E1E2E' },
];

function PerfilPage({ gastos, entrenamientos, onFondoChange }) {
    const { user, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [fotoUrl, setFotoUrl] = useState('');
    const [mostrarConfig, setMostrarConfig] = useState(false);
    const [nombreEdit, setNombreEdit] = useState('');
    const [fotoEdit, setFotoEdit] = useState('');
    const [fondoEdit, setFondoEdit] = useState(localStorage.getItem('dashboard_fondo') || '#F7F6F3');
    const [guardando, setGuardando] = useState(false);
    const [guardadoOk, setGuardadoOk] = useState(false);

    useEffect(() => {
        if (user) {
            user.getSession((err, session) => {
                if (!err) {
                    user.getUserAttributes((err2, attrs) => {
                        if (!err2) {
                            const emailAttr = attrs.find(a => a.Name === 'email');
                            if (emailAttr) setEmail(emailAttr.Value);
                        }
                    });
                }
            });
        }
    }, [user]);

    useEffect(() => {
        if (email) {
            fetch(`${API_URL}/perfil?usuario_id=${encodeURIComponent(email)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.perfil) {
                        setNombre(data.perfil.nombre || '');
                        setFotoUrl(data.perfil.foto_url || '');
                        setNombreEdit(data.perfil.nombre || '');
                        setFotoEdit(data.perfil.foto_url || '');
                    }
                })
                .catch(console.error);
        }
    }, [email]);

    const guardarPerfil = async () => {
        setGuardando(true);
        try {
            await fetch(`${API_URL}/perfil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: email, nombre: nombreEdit, foto_url: fotoEdit })
            });

            localStorage.setItem('dashboard_fondo', fondoEdit);
            onFondoChange(fondoEdit);

            setNombre(nombreEdit);
            setFotoUrl(fotoEdit);
            setGuardadoOk(true);
            setTimeout(() => { setGuardadoOk(false); setMostrarConfig(false); }, 1500);
        } catch (e) {
            console.error(e);
        } finally {
            setGuardando(false);
        }
    };

    const displayName = nombre || email;
    const inicial = displayName ? displayName[0].toUpperCase() : '?';

    const totalGastado = gastos.reduce((sum, g) => sum + parseFloat(g.cantidad || 0), 0);
    const gastoMayor = gastos.length > 0 ? gastos.reduce((max, g) => parseFloat(g.cantidad) > parseFloat(max.cantidad) ? g : max, gastos[0]) : null;
    const categorias = [...new Set(gastos.map(g => g.categoria))].length;
    const totalMinutos = entrenamientos.reduce((sum, e) => sum + (e.duracion || 0), 0);
    const totalHoras = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    const tipoMasFrecuente = entrenamientos.length > 0
        ? Object.entries(entrenamientos.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    const statCard = (emoji, label, value, bgClass) => (
        <div className="perfil-stat-card">
            <div className={`perfil-stat-icon ${bgClass}`}>{emoji}</div>
            <div>
                <div className="perfil-stat-label">{label}</div>
                <div className="perfil-stat-value">{value}</div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <h1>👤 Perfil</h1>
                <p className="page-subtitle">Tu información personal</p>
            </div>

            {/* Avatar + info */}
            <div className="perfil-header-card">
                {fotoUrl ? (
                    <img src={fotoUrl} alt="avatar" className="perfil-avatar-img" />
                ) : (
                    <div className="perfil-avatar-inicial">{inicial}</div>
                )}
                <div style={{ flex: 1 }}>
                    <div className="perfil-nombre">{nombre || email}</div>
                    {nombre && <div className="perfil-email">{email}</div>}
                    <div className="perfil-badge">✓ Cuenta verificada</div>
                </div>
                <button className="perfil-config-btn" onClick={() => setMostrarConfig(true)}>
                    ⚙️ Configurar perfil
                </button>
            </div>

            {/* Resumen gastos */}
            <div className="perfil-seccion-titulo">💰 Resumen de gastos</div>
            <div className="perfil-stats-grid">
                {statCard('💸', 'Total gastado', `${totalGastado.toFixed(2)} €`, 'peach')}
                {statCard('📋', 'Número de gastos', gastos.length, 'peach')}
                {statCard('🗂️', 'Categorías usadas', categorias, 'peach')}
                {gastoMayor && statCard('⬆️', 'Gasto mayor', `${parseFloat(gastoMayor.cantidad).toFixed(2)} €`, 'peach')}
            </div>

            {/* Resumen deporte */}
            <div className="perfil-seccion-titulo">💪 Resumen de deporte</div>
            <div className="perfil-stats-grid" style={{ marginBottom: '32px' }}>
                {statCard('⏱️', 'Tiempo total', totalHoras > 0 ? `${totalHoras}h ${minutosRestantes}min` : `${totalMinutos} min`, 'mint')}
                {statCard('🏋️', 'Entrenamientos', entrenamientos.length, 'mint')}
                {tipoMasFrecuente && statCard('🥇', 'Deporte favorito', tipoMasFrecuente, 'mint')}
            </div>

            {/* Cerrar sesión */}
            <button className="perfil-logout-btn" onClick={logout}>
                🚪 Cerrar sesión
            </button>

            {/* Modal configuración */}
            {mostrarConfig && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2 className="modal-titulo">⚙️ Configurar perfil</h2>

                        <div className="form-group">
                            <label>Nombre / apodo</label>
                            <input
                                type="text"
                                value={nombreEdit}
                                onChange={e => setNombreEdit(e.target.value)}
                                placeholder="¿Cómo quieres que te llamemos?"
                            />
                        </div>

                        <div className="form-group">
                            <label>URL de foto de perfil</label>
                            <input
                                type="text"
                                value={fotoEdit}
                                onChange={e => setFotoEdit(e.target.value)}
                                placeholder="https://..."
                            />
                            {fotoEdit && (
                                <img src={fotoEdit} alt="preview" className="perfil-foto-preview"
                                    onError={e => e.target.style.display = 'none'} />
                            )}
                        </div>

                        <div className="form-group">
                            <label>Color de fondo del dashboard</label>
                            <div className="perfil-colores">
                                {COLORES_FONDO.map(c => (
                                    <div
                                        key={c.value}
                                        onClick={() => setFondoEdit(c.value)}
                                        title={c.label}
                                        className={`perfil-color-dot ${fondoEdit === c.value ? 'activo' : ''}`}
                                        style={{ background: c.value }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="modal-botones">
                            <button className="modal-btn-cancelar" onClick={() => setMostrarConfig(false)}>
                                Cancelar
                            </button>
                            <button
                                className="modal-btn-guardar"
                                onClick={guardarPerfil}
                                disabled={guardando}
                                style={{ background: guardadoOk ? '#D8F3DC' : '#2D6A4F', color: guardadoOk ? '#2D6A4F' : '#fff' }}
                            >
                                {guardadoOk ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PerfilPage;