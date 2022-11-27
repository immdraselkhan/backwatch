import React, { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { AuthContext } from '../contexts/AuthProvider'
import DashHeader from '../components/dashboard/DashHeader'
import DashNavbar from '../components/dashboard/DashNavbar'
import DashFooter from '../components/dashboard/DashFooter'
import DataLoader from '../components/common/DataLoader'
import useRole from '../hooks/useRole'

const Dashboard = () => {

  // Set page title
  useDocumentTitle('Dashboard - BackWatch');

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get user role from the database
  const [role, roleLoading] = useRole(user?.uid);

  // Navbar state
  const [opened, setOpened] = useState(false);

  // Loader until we got the data
  if (loading || roleLoading) {
    return <DataLoader />;
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