import React from 'react'
import ClientHeader from '../components/client/Header'
import { Outlet } from 'react-router-dom'
import ClientFooter from '../components/client/Footer'

const Main = () => {

  return (
    <>
      <ClientHeader />
      <main className="min-h-[calc(100vh_-_681px)] sm:min-h-[calc(100vh_-_659px)] md:min-h-[calc(100vh_-_601px)]">
        <Outlet />
      </main>
      <ClientFooter />
    </>
  )
};

export default Main;