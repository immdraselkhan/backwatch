import React, { useContext } from 'react'
import { Badge, Button, Card, Container, Grid, Group, Image, Text, Title } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import useAPI from '../../hooks/useAPI'
import ImageSlider1 from '../../assets/slider-1.png'
import ImageSlider2 from '../../assets/slider-2.png'
import ImageSlider3 from '../../assets/slider-3.png'
import { AuthContext } from '../../contexts/AuthProvider'
import DataLoader from '../../components/common/DataLoader'
import CategoryCard from '../../components/client/CategoryCard'

const Home = () => {

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get categories from the database
  const { data: categories, dataLoading: categoriesLoading } = useAPI('categories');

  // Loader until we got the data
  if (categoriesLoading) {
    return <DataLoader />;
  };
  
  return (
    <>
      <Container size="xl" mt={-50}>
        <Carousel mx="auto" loop>
          <Carousel.Slide><img src={ImageSlider1} /></Carousel.Slide>
          <Carousel.Slide><img src={ImageSlider2} /></Carousel.Slide>
          <Carousel.Slide><img src={ImageSlider3} /></Carousel.Slide>
        </Carousel>
      </Container>
      <Container size="xl" className="text-center mt-5">
        <Title order={2}>Featured Categories</Title>
        <Title order={3} weight={100} align="center" mt={15}>Nothing lost, everything gained, all reborn</Title>
        <Grid>
          {categories?.map(category => <CategoryCard key={category?._id} category={category} />)}
        </Grid>
      </Container>
    </>
  )
};

export default Home;