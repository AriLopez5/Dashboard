import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_URL = 'https://q5cdb6cw0d.execute-api.eu-north-1.amazonaws.com/prod';

const COLORES_FONDO = [
    { label: 'Crema (defecto)', value: '#F7F6F3' },
    { label: 'Blanco',          value: '#FFFFFF' },
    { label: 'Menta suave',     value: '#EAF7EE' },
    { label: 'Lavanda suave',   value: '#F0EBFF' },
    { label: 'Melocotón suave', value: '#FEF0EA' },
    { label: 'Azul suave',      value: '#EAF2FB' },
    { label: 'Gris oscuro',     value: '#1E1E2E' },
];

function PerfilPage({ gastos, entrenamientos, onFondoChange }) {
    const { user, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [fotoUrl, setFotoUrl] = useState('');
    const [mostrarConfig, setMostrarConfig] = useState(false);
    const [nombreEdit, setNombreEdit] = useState('');
    const [fondoEdit, setFondoEdit] = useState(localStorage.getItem('dashboard_fondo') || '#F7F6F3');
    const [guardando, setGuardando] = useState(false);
    const [guardadoOk, setGuardadoOk] = useState(false);
    const [subiendoFoto, setSubiendoFoto] = useState(false);
    const [fotoPreview, setFotoPreview] = useState('');
    const [fotoFile, setFotoFile] = useState(null);
    const fileInputRef = useRef(null);

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
                    }
                })
                .catch(console.error);
        }
    }, [email]);

    // Al seleccionar archivo — mostrar preview
    const handleFotoSeleccionada = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const guardarPerfil = async () => {
        setGuardando(true);
        try {
            let nuevaFotoUrl = fotoUrl;

            // Si hay un archivo nuevo, subirlo via Lambda (base64)
            if (fotoFile) {
                setSubiendoFoto(true);
                const extension = fotoFile.name.split('.').pop().toLowerCase();

                // 1. Convertir archivo a base64
                const imagen_b64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(fotoFile);
                });

                // 2. Enviar a Lambda que sube a S3
                const res = await fetch(`${API_URL}/foto`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario_id: email, extension, imagen_b64 })
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                nuevaFotoUrl = data.foto_url;
                setSubiendoFoto(false);
            }

            // 3. Guardar nombre y foto_url en DynamoDB
            await fetch(`${API_URL}/perfil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: email,
                    nombre: nombreEdit,
                    foto_url: nuevaFotoUrl
                })
            });

            // 4. Guardar fondo
            localStorage.setItem('dashboard_fondo', fondoEdit);
            onFondoChange(fondoEdit);

            setNombre(nombreEdit);
            setFotoUrl(nuevaFotoUrl);
            setFotoFile(null);
            setFotoPreview('');
            setGuardadoOk(true);
            setTimeout(() => { setGuardadoOk(false); setMostrarConfig(false); }, 1500);

        } catch (e) {
            console.error(e);
        } finally {
            setGuardando(false);
            setSubiendoFoto(false);
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

                        {/* Nombre */}
                        <div className="form-group">
                            <label>Nombre / apodo</label>
                            <input
                                type="text"
                                value={nombreEdit}
                                onChange={e => setNombreEdit(e.target.value)}
                                placeholder="¿Cómo quieres que te llamemos?"
                            />
                        </div>

                        {/* Foto de perfil */}
                        <div className="form-group">
                            <label>Foto de perfil</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                {/* Preview */}
                                {(fotoPreview || fotoUrl) && (
                                    <img
                                        src={fotoPreview || fotoUrl}
                                        alt="preview"
                                        className="perfil-avatar-img"
                                        style={{ width: '60px', height: '60px' }}
                                        onError={e => e.target.style.display = 'none'}
                                    />
                                )}
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleFotoSeleccionada}
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            background: 'var(--mint-light)',
                                            color: 'var(--mint)',
                                            border: '1.5px solid var(--mint)',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            fontFamily: 'inherit',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        📁 {fotoFile ? fotoFile.name : 'Seleccionar foto'}
                                    </button>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        JPG, PNG o WEBP
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Color de fondo */}
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

                        {/* Botones */}
                        <div className="modal-botones">
                            <button className="modal-btn-cancelar" onClick={() => { setMostrarConfig(false); setFotoFile(null); setFotoPreview(''); }}>
                                Cancelar
                            </button>
                            <button
                                className="modal-btn-guardar"
                                onClick={guardarPerfil}
                                disabled={guardando}
                                style={{
                                    background: guardadoOk ? '#D8F3DC' : '#2D6A4F',
                                    color: guardadoOk ? '#2D6A4F' : '#fff',
                                }}
                            >
                                {subiendoFoto ? '📤 Subiendo foto...' : guardadoOk ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PerfilPage;