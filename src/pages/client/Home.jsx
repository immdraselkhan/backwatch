import { useContext } from 'react';
import { Container } from '@mantine/core'
import { AuthContext } from '../../contexts/AuthProvider'

const Home = () => {
  const {user} = useContext(AuthContext)
  // console.log(user);
  return (
    <Container size="xl" className="text-center">
      <h1>Welcome to BackWatchShop</h1>
    </Container>
  )
};

export default Home;