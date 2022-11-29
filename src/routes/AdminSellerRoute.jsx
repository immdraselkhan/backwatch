import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'
import useParamsAPI from '../hooks/useParamsAPI'
import DataLoader from '../components/common/DataLoader'

const AdminSellerRoute = ({ children }) => {

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get user from the database
  const { data: storedUser, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // useLocation hook
  const location = useLocation();

  // Loader until we got the user
  if (loading || roleLoading) {
    return <DataLoader />;
  };

  // When we got the logged in user and matched the role will return the AdminSellerRoute children
  if (user?.uid && storedUser?.role === 'seller' || storedUser?.role === 'admin') {
    return children;
  };

  // Sending a state object where from is a propery and value is the current location
  return <Navigate to='/login' state={{ from: location }} replace />;
};

export default AdminSellerRoute;