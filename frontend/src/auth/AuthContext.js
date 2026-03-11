import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import cognitoConfig from './cognitoConfig';

const INACTIVIDAD_MS = 5 * 60 * 1000; // 5 minutos

const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.userPoolId,
    ClientId: cognitoConfig.clientId,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef(null);

    const logout = useCallback(() => {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) cognitoUser.signOut();
        setUser(null);
        clearTimeout(timerRef.current);
    }, []);

    const resetTimer = useCallback(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            logout();
        }, INACTIVIDAD_MS);
    }, [logout]);

    // Comprobar si ya hay sesión activa al cargar
    useEffect(() => {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.getSession((err, session) => {
                if (!err && session.isValid()) {
                    setUser(cognitoUser);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    // Iniciar/limpiar listeners de actividad cuando hay sesión
    useEffect(() => {
        if (!user) return;

        const eventos = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        eventos.forEach(e => window.addEventListener(e, resetTimer));
        resetTimer(); // Arrancar el timer al hacer login

        return () => {
            eventos.forEach(e => window.removeEventListener(e, resetTimer));
            clearTimeout(timerRef.current);
        };
    }, [user, resetTimer]);

    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            const authDetails = new AuthenticationDetails({
                Username: email,
                Password: password,
            });

            const cognitoUser = new CognitoUser({
                Username: email,
                Pool: userPool,
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: (session) => {
                    setUser(cognitoUser);
                    resolve(session);
                },
                onFailure: (err) => {
                    reject(err);
                },
                newPasswordRequired: (userAttributes) => {
                    reject({ code: 'NewPasswordRequired', userAttributes, cognitoUser });
                },
            });
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}