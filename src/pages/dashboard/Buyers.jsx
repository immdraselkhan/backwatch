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

const Buyers = () => {

  // Set page title
  useDocumentTitle('Buyers - BackWatch');

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Modal state
  const [modal, setModal] = useState(false);

  // Clicked buyer state
  const [clickedBuyer, setClickedBuyer] = useState({});

  // // Get user from the database
  const { data: storedUser, dataLoading: roleLoading } = useParamsAPI('user', user?.uid);

  // Get buyers from the database
  const { data: buyers = [], isLoading, refetch } = useQuery({
    queryKey: ['buyers', user?.uid],
    queryFn: () =>
    fetch(`${import.meta.env.VITE_API_Server}/buyers/${user?.uid}`, {
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
    fetch(`${import.meta.env.VITE_API_Server}/delete-buyer/${clickedBuyer?.uid}`, {
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

  // Map the buyers
  const rows = buyers?.map((buyer) => (
    <tr key={buyer?._id}>
      <td>
        <Avatar src={buyer?.photoURL} />
      </td>
      <td>{buyer?.name}</td>
      <td>{buyer?.email}</td>
      <td>
        {storedUser?.role === 'admin' && <Button onClick={() => { setClickedBuyer(buyer); setModal(true) }} variant="gradient" gradient={{ from: 'red', to: 'orange' }} compact>Delete</Button>}
      </td>
    </tr>
  ));

  // Loader until we got the data
  if (loading || roleLoading || isLoading) {
    return <DataLoader />;
  };

  return (
    <>
      {!buyers?.length || buyers?.length < 0 ? (
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

export default Buyers;