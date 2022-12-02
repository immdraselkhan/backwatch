import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, LoadingOverlay, Modal, NumberInput, Textarea, TextInput } from '@mantine/core'
import { toast } from 'react-toastify'

const ProductAction = ({ user, modal, setModal, clickedProduct, setClickedProduct, overlayLoading, setOverlayLoading }) => {

  // useNavigate hook
  const navigate = useNavigate();

  // Order info object
  let orderInfo = {
    uid: user?.uid,
    name: user?.displayName,
    email: user?.email,
    title: clickedProduct?.title,
    price: clickedProduct?.resalePrice,
    photoURL: clickedProduct.imageURL,
    number: '',
    location: '',
    status: 'Booked',
    sellerId: clickedProduct?.sellerId,
    productId: clickedProduct?._id,
    orderNumber: 'BW-O-#' + Math.floor(Math.random() * 1000000000),
    date: new Date().toLocaleString(),
  };

  // Report info object
  let reportInfo = {
    uid: user?.uid,
    reporterName: user?.displayName,
    email: user?.email,
    title: clickedProduct?.title,
    photoURL: clickedProduct.imageURL,
    productId: clickedProduct?._id,
    sellerId: clickedProduct?.sellerId,
    sellerName: clickedProduct?.sellerName,
    comment: '',
    reportNumber: 'BW-R-#' + Math.floor(Math.random() * 1000000000),
    date: new Date().toLocaleString(),
  };

  // Handle submit
  const handleSubmit = e => {
    // Disabling form default behavior
    e.preventDefault();
    if (modal.booking) {
      // Update order info object
      orderInfo['number'] = e.target.number.value;
      orderInfo['location'] = e.target.location.value;
    } else {
      // Update report info object
      reportInfo['comment'] = e.target.comment.value;
      console.log(reportInfo);
    };
    // Store object to database
    fetch(`${import.meta.env.VITE_API_Server}/add-${modal.booking ? 'order' : 'report'}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(modal.booking ? orderInfo : reportInfo),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Successful toast
        toast.success(data.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Form reset
        e.target.reset();
        // Disable the overlay loader
        setOverlayLoading(false);
        // Close the modal
        setModal({booking: false, report: false});
        // Redirect to products route
        modal.booking && navigate('/dashboard/orders');
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

  return (
    <Modal
      opened={modal.booking || modal.report}
      onClose={() => { setModal({ booking: false, report: false }); setClickedProduct({}) }}
      title={modal.booking ? 'Booking Product' : 'Report Product'}
      closeOnClickOutside={false}
      centered
    >
      <form onSubmit={e => { handleSubmit(e); setOverlayLoading(true) }} className="space-y-3">
        <LoadingOverlay visible={overlayLoading} overlayBlur={1} radius="sm" />
        <TextInput
          defaultValue={user?.displayName}
          label="Full name"
          withAsterisk
          disabled
        />
        {user?.email &&
        <TextInput
          defaultValue={user?.email}
          label="Email address"
          withAsterisk
          disabled
        />}
        <TextInput
          defaultValue={clickedProduct?.title}
          label="Product name"
          withAsterisk
          disabled
        />
        {modal.booking &&
        <>
          <NumberInput
            defaultValue={clickedProduct?.resalePrice}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '$ '
            }
            label="Product price"
            withAsterisk
            hideControls
            disabled
          />
          <NumberInput
            required
            placeholder="e.g: 880 1700-000000"
            label="Phone number"
            name="number"
            withAsterisk
            hideControls
          />
          <TextInput
            required
            placeholder="e.g: Dhaka"
            label="Location"
            name="location"
            withAsterisk
          />
        </>
        }
        {modal.report &&
        <Textarea
          required
          placeholder="Enter details about report"
          label="Comment"
          name="comment"
          withAsterisk
        />
        }
        <Button type="submit" mx="auto" style={{ display: 'flex', justifyContent: 'center' }} className="!mt-5">{modal.booking ? 'Confirm Booking' : 'Submit Report'}</Button>
      </form>
    </Modal>
  )
};

export default ProductAction;