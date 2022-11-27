import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthProvider'
import { Header, Text, MediaQuery, Burger, ActionIcon, useMantineColorScheme, Menu, Avatar, Box, Indicator } from '@mantine/core'
import { IconSun, IconMoonStars, IconLogout } from '@tabler/icons'
import { toast } from 'react-toastify'

const DashHeader = ({ opened, setOpened, role }) => {

  // Get data from AuthContext
  const { user, userLogOut } = useContext(AuthContext);

  // Color scheme toggle handler
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  // Sign out
  const logOut = () => {
    // User log out
    userLogOut()
    .then(() => {
      // Successful toast
      toast.success('User logged out!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Redirect to login route
      navigate('/login');
    })
    .catch(error => {
      // Error toast
      toast.error(error.code, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  return (
    <Header height={{base: 50, md: 70}} p="md" className="z-[999]">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%'}}>
        <MediaQuery largerThan="sm" styles={{display: 'none'}}>
          <Burger opened={opened} onClick={() => setOpened(!opened)} size="sm" mr="xl" />
        </MediaQuery>
        <Text component={Link} to='/dashboard'>{role === 'admin' ? 'Admin' : (role === 'seller' ? 'Seller' : 'Buyer')} Dashboard</Text>
        <div style={{display: 'flex', alignItems: 'center', gap: '25px', height: '100%'}}>
          <ActionIcon variant="outline" color={dark ? 'yellow' : 'blue'} onClick={() => toggleColorScheme()} title="Toggle color scheme">
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
          {user?.uid &&
            <Menu trigger="hover" withArrow>
              <Menu.Target>
                <Indicator dot inline size={16} offset={5} position="bottom-end" color="green" withBorder>
                  <Avatar style={{ cursor: 'pointer' }} src={user?.photoURL} alt="it's me" radius='xl' />
                </Indicator>
              </Menu.Target>
              <Menu.Dropdown style={{ marginTop: '5px' }}>
                <Box sx={{ flex: 1 }} style={{ padding: '10px' }} >
                  <Text size="sm" weight={500}>{user?.displayName}</Text>
                  <Text color="dimmed" size="xs">{user?.email}</Text>
                </Box>
                <Menu.Divider />
                <Menu.Item onClick={logOut} icon={<IconLogout size={14} />}>Log out</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          }
        </div>
      </div>
    </Header>
  )
};

export default DashHeader;