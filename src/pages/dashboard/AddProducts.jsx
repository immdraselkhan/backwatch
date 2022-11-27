import React, { useContext, useState } from 'react'
import { TextInput, Button, Group, Box, NumberInput, Textarea, Select, FileInput, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { YearPickerInput } from 'mantine-dates-6'
import { IconUpload } from '@tabler/icons'
import { AuthContext } from '../../contexts/AuthProvider'
import useAPI from '../../api/useAPI'
import DataLoader from '../../components/common/DataLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddProducts = () => {

  // Getting data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  const form = useForm({
    // Form initial values
    initialValues: {
      title: '',
      image: '',
      category: '',
      categorySlug: '',
      originalPrice: '',
      resalePrice: '',
      yearOfUse: '',
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
      yearOfUse: (value) => !value,
      description: (value) => value.length < 100,
      condition: (value) => !value,
      sellerLocation: (value) => !value,
    },
  });

  // Get categories from the database
  const { data: categories, dataLoading } = useAPI('categories');
  
  // Handle form submission
  const handleSubmit = values => {

    const formData = new FormData();
    formData.append('image', values.image);
    const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB_API_KEY}`
    axios.post(url, formData)
    .then(data => {
      if (data.data.success) {
        // Creating object to send to the database
        const product = {
          title: values.title,
          imageURL: data.data.data.display_url,
          imageDeleteURL: data.data.data.delete_url,
          category: values.category,
          categorySlug: values.categorySlug,
          originalPrice: values.originalPrice,
          resalePrice: values.resalePrice,
          yearOfUse: new Date().getFullYear() - values.yearOfUse.getFullYear(),
          description: values.description,
          condition: values.condition,
          sellerNumber: values.sellerNumber,
          sellerLocation: values.sellerLocation,
          sellerName: user?.displayName,
          sellerId: user?.uid,
          createdAt: new Date().toLocaleString(),
        };

        axios.post(`${import.meta.env.VITE_API_Server}/add-product`, product)
        .then(data => {
          if (data.data.success) {
            // Successful toast
            toast.success(data.data.message, {
              autoClose: 1500, position: toast.POSITION.TOP_CENTER
            });
          };
        })
        .catch((error) => {
          // Error toast
          toast.error(error.message, {
            autoClose: 1500, position: toast.POSITION.TOP_CENTER
          });
        });
        // Form reset
        form.reset();
        // Disable the overlay loading
        setOverlayLoading(false);
      };
    })
    .catch((error) => {
      // Error toast
      toast.error(error.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Disable the overlay loading
      setOverlayLoading(false);
    });
  };

  // Loading until we got the data
  if (loading || dataLoading) {
    return <DataLoader />;
  };

  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => { handleSubmit(values); setOverlayLoading((v) => !v) })} style={{ maxWidth: 400, position: 'relative' }}>
        <LoadingOverlay visible={overlayLoading} overlayBlur={1} radius="sm" />
        <TextInput
          required
          placeholder="e.g: Apple watch 2"
          label="Product name"
          withAsterisk
          value={form.values.title}
          onChange={(event) => form.setFieldValue('title', event.currentTarget.value)}
        />

        <FileInput
          accept={"image/png,image/jpeg"}
          label="Watch photo"
          placeholder="Upload watch photo"
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
          label={`Year of purchase: ${form.values.yearOfUse ? form.values.yearOfUse.getFullYear() : new Date().getFullYear()}`}
          placeholder="e.g: 2020"
          maxDate={`${new Date().getFullYear()}`}
          withAsterisk
          value={form.values.yearOfUse || new Date()}
          onChange={(event) => form.setFieldValue('yearOfUse', event)}
          error={form.errors.yearOfUse && 'Select year of purchase'}
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
          error={form.errors.description && 'Minimum 100 character'}
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
          <Button type="submit" className="bg-primary hover:bg-secondary">Add </Button>
        </Group>
      </form>
    </Box>
  )
};

export default AddProducts;