import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthState({ token });
        }
    }, [])

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthState({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({ token: null });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
