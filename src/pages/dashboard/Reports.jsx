import React, { useContext, useState } from 'react'
import { useDocumentTitle } from '@mantine/hooks'
import { AuthContext } from '../../contexts/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import DataLoader from '../../components/common/DataLoader'
import { Avatar, Box, Button, Center, Modal, Table } from '@mantine/core'
import { toast } from 'react-toastify'
import NoResultImage from '../../assets/no-result.png'
import DeleteImage from '../../assets/delete.png'

const Reports = () => {

  // Set page title
  useDocumentTitle('Reports - BackWatch');

  // Get data from AuthContext
  const { loading } = useContext(AuthContext);

  // Modal state
  const [modal, setModal] = useState({ comment: false, delete: false });

  // Clicked report state
  const [clickedReport, setClickedReport] = useState({});

  // Get reports from the database
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: () =>
    fetch(`${import.meta.env.VITE_API_Server}/reports`, {
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

// {
//   "photoURL" : "https://i.ibb.co/7NNM1c5/1585765580-5028412.jpg",
//   "title" : "Apple Watch 5",
//   "productId": "6386b282c079ab7f5c1a3976",
//   "sellerName" : "Justin Mullins",
//   "sellerId": "WhnFwEmavQSFcn4b6fPnF8Mxb713",
//   "reporterName": "Md Rasel",
//   "comment": "Seller er price onek beshi diche new product er chaite o. Tai delete kore din"
// }

  // Handle delete
  const handleDelete = () => {
    fetch(`${import.meta.env.VITE_API_Server}/delete-product/${clickedReport?.productId}`, {
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

  // Map the reports
  const rows = reports?.map((report) => (
    <tr key={report?._id}>
      <td>
        <Avatar src={report?.photoURL} />
      </td>
      <td>{report?.title}</td>
      <td>{report?.sellerName}</td>
      <td>{report?.sellerEmail || report?.sellerId}</td>
      <td>{report?.reporterName}</td>
      <td>
        <Button.Group>
          <Button onClick={() => { setClickedReport(report); setModal({ comment: true }) }} compact>View comment</Button>
          <Button onClick={() => { setClickedReport(report); setModal({ delete: true }) }} variant="gradient" gradient={{ from: 'red', to: 'orange' }} compact>Delete</Button>
        </Button.Group>
      </td>
    </tr>
  ));

  // Loader until we got the data
  if (loading || isLoading) {
    return <DataLoader />;
  };

  return (
    <>
      {!reports?.length || reports?.length < 0 ? (
        <div className="flex items-center h-full">
          <img src={NoResultImage} alt="No result found" className="w-96 mx-auto" />
        </div>
      ) :
      <Table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Product Name</th>
            <th>Seller</th>
            <th>Seller ID</th>
            <th>Reporter</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>}
      <Modal
        title={modal.comment && "Report Details"}
        opened={modal.comment || modal.delete}
        onClose={() => setModal({ comment: false, delete: false })}
        closeOnClickOutside={false}
        centered
      >
        <Box className="relative pb-5 mx-auto space-y-10">
          {modal.comment ? <p className="pt-5 text-center">{clickedReport?.comment}</p> : <img src={DeleteImage} alt="" className="w-48 mx-auto" />}
          <Center>
            <Button variant="gradient" gradient={{ from: 'red', to: 'orange' }} onClick={handleDelete}>Delete Product</Button>
          </Center>
        </Box>
      </Modal>
    </>
  )
};

export default Reports;