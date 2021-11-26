import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "#07071c",
        color: "white",
      },
      // styles for the `a`
      a: {
        color: "teal.500",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  colors: {
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    brandDark: "#FF0080",
    brandLight: "#7928CA",
    background: "#07071c",
  },
  font: {
    heading: "Karla",
    body: "Karla"
  }
})

export default theme