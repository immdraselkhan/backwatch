import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from '@mantine/core'
import { AuthContext } from '../contexts/AuthProvider'
import useRole from '../hooks/useRole'

const SellerRoute = ({ children }) => {

  // Getting data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Getting user role
  const [role, roleLoading] = useRole(user?.uid);

  // Get current location
  const location = useLocation();

  // Loading until we got the user
  if (loading || roleLoading) {
    return <Loader variant="bars" className="mx-auto min-h-[calc(100vh_-_681px)] sm:min-h-[calc(100vh_-_659px)] md:min-h-[calc(100vh_-_601px)]" />
  };

  // When we got the logged in user and matched the role will return the SellerRoute children
  if (user?.uid && role === 'seller') {
    return children;
  };

  // Sending a state object where from is a propery and value is the current location
  return <Navigate to='/login' state={{ from: location }} replace />;
};

export default SellerRoute;