import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box backgroundColor="background">
      <Flex
        flexDir="column"
        margin="0 auto"
        paddingTop={{ base: "100px", lg: "200px" }}
      >
        <Text
          bgClip="text"
          bgGradient="radial(#2C66B8, #592CB8)"
          fontWeight={800}
          letterSpacing={2.3}
          textTransform="uppercase"
        >
          Discover. Build. Learn.
        </Text>
        <Heading
          as="h1"
          maxWidth="550px"
          size="3xl"
          fontWeight={700}
          color="white"
          letterSpacing={1.5}
          lineHeight="1.2"
        >
          The Future Of The Internet
        </Heading>
        <Text color="white" fontWeight={510}>
          Set of projects made with help of{" "}
          <Link a href="https://buildspace.so/">
            buildspace
          </Link>{" "}
          community. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco
        </Text>
      </Flex>
    </Box>
  );
}
