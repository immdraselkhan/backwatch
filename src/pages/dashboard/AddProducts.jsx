import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextInput, Button, Group, Box, NumberInput, Textarea, Select, FileInput, LoadingOverlay } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { YearPickerInput } from 'mantine-dates-6'
import { IconUpload } from '@tabler/icons'
import { AuthContext } from '../../contexts/AuthProvider'
import axios from 'axios'
import useParamsAPI from '../../hooks/useParamsAPI'
import useAPI from '../../hooks/useAPI'
import DataLoader from '../../components/common/DataLoader'
import { toast } from 'react-toastify'

const AddProducts = () => {

  // Set page title
  useDocumentTitle('Add Product - BackWatch');

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // useNavigate hook
  const navigate = useNavigate();

  // Overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Get user from the database
  const { data: storedUser, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // Get categories from the database
  const { data: categories, dataLoading: categoriesLoading } = useAPI('categories');

  // Mantine useForm
  const form = useForm({
    // Form initial values
    initialValues: {
      title: '',
      image: '',
      category: '',
      categorySlug: '',
      originalPrice: '',
      resalePrice: '',
      yearOfPurchase: '',
      description: '',
      condition: '',
      sellerNumber: '',
      sellerLocation: '',
    },
    // Form validation
    validate: {
      image: (value) => !value && !form.values.image,
      category: (value) => !value,
      originalPrice: (value) => value < form.values.resalePrice,
      resalePrice: (value) => form.values.originalPrice < value,
      yearOfPurchase: (value) => !value,
      description: (value) => value?.length < 100 || value?.length > 500,
      condition: (value) => !value,
      sellerLocation: (value) => !value,
    }
  });
  
  // Handle form submit
  const handleSubmit = values => {

    const formData = new FormData();
    formData.append('image', values.image);
    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB_API_KEY}`
    axios.post(url, formData)
    .then(data => {
      if (data.data.success) {
        // Create object to send to the database
        const product = {
          title: values.title,
          imageURL: data.data.data.display_url,
          imageDeleteURL: data.data.data.delete_url,
          category: values.category,
          categorySlug: values.categorySlug,
          originalPrice: values.originalPrice,
          resalePrice: values.resalePrice,
          status: 'In Stock',
          yearOfUse: new Date().getFullYear() - values.yearOfPurchase.getFullYear(),
          yearOfPurchase: values.yearOfPurchase.getFullYear(),
          description: values.description,
          condition: values.condition,
          sellerNumber: values.sellerNumber,
          sellerLocation: values.sellerLocation,
          sellerName: user?.displayName,
          sellerId: user?.uid,
          isVerified: storedUser?.isVerified,
          createdAt: new Date().toLocaleString(),
        };

        // Store object to database
        axios.post(`${import.meta.env.VITE_API_Server}/add-product`, product)
        .then(data => {
          if (data.data.success) {
            // Successful toast
            toast.success(data.data.message, {
              autoClose: 1500, position: toast.POSITION.TOP_CENTER
            });
            // Form reset
            form.reset();
            // Disable the overlay loader
            setOverlayLoading(false);
            // Redirect to products route
            navigate('/dashboard/products');
          } else {
            // Error toast
            toast.error(data.data.error, {
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
  };

  // Loader until we got the data
  if (loading || categoriesLoading || roleLoading) {
    return <DataLoader />;
  };

  return (
    <Box style={{ maxWidth: 600, position: 'relative' }} mx="auto">
      <form onSubmit={form.onSubmit((values) => {handleSubmit(values); setOverlayLoading(true)})} className="space-y-5">
        <LoadingOverlay visible={overlayLoading} overlayBlur={1} radius="sm" />
        <TextInput
          required
          placeholder="e.g: Apple watch 5"
          label="Product name"
          withAsterisk
          value={form.values.title}
          onChange={(event) => form.setFieldValue('title', event.currentTarget.value)}
        />

        <FileInput
          required
          accept={"image/png,image/jpeg"}
          label="Product photo"
          placeholder="Upload product photo"
          icon={<IconUpload size={14} />}
          value={form.values.image}
          onChange={(event) => form.setFieldValue('image', event)}
          error={form.errors.image && 'Upload product image'}
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
          label={`Year of purchase: ${form.values.yearOfPurchase ? form.values.yearOfPurchase.getFullYear() : new Date().getFullYear()}`}
          placeholder="e.g: 2020"
          maxDate={`${new Date().getFullYear()}`}
          withAsterisk
          value={form.values.yearOfPurchase || new Date()}
          onChange={(event) => form.setFieldValue('yearOfPurchase', event)}
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

        <Select
          data={['Barishal', 'Chittagong', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet']}
          label="Location"
          placeholder="Select location"
          withAsterisk
          value={form.values.sellerLocation}
          onChange={(event) => form.setFieldValue('sellerLocation', event)}
          error={form.errors.sellerLocation && 'Select your location'}
        />
        
        <Group position="right" mt="md">
          <Button type="submit">Add Product</Button>
        </Group>
      </form>
    </Box>
  )
};

export default AddProducts;