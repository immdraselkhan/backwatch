import React, { useContext, useState } from 'react'
import { useDocumentTitle } from '@mantine/hooks'
import { AuthContext } from '../../contexts/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import DataLoader from '../../components/common/DataLoader'
import { Avatar, Box, Button, Center, Modal, Table } from '@mantine/core'
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons'
import { toast } from 'react-toastify'
import NoResultImage from '../../assets/no-result.png'
import VerifyImage from '../../assets/verify.png'
import DeleteImage from '../../assets/delete.png'

const Sellers = () => {

  // Set page title
  useDocumentTitle('Sellers - BackWatch');

  // Get data from AuthContext
  const { loading } = useContext(AuthContext);

  // Modal state
  const [modal, setModal] = useState({ verify: false, delete: false });

  // Clicked seller state
  const [clickedSeller, setClickedSeller] = useState({});

  // Get sellers from the database
  const { data: sellers = [], isLoading, refetch } = useQuery({
    queryKey: ['sellers'],
    queryFn: () =>
    fetch(`${import.meta.env.VITE_API_Server}/sellers`, {
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

  // Handle verify
  const handleVerify = () => {
    fetch(`${import.meta.env.VITE_API_Server}/update-seller/${clickedSeller?.uid}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      // body: JSON.stringify(user)
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
        setModal({verify: false});
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

  // Handle delete
  const handleDelete = () => {
    fetch(`${import.meta.env.VITE_API_Server}/delete-seller/${clickedSeller?.uid}`, {
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

  // Map the sellers
  const rows = sellers?.map((seller) => (
    <tr key={seller?._id}>
      <td>
        <Avatar src={seller?.photoURL} />
      </td>
      <td>{seller?.name}</td>
      <td>{seller?.email}</td>
      <td>
        <Button onClick={() => { setClickedSeller(seller); setModal({verify: !seller?.isVerified}) }} color={seller?.isVerified ? 'green' : 'gray'} leftIcon={seller?.isVerified ? <IconCircleCheck size={14} /> : <IconAlertCircle size={14} />} compact>{seller?.isVerified ? 'Verified' : 'Unverified'}</Button>
      </td>
      <td>
        <Button onClick={() => { setClickedSeller(seller); setModal({ delete: true }) }} variant="gradient" gradient={{ from: 'red', to: 'orange' }} compact>Delete</Button>
      </td>
    </tr>
  ));

  // Loader until we got the data
  if (loading || isLoading) {
    return <DataLoader />;
  };

  return (
    <>
      {!sellers?.length || sellers?.length < 0 ? (
        <div className="flex items-center h-full">
          <img src={NoResultImage} alt="No result found" className="w-96 mx-auto" />
        </div>
      ) :
      <Table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>}
      <Modal
        opened={modal.verify || modal.delete}
        onClose={() => setModal({ verify: false, delete: false })}
        closeOnClickOutside={false}
        centered
      >
        <Box className="relative pb-5 mx-auto space-y-10">
          <img src={modal.verify ? VerifyImage : DeleteImage} alt="" className="w-48 mx-auto" />
          <Center>
            <Button variant="gradient" gradient={modal.verify ? { from: 'teal', to: 'blue', deg: 60 } : { from: 'red', to: 'orange' }} onClick={modal.verify ? handleVerify : handleDelete}>{modal.verify ? 'Confirm Verify' : 'Confirm Delete'}</Button>
          </Center>
        </Box>
      </Modal>
    </>
  )
};

export default Sellers;