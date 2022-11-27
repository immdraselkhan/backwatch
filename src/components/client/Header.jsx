import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthProvider'
import { createStyles, Header, Container, Group, Burger, Paper, Transition, Button, ActionIcon, Menu, useMantineColorScheme, Avatar, Box, Text, Loader, Indicator, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconSun, IconMoonStars, IconLogout } from '@tabler/icons'
import { toast } from 'react-toastify'

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  href: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  hrefActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

const ClientHeader = () => {

  // Get data from AuthContext
  const { user, loading, userLogOut } = useContext(AuthContext);

  // useNavigate hook
  const navigate = useNavigate();

  // useLocation hook
  const location = useLocation();

  // Color scheme toggle handler
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  // Menu state
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();

  // Menu items data
  const menu = [
    {label: 'Home', link: '/'},
    {label: 'Blog', link: '/blog'},
  ];

  // Map the menu items
  const menuItems = menu.map(item => (
      <Link key={item.label}
        to={item.link}
        className={cx(classes.href, { [classes.hrefActive]: location.pathname === item.link })}
        onClick={close}
      >
        {item.label}
      </Link>
    )
  );

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
    <Header height={HEADER_HEIGHT} mb={120} className={`${classes.root} sticky z-[999]`}>
      <Container size="xl" className={classes.header}>
        <Title component={Link} to="/">BW</Title>
        <Group spacing={5} className={classes.links}>
          {menuItems}
        </Group>
        <Burger opened={opened} onClick={toggle} className={`${classes.burger} flex-auto ml-3`} size="sm" />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {menuItems}
            </Paper>
          )}
        </Transition>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '100%' }}>
          <ActionIcon variant="outline" color={dark ? 'yellow' : 'blue'} onClick={() => toggleColorScheme()} title="Toggle color scheme">
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
          {
            loading ? <Loader size="xs" variant="dots" /> : <Button component={Link} to={user?.uid ? '/dashboard' : '/login'} variant="default">{user?.uid ? 'Dashboard' : 'Log in'}</Button>
          }
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
      </Container>
    </Header>
  )
};

export default ClientHeader;