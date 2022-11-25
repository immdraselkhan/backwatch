import React from 'react'
import { ActionIcon, Container, createStyles, Group, Text, Affix, Button, Transition } from '@mantine/core'
import { IconBrandGithub, IconBrandTwitter, IconBrandInstagram, IconArrowUp } from '@tabler/icons'
import { useWindowScroll } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 140,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
  },

  logo: {
    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  description: {
    marginTop: 5,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  groups: {
    display: 'flex',
    flexWrap: 'wrap',

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  social: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
    },
  },
}));

const ClientFooter = () => {
  const { classes } = useStyles();
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <footer className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        <div className={classes.logo}>
          {/* <MantineLogo size={30} /> */}
          <h1>BackWatch</h1>
          <Text size="sm" color="dimmed" className={classes.description}>
            Hello! We're BackWatch, the leading marketplace for renewed watches. Our mission? To fight e-waste by giving expertly restored devices a second life.
          </Text>
        </div>
      </Container>
      <Container size="xl" className={classes.afterFooter}>
        <Text color="dimmed" size="sm">
          © {new Date().getFullYear()} BackWatchShop. All rights reserved.
        </Text>
        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon size="lg">
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
      <Affix position={{ bottom: 50, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              className="p-[10px] bg-primary hover:bg-secondary"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
            <IconArrowUp size={16} />
            </Button>
          )}
        </Transition>
      </Affix>
    </footer>
  )
};

export default ClientFooter;