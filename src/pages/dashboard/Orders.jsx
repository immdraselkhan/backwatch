import React, { useContext, useState } from 'react'
import { useDocumentTitle } from '@mantine/hooks'
import { AuthContext } from '../../contexts/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import DataLoader from '../../components/common/DataLoader'
import { Avatar, Box, Button, Center, Modal, Table } from '@mantine/core'
import useParamsAPI from '../../hooks/useParamsAPI'
import { toast } from 'react-toastify'
import NoResultImage from '../../assets/no-result.png'
import DeleteImage from '../../assets/delete.png'

const Orders = () => {

  // Set page title
  useDocumentTitle('Orders - BackWatch');

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Modal state
  const [modal, setModal] = useState(false);

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

// {
//   "title": "Samsung Watch",
//   "uid": "jm01t0BPxUQL9BHOnwntKJ9fn8D3",
//   "name": "Md Rasel",
//   "email": "jane@jane.com",
//   "photoURL": "https://i.ibb.co/Qn9DpFR/2022-11-24-09-45.png",
//   "price": 200,
//   "trxId": "BHJ454S656F",
//   "date": "30/11/2022, 08:11:53",
//   "number": "017777777",
//   "location": "Dhaka",
//   "sellerId": "WhnFwEmavQSFcn4b6fPnF8Mxb713",
//   "status": "Booked",
//   "productId": "6386bbe9afdf1a69957c4a6f"
// }

  // Map the orders
  const rows = orders?.map((order) => (
    <tr key={order?._id}>
      <td>
        <Avatar src={order?.photoURL} />
      </td>
      <td>{order?.title}</td>
      <td>{order?.name}</td>
      <td>{order?.location}</td>
      <td>{order?.number}</td>
      <td>{order?.price}</td>
      <td>{order?.trxId}</td>
      <td>{order?.date}</td>
      <td>{order?.status}</td>
      <td>
        {storedUser?.role === 'admin' && <Button onClick={() => { setClickedOrder(order); setModal(true) }} variant="gradient" gradient={{ from: 'red', to: 'orange' }} compact>Delete</Button>}
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
            <th>Title</th>
            <th>Name</th>
            <th>Location</th>
            <th>Number</th>
            <th>Price</th>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Status</th>
            {storedUser?.role === 'admin' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>}
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        closeOnClickOutside={false}
        centered
      >
        <Box className="relative pb-5 mx-auto space-y-10">
          <img src={DeleteImage} alt="" className="w-48 mx-auto" />
          <Center>
            <Button variant="gradient" gradient={{ from: 'red', to: 'orange' }} onClick={handleDelete}>Confirm Delete</Button>
          </Center>
        </Box>
      </Modal>
    </>
  )
};

export default Orders;