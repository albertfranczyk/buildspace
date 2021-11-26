import { useState, useEffect } from "react";
import { Box, Heading, Button, Text, Center } from "@chakra-ui/react";
import { ethers } from "ethers";
import waveportal from "../utils/waveportal.json";

import { WalletAddress } from "../components/WalletAdress";

export default function ShakeThat() {
  const [currentAccount, setCurrentAccount] = useState([]);
  const [allWaves, setAllWaves] = useState([]);

  const contractABI = waveportal.abi;
  const contractAddress = "0x0f2FFa8B57B4Fda48D094081F10f3c914341d6Ed";

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Listen in for emitter events!
   */
  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
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
  /** 
    wave function
   **/
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave("this is a message", {
          gasLimit: 300000,
        });

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <Center width="100%" height="90vh">
      <Box>
        <Heading>🦄 GM!</Heading>

        <Text maxW="400px" paddingY="10">
          I am Albert and I am learning about WEB 3 so thats pretty cool right?
          Connect your Ethereum wallet and wave at me!
        </Text>
        {currentAccount.length == 0 ? (
          <Button bgGradient="radial(#2C66B8, #592CB8)" onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <Button onClick={wave} bgGradient="radial(#2C66B8, #592CB8)">
            Wave at Me
          </Button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <Box key={index} marginY={10}>
              <Box>
                <Text>
                  Wallet Adress:
                  <WalletAddress
                    value={wave.address}
                    headCount={6}
                    tailCount={4}
                    separator="..."
                  />
                </Text>
              </Box>

              <Box>Time: {wave.timestamp.toString()}</Box>
              <Box>Message: {wave.message}</Box>
            </Box>
          );
        })}
      </Box>
    </Center>
  );
}
