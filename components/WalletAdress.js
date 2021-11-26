import { Text } from "@chakra-ui/react";

function valueToOutput({
  value,
  headCount = 4,
  tailCount = 4,
  separator = "...",
}) {
  return (
    value.slice(0, headCount) +
    separator +
    value.slice(value.length - tailCount, value.length)
  );
}

export const WalletAddress = ({ value, headCount, tailCount, separator }) => (
  <Text>{valueToOutput({ value, headCount, tailCount, separator })}</Text>
);
