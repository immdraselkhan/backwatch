import React from 'react'
import { createStyles, Image, Container, Title, Text, Button, SimpleGrid } from '@mantine/core'
import { Link, useRouteError } from 'react-router-dom'
import ErrorImage from '../../assets/error.svg'

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

const Error = () => {

  // useRouteError hook
  const error = useRouteError();

  const {classes} = useStyles();
  
  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
        <Image src={ErrorImage} className={classes.mobileImage} />
        <div className="my-auto text-center md:text-left">
          <Title className={classes.title}>Opps! {error ? <>{error.status} {error.statusText}</> : 'Something is not right...'}</Title>
          <Text color="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Button component={Link} to='/' variant="outline" size="md" mt="xl" className={classes.control}>
            Get back to home
          </Button>
        </div>
        <Image src={ErrorImage} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  )
};

export default Error;