import React from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Grid, Group, Image, Text } from '@mantine/core'

const CategoryCard = ({category}) => {
  return (
    <Grid.Col md={6} lg={3}>
      <Card shadow="sm" p="lg" mt={50} radius="md" withBorder>
        <Card.Section>
          <Image className="bg-white p-5" src={category?.image} alt="" />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{category?.name}</Text>
          <Badge color="pink" variant="light">On Sale</Badge>
        </Group>
        <Text size="sm" color="dimmed">{category?.description}</Text>
        <Button component={Link} to={`/category/${category?.slug}`} variant="light" color="blue" fullWidth mt="md" radius="md">View all</Button>
      </Card>
    </Grid.Col>
  )
};

export default CategoryCard;