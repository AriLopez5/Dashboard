import { useState, useEffect } from 'react';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

function ComunidadPage() {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/comunidad`)
            .then(r => r.json())
            .then(data => { setDatos(data); setLoading(false); })
            .catch(() => { setError('Error al cargar los datos'); setLoading(false); });
    }, []);

    if (loading) return (
        <div>
            <div className="page-header">
                <h1>🌍 Comunidad</h1>
                <p className="page-subtitle">Resumen global de todos los usuarios</p>
            </div>
            <div className="loading">Cargando datos...</div>
        </div>
    );

    if (error) return (
        <div>
            <div className="page-header">
                <h1>🌍 Comunidad</h1>
            </div>
            <div className="empty-message">{error}</div>
        </div>
    );

    const { usuarios = [], totales = {} } = datos || {};
    const totalHoras = Math.floor((totales.deporte_minutos || 0) / 60);
    const minutosRest = Math.round((totales.deporte_minutos || 0) % 60);

    return (
        <div>
            <div className="page-header">
                <h1>🌍 Comunidad</h1>
                <p className="page-subtitle">Resumen global de todos los usuarios</p>
            </div>

            {/* Tarjetas de totales globales */}
            <div className="perfil-stats-grid" style={{ marginBottom: '32px' }}>
                <div className="perfil-stat-card">
                    <div className="perfil-stat-icon mint">👥</div>
                    <div>
                        <div className="perfil-stat-label">Usuarios activos</div>
                        <div className="perfil-stat-value">{totales.num_usuarios || 0}</div>
                    </div>
                </div>
                <div className="perfil-stat-card">
                    <div className="perfil-stat-icon peach">💸</div>
                    <div>
                        <div className="perfil-stat-label">Total gastado</div>
                        <div className="perfil-stat-value">{(totales.gastos_total || 0).toFixed(2)} €</div>
                    </div>
                </div>
                <div className="perfil-stat-card">
                    <div className="perfil-stat-icon peach">📋</div>
                    <div>
                        <div className="perfil-stat-label">Gastos registrados</div>
                        <div className="perfil-stat-value">{totales.gastos_registros || 0}</div>
                    </div>
                </div>
                <div className="perfil-stat-card">
                    <div className="perfil-stat-icon mint">⏱️</div>
                    <div>
                        <div className="perfil-stat-label">Tiempo entrenando</div>
                        <div className="perfil-stat-value">
                            {totalHoras > 0 ? `${totalHoras}h ${minutosRest}min` : `${Math.round(totales.deporte_minutos || 0)} min`}
                        </div>
                    </div>
                </div>
                <div className="perfil-stat-card">
                    <div className="perfil-stat-icon mint">🏋️</div>
                    <div>
                        <div className="perfil-stat-label">Sesiones totales</div>
                        <div className="perfil-stat-value">{totales.deporte_sesiones || 0}</div>
                    </div>
                </div>
            </div>

            {/* Tabla por usuario */}
            <div className="perfil-seccion-titulo">📊 Desglose por usuario</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {usuarios.length === 0 ? (
                    <div className="empty-message">No hay datos de usuarios todavía.</div>
                ) : (
                    usuarios.map(u => {
                        const horas = Math.floor((u.deporte_minutos || 0) / 60);
                        const mins = Math.round((u.deporte_minutos || 0) % 60);
                        return (
                            <div key={u.usuario_id} className="perfil-header-card" style={{ flexWrap: 'wrap', gap: '16px' }}>
                                {/* Avatar */}
                                <div className="perfil-avatar-inicial" style={{ width: '44px', height: '44px', fontSize: '18px', flexShrink: 0 }}>
                                    {u.nombre[0].toUpperCase()}
                                </div>
                                {/* Nombre */}
                                <div style={{ minWidth: '100px', flex: 1 }}>
                                    <div className="perfil-nombre" style={{ fontSize: '15px' }}>{u.nombre}</div>
                                </div>
                                {/* Stats inline */}
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">💸 Gastado</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>{u.gastos_total.toFixed(2)} €</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">📋 Gastos</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>{u.gastos_cantidad}</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">⏱️ Deporte</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>
                                            {horas > 0 ? `${horas}h ${mins}min` : `${Math.round(u.deporte_minutos)} min`}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">🏋️ Sesiones</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>{u.deporte_sesiones}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ComunidadPage;