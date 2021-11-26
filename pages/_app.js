import { ChakraProvider,  CSSReset } from "@chakra-ui/react"
import theme from '../src/theme'
import '../src/theme/styles.css'
import { Layout } from "../components/Layout"

function MyApp({ Component }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Layout>
        <Component />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
