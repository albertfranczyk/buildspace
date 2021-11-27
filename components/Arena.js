import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Heading, Box, Text, Button, Flex, Image } from "@chakra-ui/react";
import { CONTRACT_ADDRESS } from "../utils/contractAdress";
import { transformCharacterData } from "../utils/transformCharacterData";
import myEpicGame from "../utils/MyEpicGame.json";

export default function Arena({ characterNFT }) {
  // State
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState("");
  const [showToast, setShowToast] = useState(false);
  // UseEffects
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

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);
  // UseEffects
  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    /*
     * Setup logic when this event is fired off
     */
    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
       * Update both player and boss Hp
       */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };

    if (gameContract) {
      fetchBoss();
      gameContract.on("AttackComplete", onAttackComplete);
    }

    /*
     * Make sure to clean up this event when this component is removed
     */
    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };
  return (
    <Flex>
      {boss && (
        <Box marginX={3}>
          <Text>{boss.name}</Text>
          <Box boxSize="sm" marginX={3}>
            <Image
              boxSize="sm"
              objectFit="cover"
              src={boss.imageURI}
              alt={boss.name}
            />
            <Text>{`${boss.hp} / ${boss.maxHp} HP`}</Text>
          </Box>
          <Button
            marginY={10}
            bgGradient="radial(#2C66B8, #592CB8)"
            onClick={runAttackAction}
          >
            {`Attack ${boss.name}`}
          </Button>
        </Box>
      )}

      {characterNFT && (
        <Box>
          <Text>Your character</Text>
          <Box boxSize="sm" marginX={3}>
            <Image
              boxSize="sm"
              objectFit="cover"
              src={characterNFT.imageURI}
              alt={characterNFT.name}
            />
            <Text>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</Text>
          </Box>
          <Text
            marginY={10}
          >{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</Text>
        </Box>
      )}
    </Flex>
  );
}
