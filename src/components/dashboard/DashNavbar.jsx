import React from 'react'
import { Navbar, Box, NavLink } from '@mantine/core'
import { IconDeviceWatchStats, IconBuildingStore, IconBasket, IconPackage, IconMessageReport } from '@tabler/icons'
import { Link, useLocation } from 'react-router-dom'

const DashNavbar = ({ opened, role }) => {

  // useLocation hook
  const location = useLocation()

  // Navbar items data
  const items = [
    {
      link: '',
      label: 'Products',
      icon: IconDeviceWatchStats,
      permission: role === 'admin' || role === 'seller' ? true: false,
      open: true,
      subItems: [
        {
          link: '/dashboard/product/add',
          label: 'Add product',
          permission: role === 'seller' ? true : false,
        },
        {
          link: '/dashboard/products',
          label: role === 'admin' ? 'All Products' : 'My Products',
          permission: role === 'admin' || role === 'seller' ? true : false,
        },
      ],
    },
    {
      link: '/dashboard/sellers',
      label: 'All Sellers',
      permission: role === 'admin' ? true : false,
      icon: IconBuildingStore,
    },
    {
      link: '/dashboard/buyers',
      label: role === 'admin' ? 'All Buyers' : 'My Buyers',
      permission: role === 'admin' || role === 'seller' ? true : false,
      icon: IconBasket,
    },
    {
      link: '/dashboard/orders',
      label: role === 'admin' ? 'All Orders' : 'My Orders',
      permission: true,
      icon: IconPackage,
    },
    {
      link: '/dashboard/reports',
      label: 'Reported Items',
      permission: role === 'admin' ? true : false,
      icon: IconMessageReport,
    }
  ]

  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{sm: 200, lg: 300}}>
      <Box>
        {
          items.map(item => (
            item.permission ?
            <NavLink
              key={item.label}
              component={Link}
              to={item.link}
              label={item.label}
              icon={<item.icon size={16} stroke={1.5} />}
              active={location.pathname === item.link}
              defaultOpened={item?.open}
            >
              {
                item?.subItems?.map(subItem => (
                  subItem.permission ?
                  <NavLink
                    key={subItem.label}
                    component={Link}
                    to={subItem.link}
                    label={subItem.label}
                    active={location.pathname === subItem.link}
                  /> : false
                ))
              }
            </NavLink> : false
          ))
        }
      </Box>
    </Navbar>
  )
};

export default DashNavbar;