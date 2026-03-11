import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

function getEmail(user) {
    return new Promise((resolve) => {
        if (!user) return resolve(null);
        user.getUserAttributes((err, attrs) => {
            if (err || !attrs) return resolve(null);
            const emailAttr = attrs.find(a => a.Name === 'email');
            resolve(emailAttr ? emailAttr.Value : null);
        });
    });
}

function getMesActual() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function BarraProgreso({ porcentaje, color }) {
    const pct = Math.min(porcentaje, 100);
    const esGradiente = color.startsWith('linear-gradient');
    return (
        <div style={{
            background: 'var(--border, #e8e6e1)',
            borderRadius: '999px',
            height: '12px',
            overflow: 'hidden',
            width: '100%',
        }}>
            <div style={{
                height: '100%',
                width: `${pct}%`,
                background: color,
                borderRadius: '999px',
                transition: 'width 0.6s ease',
                backgroundSize: esGradiente ? '200% 100%' : undefined,
                animation: esGradiente ? 'gradientMove 2s linear infinite' : undefined,
            }} />
            <style>{`
                @keyframes gradientMove {
                    0%   { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
            `}</style>
        </div>
    );
}

function PresupuestoMensual({ tipo, gastos, entrenamientos }) {
    // tipo: 'gastos' | 'deporte'
    const { user } = useAuth();
    const [email, setEmail] = useState(null);
    const [meta, setMeta] = useState(null);
    const [editando, setEditando] = useState(false);
    const [valorEdit, setValorEdit] = useState('');
    const [guardando, setGuardando] = useState(false);
    const mes = getMesActual();

    useEffect(() => {
        if (user) getEmail(user).then(setEmail);
    }, [user]);

    const cargarMeta = useCallback(async () => {
        if (!email) return;
        try {
            const res = await fetch(`${API_URL}/metas?usuario_id=${encodeURIComponent(email)}&mes=${mes}`);
            const data = await res.json();
            setMeta(data.meta || null);
        } catch (e) {
            console.error(e);
        }
    }, [email, mes]);

    useEffect(() => {
        cargarMeta();
    }, [cargarMeta]);

    const guardarMeta = async () => {
        if (!email || valorEdit === '') return;
        setGuardando(true);
        try {
            const campo = tipo === 'gastos' ? 'presupuesto_gastos' : 'meta_sesiones';
            await fetch(`${API_URL}/metas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: email,
                    mes,
                    [campo]: parseFloat(valorEdit),
                    // Mantener el otro campo si ya existe
                    ...(meta && tipo === 'gastos' && meta.meta_sesiones ? { meta_sesiones: meta.meta_sesiones } : {}),
                    ...(meta && tipo === 'deporte' && meta.presupuesto_gastos ? { presupuesto_gastos: meta.presupuesto_gastos } : {}),
                })
            });
            await cargarMeta();
            setEditando(false);
            setValorEdit('');
        } catch (e) {
            console.error(e);
        } finally {
            setGuardando(false);
        }
    };

    // Calcular progreso
    const mesActual = mes;
    const valorMeta = tipo === 'gastos' ? meta?.presupuesto_gastos : meta?.meta_sesiones;

    const valorActual = tipo === 'gastos'
        ? gastos.filter(g => g.fecha?.startsWith(mesActual)).reduce((sum, g) => sum + parseFloat(g.cantidad || 0), 0)
        : entrenamientos.filter(e => e.fecha?.startsWith(mesActual)).length;

    const porcentaje = valorMeta ? (valorActual / valorMeta) * 100 : 0;
    const metaDeporteAlcanzada = tipo === 'deporte' && porcentaje >= 100;
    const presupuestoSuperado = tipo === 'gastos' && porcentaje >= 100;

    const colorBarra = metaDeporteAlcanzada
        ? 'linear-gradient(90deg, #f9c74f, #90be6d, #43aa8b, #577590, #8338EC)'
        : presupuestoSuperado
            ? 'linear-gradient(90deg, #E76F51, #c0392b, #E76F51)'
            : porcentaje >= 80
                ? '#f4a261'
                : tipo === 'gastos' ? '#2D6A4F' : '#8338EC';

    const etiqueta = tipo === 'gastos'
        ? { titulo: '💰 Presupuesto del mes', unidad: '€', placeholder: 'Ej: 500' }
        : { titulo: '🏋️ Meta de sesiones', unidad: 'sesiones', placeholder: 'Ej: 12' };

    const mesNombre = new Date(mesActual + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    // Partículas de confeti (deporte)
    const confettiPieces = metaDeporteAlcanzada
        ? Array.from({ length: 18 }, (_, i) => ({
            id: i,
            left: `${5 + (i * 5.5) % 90}%`,
            color: ['#f9c74f', '#90be6d', '#43aa8b', '#8338EC', '#E76F51', '#457B9D', '#f4a261'][i % 7],
            delay: `${(i * 0.15) % 1.8}s`,
            size: 7 + (i % 4) * 3,
        }))
        : [];

    // Sirenas para presupuesto superado
    const sirenas = presupuestoSuperado
        ? Array.from({ length: 6 }, (_, i) => ({
            id: i,
            left: `${8 + i * 16}%`,
            delay: `${i * 0.2}s`,
        }))
        : [];

    return (
        <div style={{
            background: metaDeporteAlcanzada
                ? 'linear-gradient(135deg, #f0fdf4 0%, #ede3fc 100%)'
                : presupuestoSuperado
                    ? 'linear-gradient(135deg, #fff5f5 0%, #ffe0d6 100%)'
                    : 'var(--surface, #fff)',
            borderRadius: 'var(--radius, 16px)',
            padding: '20px 24px',
            boxShadow: metaDeporteAlcanzada
                ? '0 4px 20px rgba(131,56,236,0.15)'
                : presupuestoSuperado
                    ? '0 4px 20px rgba(231,111,81,0.2)'
                    : 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.06))',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
            animation: presupuestoSuperado ? 'flashRed 1.5s ease-in-out infinite' : undefined,
        }}>
            {/* Confeti animado */}
            {confettiPieces.map(p => (
                <div key={p.id} style={{
                    position: 'absolute',
                    top: '-10px',
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    borderRadius: p.id % 3 === 0 ? '50%' : p.id % 3 === 1 ? '2px' : '0',
                    animation: `confettiFall 2.5s ${p.delay} ease-in infinite`,
                    opacity: 0.85,
                    pointerEvents: 'none',
                }} />
            ))}

            {/* Sirenas animadas — fila centrada encima de la cabecera */}
            {presupuestoSuperado && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '-8px',
                    marginBottom: '8px',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}>
                    {sirenas.map(s => (
                        <span key={s.id} style={{
                            fontSize: '16px',
                            animation: `sirenaPulse 0.8s ${s.delay} ease-in-out infinite`,
                            display: 'inline-block',
                        }}>🚨</span>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes confettiFall {
                    0%   { transform: translateY(-10px) rotate(0deg); opacity: 0.85; }
                    100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
                }
                @keyframes gradientMove {
                    0%   { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                @keyframes sirenaPulse {
                    0%, 100% { transform: scale(1) rotate(-10deg); opacity: 0.7; }
                    50%       { transform: scale(1.3) rotate(10deg); opacity: 1; }
                }
                @keyframes flashRed {
                    0%, 100% { box-shadow: 0 4px 20px rgba(231,111,81,0.2); }
                    50%       { box-shadow: 0 4px 28px rgba(231,111,81,0.45); }
                }
            `}</style>
            {/* Cabecera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text, #1a1a2e)' }}>
                        {etiqueta.titulo}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)', marginTop: '2px', textTransform: 'capitalize' }}>
                        {mesNombre}
                    </div>
                </div>
                <button
                    onClick={() => { setEditando(!editando); setValorEdit(valorMeta || ''); }}
                    style={{
                        background: 'var(--surface-alt, #f7f6f3)',
                        border: '1.5px solid var(--border, #e8e6e1)',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        color: 'var(--text, #1a1a2e)',
                    }}
                >
                    {valorMeta ? '✏️ Cambiar meta' : '➕ Definir meta'}
                </button>
            </div>

            {/* Formulario edición */}
            {editando && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="number"
                        min="0"
                        value={valorEdit}
                        onChange={e => setValorEdit(e.target.value)}
                        placeholder={etiqueta.placeholder}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid var(--border, #e8e6e1)',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            width: '120px',
                            outline: 'none',
                        }}
                        onFocus={e => e.target.style.border = `1.5px solid ${colorBarra}`}
                        onBlur={e => e.target.style.border = '1.5px solid var(--border, #e8e6e1)'}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{etiqueta.unidad}</span>
                    <button
                        onClick={guardarMeta}
                        disabled={guardando || valorEdit === ''}
                        style={{
                            background: colorBarra,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '700',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                        }}
                    >
                        {guardando ? '...' : 'Guardar'}
                    </button>
                    <button
                        onClick={() => setEditando(false)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'inherit' }}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {/* Sin meta definida */}
            {!valorMeta && !editando && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted, #888)', fontStyle: 'italic' }}>
                    No has definido una meta para este mes. Pulsa "Definir meta" para empezar.
                </div>
            )}

            {/* Barra de progreso */}
            {valorMeta && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            {tipo === 'gastos'
                                ? `${valorActual.toFixed(2)} € de ${valorMeta} €`
                                : `${valorActual} de ${valorMeta} sesiones`}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: colorBarra }}>
                            {porcentaje.toFixed(0)}%
                        </span>
                    </div>

                    <BarraProgreso porcentaje={porcentaje} color={colorBarra} />

                    {/* Avisos */}
                    {porcentaje >= 100 && (
                        <div style={{
                            marginTop: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '700',
                            background: metaDeporteAlcanzada ? 'rgba(131,56,236,0.1)' : 'rgba(231,111,81,0.12)',
                            color: metaDeporteAlcanzada ? '#8338EC' : '#c0392b',
                            border: metaDeporteAlcanzada ? '1.5px solid rgba(131,56,236,0.2)' : '1.5px solid rgba(231,111,81,0.3)',
                            animation: presupuestoSuperado ? 'flashRed 1.5s ease-in-out infinite' : undefined,
                        }}>
                            {tipo === 'gastos'
                                ? `🚨 ¡Presupuesto superado! Te has pasado ${(valorActual - valorMeta).toFixed(2)} € este mes`
                                : `🎉 ¡Meta alcanzada! Has completado tu objetivo de sesiones de este mes. ¡Increíble!`}
                        </div>
                    )}
                    {porcentaje >= 80 && porcentaje < 100 && (
                        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FFF3E0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#f4a261' }}>
                            {tipo === 'gastos'
                                ? `⚠️ Te queda solo ${(valorMeta - valorActual).toFixed(2)} € del presupuesto`
                                : `💪 ¡Casi! Te faltan ${Math.ceil(valorMeta - valorActual)} sesiones para tu meta`}
                        </div>
                    )}
                    {porcentaje < 80 && tipo === 'deporte' && valorActual > 0 && (
                        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            Te faltan {Math.ceil(valorMeta - valorActual)} sesiones para llegar a tu meta 💪
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PresupuestoMensual;