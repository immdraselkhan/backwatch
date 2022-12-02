import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Grid, Text, Title, SimpleGrid, ThemeIcon, Col } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { IconReceiptRefund, IconBuildingStore, IconMoodWink,  IconPlant } from '@tabler/icons'
import { AuthContext } from '../../contexts/AuthProvider'
import useParamsAPI from '../../hooks/useParamsAPI'
import useAPI from '../../hooks/useAPI'
import DataLoader from '../../components/common/DataLoader'
import CategoryCard from '../../components/client/CategoryCard'
import ImageSlider1 from '../../assets/slider-1.png'
import ImageSlider2 from '../../assets/slider-2.png'
import ProductCard from '../../components/client/ProductCard'
import { toast } from 'react-toastify'
import ProductAction from '../../components/client/ProductAction'

const Home = () => {

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get user from the database
  const { data: storedUser, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // Get categories from the database
  const { data: categories, dataLoading: categoriesLoading } = useAPI('categories');

  // Get products from the database
  const { data, dataLoading: proeductsLoading } = useAPI('products');

  // Filter the products
  const products = data?.filter(product => product?.isAds);

  // Features data
  const features = [
    {
      icon: IconReceiptRefund,
      title: 'Safety net',
      description: '30 days to change your mind and a 1-year warranty.',
    },
    {
      icon: IconBuildingStore,
      title: 'Curated tech',
      description: 'Choose the best deals from the most reliable sellers',
    },
    {
      icon: IconMoodWink,
      title: 'Solid service',
      description: 'Dependable service from people who care.',
    },
    {
      icon: IconPlant,
      title: 'Sustainable',
      description: 'Devices with a lower environmental impact.',
    },
  ];

  // Map the features
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ deg: 133, from: 'blue', to: 'cyan' }}>
        <feature.icon size={26} stroke={1.5} />
      </ThemeIcon>
      <Text size="lg" mt="sm" weight={500}>{feature.title}</Text>
      <Text color="dimmed" size="sm">{feature.description}</Text>
    </div>
  ));

  // Overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState({ booking: false, report: false });

  // Clicked product state
  const [clickedProduct, setClickedProduct] = useState({});

  // Handle booking error
  const handleError = product => {
    product?.status === 'Booked' ?
    // Error toast
      toast.error('Already booked!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      }) :
    // Error toast
    toast.error('Please login as buyer to book!', {
      autoClose: 1500, position: toast.POSITION.TOP_CENTER
    });
  };

  // Loader until we got the data
  if (loading || roleLoading || categoriesLoading || proeductsLoading) {
    return <DataLoader />;
  };
  
  return (
    <>
      <Container size="xl" mt={-50}>
        <Carousel mx="auto" loop>
          <Carousel.Slide><img src={ImageSlider1} /></Carousel.Slide>
          <Carousel.Slide component={Link} to="/category/apple"><img src={ImageSlider2} /></Carousel.Slide>
        </Carousel>
      </Container>

      <Container size="xl" mt={70} className="text-center md:text-inherit">
        <Grid gutter={80}>
          <Col span={12} md={5}>
            <Title>Welcome to BackWatch, <br />the last big thing in tech.</Title>
            <Text mt={10} color="dimmed">BackWatch is home to the greatest collection of pre-owned luxury watches, all certified as authentic and Collector Quality. We would never tell you to buy a watch we wouldn't buy ourselves first.</Text>
            <Button component={Link} to="/login" variant="gradient" gradient={{ deg: 133, from: 'blue', to: 'cyan' }} size="lg" radius="md" mt="xl">Get started</Button>
          </Col>
          <Col span={12} md={7}>
            <SimpleGrid cols={2} spacing={30} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
              {items}
            </SimpleGrid>
          </Col>
        </Grid>
      </Container>

      <Container size="xl" align="center" mt={70}>
        <Title order={2}>Featured Categories</Title>
        <Text order={3} mt={15} size={18} color="dimmed">Nothing lost, everything gained, all reborn</Text>
        <Grid>
          {categories?.map(category => <CategoryCard key={category?._id} category={category} />)}
        </Grid>
      </Container>

      {products?.length || products?.length > 0 ?
      <Container size="xl" align="center" mt={70}>
        <Title order={2}>Advertised Collection</Title>
        <Text order={3} mt={15} size={18} color="dimmed">Classy devices at sassy prices for limited time, grab it now!</Text>
        <Grid>
          {products?.map(product => <ProductCard key={product?._id} product={product} user={user} storedUser={storedUser} clickedProduct={clickedProduct} setClickedProduct={setClickedProduct} setModal={setModal} handleError={handleError} />)}
          <ProductAction user={user} modal={modal} setModal={setModal} clickedProduct={clickedProduct} setClickedProduct={setClickedProduct} overlayLoading={overlayLoading} setOverlayLoading={setOverlayLoading} />
        </Grid>
      </Container> : false}
      
      <Container size="xl" align="center" mt={120}>
        <Title>Sell your junk. Get money. Help the planet.</Title>
        <Container p={0} size={600}>
          <Text order={3} mt={15} size={18} color="dimmed">Whether your junk is big or small, working or not, you can sell the BackWatch platform for free to millions of customers.</Text>
        </Container>
        <Button component={Link} to="/register" variant="gradient" gradient={{ deg: 133, from: 'blue', to: 'cyan' }} size="lg" radius="md" mt="xl">Join Seller Program</Button>
      </Container>
    </>
  )
};

export default Home;