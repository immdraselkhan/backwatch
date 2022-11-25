import React from 'react'
import { Footer } from '@mantine/core'

const DashFooter = () => {
  return (
    <Footer height={60} p='md' style={{textAlign: 'center'}}>
      © {new Date().getFullYear()} BackWatchShop. All rights reserved.
    </Footer>
  )
};

export default DashFooter;