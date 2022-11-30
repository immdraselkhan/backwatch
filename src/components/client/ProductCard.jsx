import React from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Grid, Group, Image, Text } from '@mantine/core'

const ProductCard = ({ product }) => {
  return (
    <Grid.Col md={6} lg={3}>
      <Card shadow="sm" p="lg" mt={50} radius="md" withBorder>
        <Card.Section>
          <Image className="bg-white p-5" src={product?.imageURL} alt="" />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{product?.title}</Text>
          <Badge color="pink" variant="light">${product?.resalePrice}</Badge>
        </Group>
        <Text size="sm" color="dimmed">{product?.description.substring(0, 100)+'...' }</Text>
        <Button variant="light" color="blue" fullWidth mt="md" radius="md">Book Now</Button>
      </Card>
    </Grid.Col>
  )
};

export default ProductCard;