import React, { useContext, useState } from 'react'
import { useDocumentTitle } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import useParamsAPI from '../../hooks/useParamsAPI'
import DataLoader from '../../components/common/DataLoader'
import { Container, Grid, Text, Title } from '@mantine/core'
import { AuthContext } from '../../contexts/AuthProvider'
import useAPI from '../../hooks/useAPI'
import ProductCard from '../../components/client/ProductCard'
import ProductAction from '../../components/client/ProductAction'
import { toast } from 'react-toastify'

const Products = () => {

  // useParams hook
  const { slug } = useParams();

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get user from the database
  const { data: storedUser, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // Get products from the database
  const { data, dataLoading: productsLoading } = useParamsAPI('category/products', slug);

  // Filter the products
  const products = data?.filter(product => product?.status !== 'Sold Out');

  // Get categories from the database
  const { data: categories, dataLoading: categoriesLoading } = useAPI('categories');

  // Category name
  const categoryInfo = categories?.find(category => category.slug === slug);

  // Set page title
  useDocumentTitle(`${categoryInfo?.name} Watches - BackWatch`);

  // Overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState({ booking: false, report: false });

  // Clicked product state
  const [clickedProduct, setClickedProduct] = useState({});

  // Handle booking error
  const handleBookingError = product => {
    if (storedUser?.role === 'admin') {
      // Error toast
      toast.error('Admin can\'t book!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    } else if (product?.sellerId === user?.uid) {
      // Error toast
      toast.error('Can\'t book your own product!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    } else {
      // Error toast
      toast.error('Already booked!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    };
  };

  // Handle report error
  const handleReportError = () => {
    storedUser?.role === 'admin' ?
    // Error toast
    toast.error('Admin can\'t report!', {
      autoClose: 1500, position: toast.POSITION.TOP_CENTER
    }) :
    // Error toast
    toast.error('Can\'t report your own product!', {
    autoClose: 1500, position: toast.POSITION.TOP_CENTER
    });
  };

  // Loader until we got the data
  if (loading || productsLoading || categoriesLoading, roleLoading) {
    return <DataLoader />;
  };

  return (
    <Container size="xl" className="text-center mt-5">
      <Title order={2}>All {categoryInfo?.name} Watches</Title>
      <Text mx="auto" align="center" mt={15} style={{maxWidth: '600px'}} color="dimmed">{categoryInfo?.description}</Text>
      <Grid>
        {products?.map(product => <ProductCard key={product?._id} product={product} user={user} storedUser={storedUser} setClickedProduct={setClickedProduct} setModal={setModal} handleBookingError={handleBookingError} handleReportError={handleReportError} />)}
        <ProductAction user={user} modal={modal} setModal={setModal} clickedProduct={clickedProduct} setClickedProduct={setClickedProduct} overlayLoading={overlayLoading} setOverlayLoading={setOverlayLoading} />
      </Grid>
    </Container>
  )
};

export default Products;