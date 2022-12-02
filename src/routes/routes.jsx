import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Error from '../pages/common/Error'
import Login from '../pages/client/Login'
import Main from '../layouts/Main'
import Dashboard from '../layouts/Dashboard'
import Home from '../pages/client/Home'
import Products from '../pages/client/Products'
import DashHome from '../pages/dashboard/DashHome'
import AddProduct from '../pages/dashboard/AddProduct'
import DashProducts from '../pages/dashboard/DashProducts'
import Blog from '../pages/client/Blog'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoutes'
import AdminSellerRoute from './AdminSellerRoute'
import SellerRoute from './SellerRoute'
import Orders from '../pages/dashboard/Orders'
import Reports from '../pages/dashboard/Reports'
import Sellers from '../pages/dashboard/Sellers'
import Buyers from '../pages/dashboard/Buyers'

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <Error />,
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/category/:slug',
        element: <PrivateRoute><Products /></PrivateRoute>
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Login />
      },
      {
        path: '/blog',
        element: <Blog />
      },
    ],
  },
  {
    path: '/dashboard',
    errorElement: <Error />,
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [
      {
        path: '/dashboard',
        element: <PrivateRoute><DashHome /></PrivateRoute>
      },
      {
        path: '/dashboard/product/add',
        element: <SellerRoute><AddProduct /></SellerRoute>
      },
      {
        path: '/dashboard/products',
        element: <AdminSellerRoute><DashProducts /></AdminSellerRoute>
      },
      {
        path: '/dashboard/sellers',
        element: <AdminRoute><Sellers /></AdminRoute>
      },
      {
        path: '/dashboard/buyers',
        element: <AdminSellerRoute><Buyers /></AdminSellerRoute>
      },
      {
        path: '/dashboard/orders',
        element: <PrivateRoute><Orders /></PrivateRoute>
      },
      {
        path: '/dashboard/reports',
        element: <AdminRoute><Reports /></AdminRoute>
      }
    ],
  }
]);