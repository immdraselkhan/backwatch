import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'
import useRole from '../hooks/useRole'
import DataLoader from '../components/common/DataLoader'

const SellerRoute = ({ children }) => {

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get user role
  const [role, roleLoading] = useRole(user?.uid);

  // useLocation hook
  const location = useLocation();

  // Loader until we got the user
  if (loading || roleLoading) {
    return <DataLoader />;
  };

  // When we got the logged in user and matched the role will return the SellerRoute children
  if (user?.uid && role === 'seller') {
    return children;
  };

  // Sending a state object where from is a propery and value is the current location
  return <Navigate to='/login' state={{ from: location }} replace />;
};

export default SellerRoute;