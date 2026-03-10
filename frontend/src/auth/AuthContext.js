import { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import cognitoConfig from './cognitoConfig';

const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.userPoolId,
    ClientId: cognitoConfig.clientId,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const logout = () => {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) cognitoUser.signOut();
        setUser(null);
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