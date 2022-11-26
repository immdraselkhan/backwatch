import { useState } from 'react'
import axios from 'axios'

const useRole = uid => {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  axios.get(`${import.meta.env.VITE_API_Server}/user/${uid}`)
  .then(data => {
    if (data.data.success) {
      setRole(data.data.user?.role);
      setRoleLoading(false);
    };
  })
  .catch((error) => {
    // Error toast
    toast.error(error.message, {
      autoClose: 1500, position: toast.POSITION.TOP_CENTER
    });
  });
  return [role, roleLoading];
};

export default useRole;