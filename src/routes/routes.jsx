import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Error from '../pages/common/Error'
import Main from '../layouts/Main'
import Dashboard from '../layouts/Dashboard'
import Home from '../pages/client/Home'
import Login from '../pages/client/Login'
import DashHome from '../pages/dashboard/DashHome'
import AddProducts from '../pages/dashboard/AddProducts'
import Products from '../pages/dashboard/Products'
import Blog from '../pages/client/Blog'
import PrivateRoute from './PrivateRoute'

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
      }
    ],
  },
  {
    path: '/dashboard',
    errorElement: <Error />,
    element: <Dashboard />,
    children: [
      {
        path: '/dashboard',
        element: <DashHome />
      },
      {
        path: '/dashboard/product/add',
        element: <AddProducts />
      },
      {
        path: '/dashboard/products',
        element: <Products />
      },
    ],
  }
]);