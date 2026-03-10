import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            if (err.code === 'NotAuthorizedException') {
                setError('Email o contraseña incorrectos.');
            } else if (err.code === 'UserNotFoundException') {
                setError('No existe ningún usuario con ese email.');
            } else if (err.code === 'UserNotConfirmedException') {
                setError('Debes confirmar tu cuenta primero.');
            } else {
                setError('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
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
                {/* Logo / título */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏠</div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: 0 }}>
                        Dashboard
                    </h1>
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>
                        Inicia sesión para continuar
                    </p>
                </div>

                {/* Formulario */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                border: '1.5px solid #e0e0e0',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border 0.2s',
                            }}
                            onFocus={e => e.target.style.border = '1.5px solid #2D6A4F'}
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
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                border: '1.5px solid #e0e0e0',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border 0.2s',
                            }}
                            onFocus={e => e.target.style.border = '1.5px solid #2D6A4F'}
                            onBlur={e => e.target.style.border = '1.5px solid #e0e0e0'}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#FDECEA',
                            color: '#c0392b',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500',
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Botón */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !email || !password}
                        style={{
                            background: loading || !email || !password ? '#ccc' : '#2D6A4F',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '13px',
                            fontSize: '15px',
                            fontWeight: '700',
                            fontFamily: 'inherit',
                            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                            marginTop: '4px',
                            transition: 'background 0.2s',
                        }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Entrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;