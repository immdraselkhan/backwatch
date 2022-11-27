import React, { useContext } from 'react'
import useRole from '../../hooks/useRole'
import useParamsAPI from '../../hooks/useParamsAPI'
import DataLoader from '../../components/common/DataLoader'
import { AuthContext } from '../../contexts/AuthProvider'
import { Table } from '@mantine/core'
import NoResultImage from '../../assets/no-result.png'

const Products = () => {

  // Get data from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get user role from the database
  const [role, roleLoading] = useRole(user?.uid);

  // Get categories from the database
  const { data: products, dataLoading } = useParamsAPI('products', user?.uid);

  // Map the prducts
  const rows = products?.map((product) => (
    <tr key={product._id}>
      <td>{product.title}</td>
      <td>{product.category}</td>
      <td>{product.condition}</td>
      <td>{product.createdAt}</td>
      <td>{product.originalPrice}</td>
      <td>{product.resalePrice}</td>
      <td>{product.yearOfUse}</td>
      <td>{product.sellerLocation}</td>
      <td>{product.sellerNumber}</td>
    </tr>
  ));

  // Loader until we got the data
  if (loading || roleLoading || dataLoading) {
    return <DataLoader />;
  };

  return (
    <>
      {products.length < 1 ? (
        <div className="flex items-center h-full">
          <img src={NoResultImage} alt="No result found" className="w-96 mx-auto" />
        </div>
      ) :
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Condition</th>
            <th>Date</th>
            <th>Original Price</th>
            <th>Resale Price</th>
            <th>Year of User</th>
            <th>Seller Location</th>
            <th>Seller Number</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>}
    </>
  )
};

export default Products;