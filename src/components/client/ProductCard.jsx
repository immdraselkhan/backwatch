import React from 'react'
import { Link } from 'react-router-dom'
import { ActionIcon, Badge, Button, Card, Center, createStyles, Grid, Group, Image, Text } from '@mantine/core'
import { IconLocation, IconTag, IconShieldCheck, IconCalendarTime, IconClock, IconFlag } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
  
  icon: {
    marginRight: 5,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
  },
}));

const ProductCard = ({ user, storedUser, product, setClickedProduct, setModal, handleBookingError, handleReportError }) => {
  const { classes } = useStyles();
  return (
    <Grid.Col md={6} lg={3} mt={50}>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section>
          {product?.isAds && <div className="absolute transform -rotate-45 bg-primary text-center text-white font-semibold left-[-34px] top-[15px] w-[130px] z-10">In Ads</div>}
          <Image src={product?.imageURL} alt={product?.title} />
        </Card.Section>

        <Card.Section className={classes.section} mt="xl">
          <Group>
            <Text size="sm" color="dimmed">Sold by: {product?.sellerName}</Text>
            {product?.isVerified && <Badge px={8} py={10} variant="outline"><Group spacing={5}><IconShieldCheck size={15} />Verified</Group></Badge>}
          </Group>
          <Group mt={20}>
            <Text size="lg" weight={500}>{product?.title}</Text>
            <Text size="sm" align="left" color="dimmed">{product?.description.substring(0, 100) + '...'}</Text>
          </Group>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Group spacing={10} mt={15}>
            <Center>
              <IconCalendarTime size={18} className={classes.icon} stroke={1.5} />
              <Text size="xs">{product?.yearOfUse} Year{product?.yearOfUse > 1 && 's'} Used</Text>
            </Center>
            <Center>
              <IconLocation size={18} className={classes.icon} stroke={1.5} />
              <Text size="xs">{product?.sellerLocation}</Text>
            </Center>
            <Center>
              <IconTag size={18} className={classes.icon} stroke={1.5} />
              <Text size="xs">Original Price: ${product?.originalPrice}</Text>
            </Center>
            <Center>
              <IconClock size={18} className={classes.icon} stroke={1.5} />
              <Text size="xs">{product?.createdAt.split(',')[0]}</Text>
            </Center>
          </Group>
        </Card.Section>

        <Group mt={15} position="apart">
          <Text size="xl" weight={700}>${product?.resalePrice}</Text>
          <Group>
            <Button onClick={() => { product?.status === 'Booked' || storedUser?.role === 'admin' || product?.sellerId === user?.uid ? handleBookingError(product) : (user?.uid ? (setClickedProduct(product), setModal({booking: true})) : false) }} color={product?.status === 'Booked' ? 'gray' : ''} component={!user?.uid && product?.status !== 'Booked' ? Link : ''} to={!user?.uid && product?.status !== 'Booked' ? '/login' : ''} radius="md" style={{ flex: 1 }}>{product?.status !== 'Booked' ? (user?.uid ? 'Book Now' : 'Login to book') : 'Booked'}</Button>
            <ActionIcon onClick={() => { user?.uid && storedUser?.role !== 'admin' && user?.uid !== product?.sellerId ? (setClickedProduct(product), setModal({ report: true })) : (user?.uid ? handleReportError() : false) }} component={!user?.uid ? Link : ''} to={!user?.uid ? '/login' : ''} variant="default" radius="md" size={36}>
              <IconFlag size={18} className={classes.like} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Card>
    </Grid.Col>
  )
};

export default ProductCard;