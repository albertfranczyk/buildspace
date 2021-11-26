import { Container, Box } from '@chakra-ui/react'
import { Footer } from './Footer'

export const Layout = ({ children }) => {
  return(
    <Container maxW="container.xl" backgroundColor="background">
      {children}
    <Footer />
    </Container>
  )
}