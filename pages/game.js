import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Heading, Button, Text, Center, Spinner } from "@chakra-ui/react";
import { transformCharacterData } from "../utils/transformCharacterData";
import { CONTRACT_ADDRESS } from "../utils/contractAdress";

import Arena from "../components/Arena";
import SelectCharacter from "../components/SelectCharacter";
import myEpicGame from "../utils/myEpicGame.json";

export default function Game() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Current Account", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    // The function we will call that interacts with out smart contract
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(characterNFT));
      }

      // once its done loading, set loading to false
      setIsLoading(false);
    };

    // We only want to run this, if we have a connected wallet
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (!currentAccount) {
      return (
        <Button bgGradient="radial(#2C66B8, #592CB8)" onClick={connectWallet}>
          Connect Wallet
        </Button>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      );
    }
  };
  return (
    <Center width="100%" height="90vh">
      <Box>
        <Heading as="h1" size="3xl">
          🦄 GAME!
        </Heading>
        <Text marginY={5}>Team up to protect the Metaverse!</Text>
        {renderContent()}
      </Box>
    </Center>
  );
}
