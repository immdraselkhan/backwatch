import React from 'react'
import { Footer } from '@mantine/core'

const DashFooter = () => {
  return (
    <Footer height={60} p='md' style={{textAlign: 'center'}}>
      © {new Date().getFullYear()} All rights reserved - Rasel
    </Footer>
  )
};

export default DashFooter;