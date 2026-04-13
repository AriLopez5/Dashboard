import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

const btnNav = {
    background: '#f0f0f0', border: 'none', borderRadius: '6px',
    width: '28px', height: '28px', cursor: 'pointer', fontSize: '12px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};

function RankingCard({ titulo, emoji, datos, unidad }) {
    if (!datos || datos.length === 0) return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', flex: 1, minWidth: '280px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}>{emoji} {titulo}</div>
            <div style={{ color: '#aaa', fontSize: '13px' }}>Sin datos este mes</div>
        </div>
    );
    const medallas = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', flex: 1, minWidth: '280px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'inherit', marginBottom: '16px' }}>{emoji} {titulo}</div>
            {datos.map((u, i) => (
                <div key={u.usuario_id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px', width: '24px' }}>{medallas[i]}</span>
                    {u.foto_url ? (
                        <img src={u.foto_url} alt={u.nombre} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EDE3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', color: '#8338EC' }}>
                            {u.nombre[0].toUpperCase()}
                        </div>
                    )}
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: 'inherit' }}>{u.nombre}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: i === 0 ? '#E76F51' : '#8338EC' }}>
                        {unidad === '€' ? `${u.valor.toFixed(2)} €` : `${Math.round(u.valor)} min`}
                    </span>
                </div>
            ))}
        </div>
    );
}
function ComunidadPage() {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mesRanking, setMesRanking] = useState(new Date());
    const hoy = new Date();
    const hoyStr = format(hoy, 'yyyy-MM-dd');
    const inicioMesStr = format(new Date(hoy.getFullYear(), hoy.getMonth(), 1), 'yyyy-MM-dd');
    const [fechaInicio, setFechaInicio] = useState(inicioMesStr);
    const [fechaFin, setFechaFin] = useState(hoyStr);
    const [rankingRango, setRankingRango] = useState({ gastos: [], deporte: [] });
    const [errorRango, setErrorRango] = useState('');
    const [cargandoRango, setCargandoRango] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/comunidad`)
            .then(r => r.json())
            .then(data => {
                setDatos(data);
                if (data?.ranking_por_rango) {
                    setRankingRango({
                        gastos: data.ranking_por_rango.gastos || [],
                        deporte: data.ranking_por_rango.deporte || []
                    });
                }
                setLoading(false);
            })
            .catch(() => { setError('Error al cargar los datos'); setLoading(false); });
    }, []);

    const aplicarRango = async () => {
        if (!fechaInicio || !fechaFin) {
            setErrorRango('Selecciona fecha inicio y fecha fin');
            return;
        }
        if (fechaInicio > fechaFin) {
            setErrorRango('La fecha inicio no puede ser mayor que la fecha fin');
            return;
        }

        setErrorRango('');
        setCargandoRango(true);
        try {
            const res = await fetch(`${API_URL}/comunidad?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
            const data = await res.json();
            if (!res.ok || data?.error) {
                setErrorRango(data?.error || 'Error al cargar ranking por rango');
                return;
            }
            setRankingRango({
                gastos: data?.ranking_por_rango?.gastos || [],
                deporte: data?.ranking_por_rango?.deporte || []
            });
        } catch {
            setErrorRango('Error al cargar ranking por rango');
        } finally {
            setCargandoRango(false);
        }
    };

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

    const mesKey = format(mesRanking, 'yyyy-MM');
    const esMesActual = mesKey === format(new Date(), 'yyyy-MM');
    const rankingMes = datos?.rankings_por_mes?.[mesKey] || { gastos: [], deporte: [] };
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
                                {u.foto_url ? (
                                    <img
                                        src={u.foto_url}
                                        alt={u.nombre}
                                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="perfil-avatar-inicial" style={{ width: '44px', height: '44px', fontSize: '18px', flexShrink: 0 }}>
                                        {u.nombre[0].toUpperCase()}
                                    </div>
                                )}
                                {/* Nombre */}
                                <div style={{ minWidth: '100px', flex: 1 }}>
                                    <div className="perfil-nombre" style={{ fontSize: '15px' }}>{u.nombre}</div>
                                </div>
                                {/* Stats inline */}
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">💸 Gastado</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>{(u.gastos_total || 0).toFixed(2)} €</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">📋 Gastos</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>{u.gastos_cantidad || 0}</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">⏱️ Deporte</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>
                                            {horas > 0 ? `${horas}h ${mins}min` : `${Math.round(u.deporte_minutos || 0)} min`}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div className="perfil-stat-label">🏋️ Sesiones</div>
                                        <div className="perfil-stat-value" style={{ fontSize: '15px' }}>{u.deporte_sesiones || 0}</div>
                                    </div>
                                </div>
                                
                            </div>
                        );
                    })
                )}
            </div>
            {/* Rankings mensuales — FUERA del map */}
            <div className="perfil-seccion-titulo" style={{ marginTop: '32px' }}>🏆 Ranking mensual</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <button onClick={() => setMesRanking(subMonths(mesRanking, 1))} style={btnNav}>◀</button>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'inherit', textTransform: 'capitalize', minWidth: '105px', textAlign: 'center' }}>
                    {format(mesRanking, 'MMMM yyyy', { locale: es })}
                </span>
                <button onClick={() => setMesRanking(addMonths(mesRanking, 1))} disabled={esMesActual}
                    style={{ ...btnNav, opacity: esMesActual ? 0.3 : 1, cursor: esMesActual ? 'not-allowed' : 'pointer' }}>▶</button>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <RankingCard titulo="Más gastado" emoji="💸" datos={rankingMes.gastos} unidad="€" />
                <RankingCard titulo="Más deporte" emoji="🏋️" datos={rankingMes.deporte} unidad="min" />
            </div>

            {/* Ranking por rango de fechas */}
            <div className="perfil-seccion-titulo" style={{ marginTop: '32px' }}>🗓️ Ranking por rango de fechas</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Desde</label>
                <input
                    type="date"
                    value={fechaInicio}
                    max={hoyStr}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    style={{ padding: '8px 10px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Hasta</label>
                <input
                    type="date"
                    value={fechaFin}
                    max={hoyStr}
                    onChange={(e) => setFechaFin(e.target.value)}
                    style={{ padding: '8px 10px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
                <button
                    onClick={aplicarRango}
                    disabled={cargandoRango}
                    style={{
                        padding: '8px 14px',
                        border: 'none',
                        borderRadius: '8px',
                        background: cargandoRango ? '#ccc' : '#667eea',
                        color: 'white',
                        fontWeight: '600',
                        cursor: cargandoRango ? 'not-allowed' : 'pointer'
                    }}
                >
                    {cargandoRango ? 'Cargando...' : 'Aplicar rango'}
                </button>
            </div>
            {errorRango && <div className="empty-message" style={{ marginBottom: '12px' }}>{errorRango}</div>}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <RankingCard titulo="Más gastado (rango)" emoji="💸" datos={rankingRango.gastos} unidad="€" />
                <RankingCard titulo="Más deporte (rango)" emoji="🏋️" datos={rankingRango.deporte} unidad="min" />
            </div>
        </div>
    );
}

export default ComunidadPage;