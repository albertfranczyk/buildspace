import {
  Heading,
  Box,
  Text,
  Button,
  Flex,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/contractAdress";
import { transformCharacterData } from "../utils/transformCharacterData";
import myEpicGame from "../utils/myEpicGame.json";

export default function SelectCharacter({ setCharacterNFT }) {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  //new minting state property
  const [mintingCharacter, setMintingCharacter] = useState(false);

  // Actions
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        // show loading indicator when minting is happening
        setMintingCharacter(true);

        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);

        // hide the loading indicator when minting is done
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);

      // if there is an error hide the loading indicator too
      setMintingCharacter(false);
    }
  };

  // UseEffect
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      //This is the big difference. Set our gameContract in state.
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        /*Call contract to get all mint-able characters
         */
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        /*Go through all of our characters and transform the data
         */
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        /*Set all mint-able characters in state
         */
        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    // Add a callback method that will fire when this event is received
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      /*
          Once our character NFT is minted we can fetch the metadata from our contract
          and set it in state to move onto the Arena
          */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    /*
      If our gameContract is ready, let's get characters!
      */
    if (gameContract) {
      getCharacters();
      /*
          Setup NFT Minted Listener
          */
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      /*
          When your component unmounts, let;s make sure to clean up this listener
          */
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  return (
    <Box>
      <Heading size="lg">Mint Your Hero. Choose wisely.</Heading>
      <Flex>
        {characters.length > 0 &&
          characters.map((character, index) => (
            <Box key={character.name}>
              <Text>{character.name}</Text>
              <Box boxSize="sm" marginX={3}>
                <Image
                  boxSize="sm"
                  objectFit="cover"
                  src={character.imageURI}
                  alt={character.name}
                />
              </Box>
              <Button
                marginY={5}
                bgGradient="radial(#2C66B8, #592CB8)"
                onClick={mintCharacterNFTAction(index)}
              >
                {`Mint ${character.name}`}
              </Button>
            </Box>
          ))}
        {mintingCharacter && <Spinner />}
      </Flex>
    </Box>
  );
}
