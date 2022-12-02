import React, { useContext, useState } from 'react'
import { useDocumentTitle } from '@mantine/hooks'
import { AuthContext } from '../../contexts/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import DataLoader from '../../components/common/DataLoader'
import { Avatar, Box, Button, Center, Modal, Table } from '@mantine/core'
import useParamsAPI from '../../hooks/useParamsAPI'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'
import NoResultImage from '../../assets/no-result.png'
import DeleteImage from '../../assets/delete.png'
import CheckoutForm from '../../components/client/CheckoutForm'

const Orders = () => {

  // Set page title
  useDocumentTitle('Orders - BackWatch');

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Modal state
  const [modal, setModal] = useState({ delete: false, pay: false });

  // Clicked order state
  const [clickedOrder, setClickedOrder] = useState({});

  // Get user from the database
  const { data: storedUser, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // Get orders from the database
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () =>
    fetch(`${import.meta.env.VITE_API_Server}/orders/${user?.uid}`, {
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

  // Handle delete
  const handleDelete = () => {
    fetch(`${import.meta.env.VITE_API_Server}/delete-order/${clickedOrder?._id}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
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
        setModal(false);
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

  // recreating the 'Stripe' object on every render
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST);

  // Map the orders
  const rows = orders?.map((order) => (
    <tr key={order?._id}>
      <td>
        <Avatar src={order?.photoURL} />
      </td>
      <td>{order?.orderNumber}</td>
      <td>{order?.title}</td>
      <td>{order?.name}</td>
      <td>{order?.location}</td>
      <td>{order?.number}</td>
      <td>{order?.price}</td>
      <td>{order?.trxId || 'Not paid yet!'}</td>
      <td>{order?.date}</td>
      <td>{order?.status}</td>
      <td>
        {storedUser?.role === 'admin' && <Button onClick={() => { setClickedOrder(order); setModal({ delete: true}) }} variant="gradient" gradient={{ from: 'red', to: 'orange' }} compact>Delete</Button>}
        {storedUser?.role === 'buyer' || clickedOrder?.status !== 'Paid' && <Button onClick={() => { setClickedOrder(order); setModal({ pay: true }) }} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} compact>Pay Now</Button>}
      </td>
    </tr>
  ));

  // Loader until we got the data
  if (loading || roleLoading || isLoading) {
    return <DataLoader />;
  };

  return (
    <>
      {!orders?.length || orders?.length < 0 ? (
        <div className="flex items-center h-full">
          <img src={NoResultImage} alt="No result found" className="w-96 mx-auto" />
        </div>
      ) :
      <Table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Order Number</th>
            <th>Title</th>
            <th>Name</th>
            <th>Location</th>
            <th>Phone Number</th>
            <th>Price</th>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Status</th>
              {(storedUser?.role === 'admin' || (storedUser?.role === 'buyer' || clickedOrder?.status !== 'Paid')) && <th>Action</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>}
      <Modal
        title={modal.pay && 'Secure Payment Method'}
        opened={modal.delete || modal.pay}
        onClose={() => setModal({delete: false, pay: false})}
        closeOnClickOutside={false}
        centered
      >
        <Box className={`relative pb-5 mx-auto space-y-10 ${modal.pay && 'py-10'}`}>
          {modal.delete ?
            <>
              <img src={DeleteImage} alt="" className="w-48 mx-auto" />
              <Center>
                <Button variant="gradient" gradient={{ from: 'red', to: 'orange' }} onClick={handleDelete}>Confirm Delete</Button>
              </Center>
            </> :
            <Elements stripe={stripePromise}>
              <CheckoutForm order={clickedOrder} setModal={setModal} />
            </Elements>
          }
        </Box>
      </Modal>
    </>
  )
};

export default Orders;