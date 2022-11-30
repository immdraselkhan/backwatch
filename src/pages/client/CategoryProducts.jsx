import React from 'react'
import { useDocumentTitle } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import useParamsAPI from '../../hooks/useParamsAPI'
import DataLoader from '../../components/common/DataLoader'
import { Container, Grid, Title } from '@mantine/core'
import ProductCard from '../../components/client/ProductCard'
import useAPI from '../../hooks/useAPI'

const Products = () => {

  // Set page title
  useDocumentTitle('Buyers - BackWatch');

  // useParams hook
  const { slug } = useParams();

  // Get products from the database
  const { data, dataLoading: productsLoading } = useParamsAPI('category/products', slug);

  // Filter the products
  const products = data?.filter(product => product?.status !== 'Sold Out');

  // Get categories from the database
  const { data: categories, dataLoading: categoriesLoading } = useAPI('categories');

  // Loader until we got the data
  if (productsLoading || categoriesLoading) {
    return <DataLoader />;
  };

  return (
    <Container size="xl" className="text-center mt-5">
      <Title order={2}>All {categories?.find(category => category.slug === slug)?.name} Watches</Title>
      <Title order={3} weight={100} align="center" mt={15}>{categories?.find(category => category.slug === slug)?.description}</Title>
      <Grid>
        {products?.map(product => <ProductCard key={product?._id} product={product} />)}
      </Grid>
    </Container>
  )
};

export default Products;