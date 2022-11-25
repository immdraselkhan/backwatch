import React, { useState } from 'react'
import { AppShell } from '@mantine/core'
import DashHeader from '../components/dashboard/DashHeader'
import DashNavbar from '../components/dashboard/DashNavbar'
import { Outlet } from 'react-router-dom'
import DashFooter from '../components/dashboard/DashFooter'

const Dashboard = () => {

  const [opened, setOpened] = useState(false);

  return (
    <AppShell navbarOffsetBreakpoint="sm"
      navbar={<DashNavbar opened={opened} />}
      header={<DashHeader opened={opened} setOpened={setOpened} />}
      footer={<DashFooter />}>
      <Outlet />
    </AppShell>
  )
};

export default Dashboard;