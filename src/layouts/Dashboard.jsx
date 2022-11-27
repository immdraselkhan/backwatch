import React, { useContext, useState } from 'react'
import { AppShell } from '@mantine/core'
import DashHeader from '../components/dashboard/DashHeader'
import DashNavbar from '../components/dashboard/DashNavbar'
import { Outlet } from 'react-router-dom'
import DashFooter from '../components/dashboard/DashFooter'
import { AuthContext } from '../contexts/AuthProvider'
import useRole from '../hooks/useRole'
import DataLoader from '../components/common/DataLoader'

const Dashboard = () => {

  // Getting data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Getting user role
  const [role, roleLoading] = useRole(user?.uid);

  // Navbar state
  const [opened, setOpened] = useState(false);

  // Loading until we got the data
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