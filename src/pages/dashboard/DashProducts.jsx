import React, { useContext, useState } from 'react'
import useParamsAPI from '../../hooks/useParamsAPI'
import DataLoader from '../../components/common/DataLoader'
import { AuthContext } from '../../contexts/AuthProvider'
import { Avatar, Box, Button, Center, FileInput, Group, LoadingOverlay, Modal, NumberInput, Select, Table, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconUpload } from '@tabler/icons'
import { YearPickerInput } from 'mantine-dates-6'
import useAPI from '../../hooks/useAPI'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useDocumentTitle } from '@mantine/hooks'
import NoResultImage from '../../assets/no-result.png'
import AdsImage from '../../assets/ads.png'
import DeleteImage from '../../assets/delete.png'

const DashProducts = () => {

  // Set page title
  useDocumentTitle('Products - BackWatch');

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Modal state
  const [modal, setModal] = useState({ ads: false, edit: false, delete: false });

  // Clicked product state
  const [clickedProduct, setClickedProduct] = useState({});

  // Get user from the database
  const { data: storedUser, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // Get categories from the database
  const { data: categories, dataLoading: categoriesLoading } = useAPI('categories');

  // Get products from the database
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products', user?.uid],
    queryFn: () =>
    fetch(`${import.meta.env.VITE_API_Server}/products/${user?.uid}`, {
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        return data.result;
      } else {
        // Error toast
        toast.error(data.error, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      };
    })
    .catch(error => {
      // Error toast
      toast.error(error.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    })
  });

  // Destructure clicked product
  const { _id, title, imageURL, category, categorySlug, originalPrice, resalePrice, yearOfPurchase, description, condition, sellerNumber, sellerLocation, status } = clickedProduct;
  
  // Mantine useForm
  const form = useForm({
    // Form initial values
    initialValues: {
      title,
      imageURL,
      category,
      categorySlug,
      originalPrice,
      resalePrice,
      yearOfPurchase,
      description,
      condition,
      sellerNumber,
      sellerLocation,
      status,
    },
    // Form validation
    validate: {
      image: (value) => form.isTouched('imageURL') ? (!value && !form.values.imageURL) : false,
      category: (value) => !value,
      originalPrice: (value) => value < form.values.resalePrice,
      resalePrice: (value) => form.values.originalPrice < value,
      yearOfPurchase: (value) => !value,
      description: (value) => value?.length < 100 || value?.length > 500,
      condition: (value) => !value,
      sellerLocation: (value) => !value,
      status: (value) => !value,
    }
  });

  // Handle form submit
  const handleSubmit = values => {

    // Check any field touched
    if (!form.isTouched()) {
      // Error toast
      toast.error('Nothing to update', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Close the modal
      setModal({edit: false});
      // Return the submit
      return;
    };

    // When image field touched
    if (form.isTouched('imageURL')) {
      const formData = new FormData();
      formData.append('image', values.imageURL);
      const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB_API_KEY}`
      axios.post(url, formData)
      .then(data => {
        if (data.data.success) {
          // Replace image url and image delete url
          form.values['imageURL'] = data.data.data.display_url;
          form.values['imageDeleteURL'] = data.data.data.delete_url;
          // Call update product fn
          updateProduct(values);
        } else {
          // Error toast
          toast.error(data.data.message, {
            autoClose: 1500, position: toast.POSITION.TOP_CENTER
          });
          // Disable the overlay loading
          setOverlayLoading(false);
        };
      })
      .catch(error => {
        // Error toast
        toast.error(error.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loader
        setOverlayLoading(false);
      });
    } else {
      // Call update product fn except image field touched
      updateProduct(form.values);
    };
  };

  // Update the product
  const updateProduct = product => {
    // Delete _id property since MongoDB _id is immutable
    delete product._id;
    // Update yearOfUse property
    product.yearOfUse = new Date().getFullYear() - product.yearOfPurchase;
    // Update object from database
    fetch(`${import.meta.env.VITE_API_Server}/update-product/${_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Successful toast
        toast.success(data.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Refetch products
        refetch();
        // Close the modal
        setModal({edit: false});
        // Disable the overlay loader
        setOverlayLoading(false);
      } else {
        // Error toast
        toast.error(data.error, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loader
        setOverlayLoading(false);
      };
    })
    .catch(error => {
      // Error toast
      toast.error(error.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
    // Disable the overlay loader
    setOverlayLoading(false);
  };

  // Handle publish ads
  const publishAds = () => {
    // Create object
    const product = {isAds: true};
    // Update object from database
    fetch(`${import.meta.env.VITE_API_Server}/update-product/${_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Successful toast
        toast.success('Ads successfully published!', {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Refetch products
        refetch();
        // Close the modal
        setModal({ads: false});
      } else {
        // Error toast
        toast.error('Ads published error!', {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      };
    })
    .catch(error => {
      // Error toast
      toast.error(error.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // Handle delete product
  const deleteProduct = () => {
    fetch(`${import.meta.env.VITE_API_Server}/delete-product/${_id}`, {
      method: 'DELETE',
      headers: {authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Successful toast
        toast.success(data.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Refetch products
        refetch();
        // Close the modal
        setModal({delete: false});
      } else {
        // Error toast
        toast.error(data.error, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      };
    })
    .catch(error => {
      // Error toast
      toast.error(error.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // Map the products
  const rows = products?.map((product) => (
    <tr key={product._id}>
      <td>
        <Avatar src={product?.imageURL} />
      </td>
      <td>{product.title}</td>
      <td>{product.category}</td>
      <td>{product.condition}</td>
      <td>{product.originalPrice}</td>
      <td>{product.resalePrice}</td>
      <td>{product.sellerLocation}</td>
      <td>{product.sellerNumber}</td>
      <td>{product.status}</td>
      <td>
        <Button.Group>
          {storedUser?.role !== 'admin' &&
          <>
            {!product?.isAds && product?.status !== 'Sold Out' ? <Button color="green" compact onClick={() => {setModal({ ads: true }); setClickedProduct(product)}}>Adversite</Button> : <Button color="green" className="!text-gray-400" compact disabled>Ads published</Button>}
            {product?.status === 'In Stock' ? <Button color="yellow" compact onClick={() => {setModal({ edit: true }); setClickedProduct(product); form.setValues((prev) => ({ ...prev, ...product }))}}>Edit</Button> : <Button color="yellow" className="!text-gray-400" compact disabled>Edit</Button>}
          </>}
          {storedUser?.role === 'admin' &&
            <Button color="red" compact onClick={() => {setModal({ delete: true }); setClickedProduct(product)}}>Delete</Button>
          }
        </Button.Group>
      </td>
    </tr>
  ));

  // Loader until we got the data
  if (loading || roleLoading || categoriesLoading || isLoading) {
    return <DataLoader />;
  };

  return (
    <>
      {!products?.length || products?.length < 0 ? (
        <div className="flex items-center h-full">
          <img src={NoResultImage} alt="No result found" className="w-96 mx-auto" />
        </div>
      ) :
      <Table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Title</th>
            <th>Category</th>
            <th>Condition</th>
            <th>Original Price</th>
            <th>Resale Price</th>
            <th>Location</th>
            <th>Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>}
      <Modal
        opened={modal.edit}
        onClose={() => setModal({edit: false})}
        title="Edit product"
        closeOnClickOutside={false}
        centered
      >
        <Box style={{ maxWidth: 600, position: 'relative' }} mx="auto">
          <form onSubmit={form.onSubmit(values => {handleSubmit(values); setOverlayLoading(form.isTouched())})} className="space-y-5">
            <LoadingOverlay visible={overlayLoading} overlayBlur={1} radius="sm" />
            <TextInput
              required
              placeholder="e.g: Apple watch 5"
              label="Product name"
              withAsterisk
              value={form.values.title}
              onChange={(event) => form.setFieldValue('title', event.currentTarget.value)}
              error={form.errors.title && 'Title is required'}
            />

            <FileInput
              required
              accept={"image/png,image/jpeg"}
              label="Product photo"
              placeholder="Upload product photo"
              icon={<IconUpload size={14} />}
              value={form.values.imageURL}
              onChange={(event) => form.setFieldValue('imageURL', event)}
              error={form.errors.imageURL && 'Upload product image'}
            />

            <Select
              data={categories.map(category => category.name)}
              label="Category"
              placeholder="Select category"
              withAsterisk
              value={form.values.category}
              onChange={(event) => { form.setFieldValue('category', event); form.setFieldValue('categorySlug', categories.find(category => event === category.name).slug) }}
              error={form.errors.category && 'Select a category'}
            />

            <NumberInput
              required
              placeholder="e.g: 100"
              label="Original price"
              withAsterisk
              value={form.values.originalPrice}
              onChange={(event) => form.setFieldValue('originalPrice', event)}
              error={form.errors.originalPrice && 'Original price can not less than resale price'}
            />

            <NumberInput
              required
              placeholder="e.g: 50"
              label="Resale price"
              withAsterisk
              value={form.values.resalePrice}
              onChange={(event) => form.setFieldValue('resalePrice', event)}
              error={form.errors.resalePrice && 'Resale price can not more than original price'}
            />

            <YearPickerInput
              label={`Year of purchase: ${form.values.yearOfPurchase}`}
              placeholder="e.g: 2020"
              maxDate={`${new Date().getFullYear()}`}
              withAsterisk
              value={new Date(`${form.values.yearOfPurchase}`)}
              onChange={(event) => form.setFieldValue('yearOfPurchase', event.getFullYear())}
              error={form.errors.yearOfPurchase && 'Select year of purchase'}
            />

            <Textarea
              required
              placeholder="Enter product details..."
              label="Description"
              autosize
              minRows={4}
              withAsterisk
              value={form.values.description}
              onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
              error={form.errors.description && 'Minimum 100 and maximum 500 character'}
            />

            <Select
              data={['Excelent', 'Good', 'Fair']}
              label="Condition"
              placeholder="Select condition"
              withAsterisk
              value={form.values.condition}
              onChange={(event) => form.setFieldValue('condition', event)}
              error={form.errors.condition && 'Select product condition'}
            />

            <NumberInput
              required
              type="tel"
              placeholder="e.g: 880 1700-000000"
              label="Mobile number"
              withAsterisk
              hideControls
              value={form.values.sellerNumber}
              onChange={(event) => form.setFieldValue('sellerNumber', event)}
            />

            <TextInput
              required
              placeholder="e.g: Dhaka"
              label="Location"
              withAsterisk
              value={form.values.sellerLocation}
              onChange={(event) => form.setFieldValue('sellerLocation', event.currentTarget.value)}
              error={form.errors.sellerLocation && 'Select your location'}
            />

            <Select
              data={['In Stock', 'Sold Out']}
              label="Status"
              placeholder="Change status"
              withAsterisk
              value={form.values.status}
              onChange={(event) => form.setFieldValue('status', event)}
              error={form.errors.status && 'Select product status'}
            />

            <Group position="right" mt="md">
              <Button type="submit">Update Product</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Modal
        opened={modal.ads}
        onClose={() => setModal({ads: false})}
        closeOnClickOutside={false}
        centered
      >
        <Box className="relative pb-5 mx-auto space-y-10">
          <img src={AdsImage} alt="" className="w-48 mx-auto" />
          <Center>
            <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} onClick={publishAds}>Publish Ads For Free</Button>
          </Center>
        </Box>
      </Modal>
      <Modal
        opened={modal.delete}
        onClose={() => setModal({delete: false})}
        closeOnClickOutside={false}
        centered
      >
        <Box className="relative pb-5 mx-auto space-y-10">
          <img src={DeleteImage} alt="Delete alert" className="w-24 mx-auto" />
          <Center>
            <Button variant="gradient" gradient={{ from: 'red', to: 'orange' }} onClick={deleteProduct}>Confirm Delete</Button>
          </Center>
        </Box>
      </Modal>
    </>
  )
};

export default DashProducts;