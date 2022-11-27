import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthProvider'
import DataLoader from '../components/common/DataLoader'

const PrivateRoute = ({children}) => {

  // Getting data from AuthContext
  const {user, loading} = useContext(AuthContext);

  // Get current location
  const location = useLocation();

  // Loading until we got the user
  if (loading) {
    return <DataLoader />;
  };
  
  // When we got the logged in user will return the PrivateRoute children
  if (user?.uid) {
    return children;
  };
  
  // Sending a state object where from is a propery and value is the current location
  return <Navigate to='/login' state={{from: location}} replace />;
};

export default PrivateRoute;