import Link from 'next/link'
import {Box,Heading, Text} from '@chakra-ui/react'

export const Project = ({ heading, description, path, id }) => {
  return(
  <Box paddingY={20}>
    <Heading as="h2">{heading}</Heading>
    <Text>{description}</Text>
    <Link href={path}>
      <a>Visit</a>
    </Link>
  </Box>

  )
}