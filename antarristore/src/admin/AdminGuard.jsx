import { Navigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
    const isLogged = localStorage.getItem('adminToken') === 'active';

    if (!isLogged) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
}