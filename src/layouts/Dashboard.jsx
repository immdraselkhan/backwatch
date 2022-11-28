import React, { useContext, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { AuthContext } from '../contexts/AuthProvider'
import DashHeader from '../components/dashboard/DashHeader'
import DashNavbar from '../components/dashboard/DashNavbar'
import DashFooter from '../components/dashboard/DashFooter'
import useParamsAPI from '../hooks/useParamsAPI'
import DataLoader from '../components/common/DataLoader'
import { toast } from 'react-toastify'

const Dashboard = () => {

  // Set page title
  useDocumentTitle('Dashboard - BackWatch');

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // useLocation hook
  const location = useLocation();

  // Get user role from the database
  const { data: role, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // Navbar state
  const [opened, setOpened] = useState(false);

  // Loader until we got the data
  if (loading || roleLoading) {
    return <DataLoader />;
  };

  // If user role not found return to home
  if (!loading && !roleLoading && !role) {
    // Error toast
    toast.error('Something went wrong!', {
      autoClose: 1500, position: toast.POSITION.TOP_CENTER
    });
    return <Navigate to='/' state={{ from: location }} replace />;
  };

  return (
    <AppShell navbarOffsetBreakpoint="sm"
      navbar={<DashNavbar opened={opened} role={role} />}
      header={<DashHeader opened={opened} setOpened={setOpened} role={role} />}
      footer={<DashFooter />}>
      <Outlet />
    </AppShell>
  )
};

export default Dashboard;