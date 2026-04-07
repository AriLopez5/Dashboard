import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import cognitoConfig from '../auth/cognitoConfig';

const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.userPoolId,
    ClientId: cognitoConfig.clientId,
});

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #e0e0e0',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
};

function RegisterPage() {
    const navigate = useNavigate();

    // Paso 1: registro / Paso 2: verificación código
    const [paso, setPaso] = useState(1);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [exito, setExito] = useState(false);

    // ── PASO 1: Registrar usuario ─────────────────────────────────────────
    const handleRegistro = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !password2) {
            setError('Rellena todos los campos.');
            return;
        }
        if (password !== password2) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setLoading(true);
        userPool.signUp(email, password, [], null, (err, result) => {
            setLoading(false);
            if (err) {
                if (err.code === 'UsernameExistsException') {
                    setError('Ya existe una cuenta con ese email.');
                } else if (err.code === 'InvalidPasswordException') {
                    setError('La contraseña debe tener mayúsculas, minúsculas y números.');
                } else {
                    setError(err.message || 'Error al registrarse.');
                }
                return;
            }
            // Cognito ha mandado el email con el código
            setPaso(2);
        });
    };

    // ── PASO 2: Verificar código ──────────────────────────────────────────
    const handleVerificacion = async (e) => {
        e.preventDefault();
        setError('');

        if (!codigo) {
            setError('Introduce el código de verificación.');
            return;
        }

        setLoading(true);
        const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
        cognitoUser.confirmRegistration(codigo, true, (err, result) => {
            setLoading(false);
            if (err) {
                if (err.code === 'CodeMismatchException') {
                    setError('Código incorrecto. Revisa tu email.');
                } else if (err.code === 'ExpiredCodeException') {
                    setError('El código ha caducado. Solicita uno nuevo.');
                } else {
                    setError(err.message || 'Error al verificar.');
                }
                return;
            }
            setExito(true);
            setTimeout(() => navigate('/login'), 2000);
        });
    };

    // ── Reenviar código ───────────────────────────────────────────────────
    const reenviarCodigo = () => {
        setError('');
        const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
        cognitoUser.resendConfirmationCode((err) => {
            if (err) {
                setError('Error al reenviar el código.');
            } else {
                setError('');
                alert('Código reenviado. Revisa tu email.');
            }
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F7F6F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '48px 40px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                        {paso === 1 ? '📋' : '✉️'}
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: 0 }}>
                        {paso === 1 ? 'Crear cuenta' : 'Verifica tu email'}
                    </h1>
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
                        {paso === 1
                            ? 'Rellena los datos para registrarte'
                            : `Hemos enviado un código a ${email}`}
                    </p>
                </div>

                {/* ── PASO 1: Formulario registro ── */}
                {paso === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                style={inputStyle}
                                onFocus={e => e.target.style.border = '1.5px solid #8338EC'}
                                onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                style={inputStyle}
                                onFocus={e => e.target.style.border = '1.5px solid #8338EC'}
                                onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                                Repetir contraseña
                            </label>
                            <input
                                type="password"
                                value={password2}
                                onChange={e => setPassword2(e.target.value)}
                                placeholder="Repite la contraseña"
                                style={inputStyle}
                                onFocus={e => e.target.style.border = '1.5px solid #8338EC'}
                                onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
                                onKeyDown={e => e.key === 'Enter' && handleRegistro(e)}
                            />
                        </div>

                        {error && (
                            <div style={{ background: '#FDECEA', color: '#c0392b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            onClick={handleRegistro}
                            disabled={loading}
                            style={{
                                background: loading ? '#ccc' : '#8338EC',
                                color: '#fff', border: 'none', borderRadius: '10px',
                                padding: '13px', fontSize: '15px', fontWeight: '700',
                                fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop: '4px', transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', margin: 0 }}>
                            ¿Ya tienes cuenta?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                style={{ color: '#8338EC', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Inicia sesión
                            </span>
                        </p>
                    </div>
                )}

                {/* ── PASO 2: Verificación código ── */}
                {paso === 2 && !exito && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                                Código de verificación
                            </label>
                            <input
                                type="text"
                                value={codigo}
                                onChange={e => setCodigo(e.target.value)}
                                placeholder="Introduce el código de 6 dígitos"
                                style={{ ...inputStyle, textAlign: 'center', fontSize: '20px', letterSpacing: '6px' }}
                                onFocus={e => e.target.style.border = '1.5px solid #8338EC'}
                                onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
                                onKeyDown={e => e.key === 'Enter' && handleVerificacion(e)}
                                maxLength={6}
                            />
                        </div>

                        {error && (
                            <div style={{ background: '#FDECEA', color: '#c0392b', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            onClick={handleVerificacion}
                            disabled={loading}
                            style={{
                                background: loading ? '#ccc' : '#8338EC',
                                color: '#fff', border: 'none', borderRadius: '10px',
                                padding: '13px', fontSize: '15px', fontWeight: '700',
                                fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Verificando...' : 'Verificar cuenta →'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', margin: 0 }}>
                            ¿No te ha llegado?{' '}
                            <span
                                onClick={reenviarCodigo}
                                style={{ color: '#8338EC', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Reenviar código
                            </span>
                        </p>
                    </div>
                )}

                {/* ── Éxito ── */}
                {exito && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                        <div style={{ fontWeight: '700', fontSize: '18px', color: '#2D6A4F', marginBottom: '8px' }}>
                            ¡Cuenta verificada!
                        </div>
                        <div style={{ color: '#888', fontSize: '14px' }}>
                            Redirigiendo al login...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegisterPage;