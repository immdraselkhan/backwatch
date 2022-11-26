import React, { useContext, useState } from 'react'
import { AppShell, Loader } from '@mantine/core'
import DashHeader from '../components/dashboard/DashHeader'
import DashNavbar from '../components/dashboard/DashNavbar'
import { Outlet } from 'react-router-dom'
import DashFooter from '../components/dashboard/DashFooter'
import { AuthContext } from '../contexts/AuthProvider'
import useRole from '../hooks/useRole'

const Dashboard = () => {

  // Getting data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Getting user role
  const [role, roleLoading] = useRole(user?.uid);

  // Navbar state
  const [opened, setOpened] = useState(false);

  // Loading until we got the user
  if (loading || roleLoading) {
    return <Loader variant="bars" className="mx-auto min-h-[calc(100vh_-_681px)] sm:min-h-[calc(100vh_-_659px)] md:min-h-[calc(100vh_-_601px)]" />
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