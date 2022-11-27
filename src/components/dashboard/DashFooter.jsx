import React from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '@mantine/core'

const DashFooter = () => {
  return (
    <Footer height={60} p='md' style={{textAlign: 'center'}}>
      © {new Date().getFullYear()} <Link to="/">BackWatchShop</Link>. All rights reserved.
    </Footer>
  )
};

export default DashFooter;