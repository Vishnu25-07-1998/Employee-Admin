import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({children}) => {
    const { authState } = useContext(AuthContext);
    if (!authState.token) {
        return <Navigate to="/login" replace />;
    }
    return children;

}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute
