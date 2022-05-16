import {supportedChainIds} from "../app.config";
import {getRpcUrlByChainId} from "./web3";
import {ethers} from 'ethers';
import * as airdropABI from './airdropABI'
export const airdrops = {
    3: {
        airdropAddress: "0x8FD70a9E20DAcDff6ab5905E94742afE5AE40f16",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0x0d92cadB0A0BC3693e985FB15E47BcF4d1Dc3792"
        ],
        tokensData:{
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0": {
                symbol: 'OCEAN',
                rewards: 0
            },
            "0x0d92cadB0A0BC3693e985FB15E47BcF4d1Dc3792": {
                symbol: 'PSDN',
                rewards: 0
            }
        },
        totalRewards: 0,
        abi: airdropABI.default
    },
    4: {
        airdropAddress: "0x4751774A124D02f1611dFe17f4d697dDdF932Fd5",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0xc6913d3eCed79021a39E6955015313B22B72b76E"
        ],
        tokensData:{
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0": {
                symbol: 'OCEAN',
                rewards: 0
            },
            "0xc6913d3eCed79021a39E6955015313B22B72b76E": {
                symbol: 'PSDN',
                rewards: 0
            }
        },
        totalRewards: 0,
        abi: airdropABI.default
    },
};

export const updateClaimablesFromAirdrop = async (chainId, airdropInfo, address) => {
    if (!chainId || !airdropInfo || !address) return null;
    let rewards = [];
    try {
        const rpcURL = getRpcUrlByChainId(chainId);
        if( rpcURL ) {
            const provider = new ethers.providers.JsonRpcProvider(rpcURL);
            const contract = new ethers.Contract(airdropInfo.airdropAddress, airdropInfo.abi, provider);
            const claimableRewards = await contract.claimables(address, airdropInfo.tokens)

            let totalRewards = 0;
            for (let i = 0; i < claimableRewards.length; i++) {
                const rewardInEthers = ethers.utils.formatEther(BigInt(claimableRewards[i]).toString(10))
                airdropInfo.tokensData[airdropInfo.tokens[i]].rewards = rewardInEthers > 0.0 ? rewardInEthers : 0.0
                totalRewards += rewardInEthers > 0.0 ? 1 : 0
            }

            airdropInfo.totalRewards = totalRewards
        }
    } catch (err) {
        console.error(err);
    }
}

export const updateAllClaimables = async (address, selectedChains) => {
    if (!address) return [];
    let claimables = {};
    const filteredChains = supportedChainIds.filter(x => selectedChains.indexOf(x) >= 0);

    await Promise.all(filteredChains.map(async function(chainId) {
        const airdropInfo = airdrops[chainId];
        for (const token in airdropInfo.tokens) {
            await updateClaimablesFromAirdrop(chainId, airdropInfo, address);
        }
    }));
}

export async function claimRewards(chainId) {
    console.log("claim");
    switchWalletNetwork(chainId);

    try {
      const airdrop = airdrops[chainId];
      const airdropClaimables = claimables[chainId];
      let positiveClaimables = [];

      // TODO - Make sure that claim is only done on non-zero tokens
      for (let i = 1; i < airdropClaimables.length; i++) {
        if (airdropClaimables[i] > 0)
          positiveClaimables.push(airdrop.tokens[i]);
      }

      const contract = new web3.eth.Contract(
        airdrops[chainId].abi,
        airdrops[chainId].airdropAddress
      );
      const results = await contract.methods
        .claim(positiveClaimables)
        .send({ from: userAddress });

      const remainingClaimables = await getClaimablesFromAirdrop(
        chainId,
        airdrops[chainId].airdropAddress,
        userAddress
      );
      let success = true;
      for (const claimable of remainingClaimables) {
        if (claimable > 0) {
          success = false;
          break;
        }
      }

      if (success === true) {
        console.log("Success claiming airdrop");
      } else {
        console.log("Error claiming airdrop");
      }
    } catch (error) {
      console.log("error :", error);
    }
  }
