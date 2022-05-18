import {supportedChainIds} from "../app.config";
import {getRpcUrlByChainId} from "./web3";
import {ethers} from 'ethers';
import * as airdropABI from './airdropABI'
export const airdrops = {
    3: {
        airdropAddress: "0x8FD70a9E20DAcDff6ab5905E94742afE5AE40f16",
        tokens: [
            "0x400a17C7644fEF90EC5e85C59BA2034A6D4B1366",
            "0x0d92cadB0A0BC3693e985FB15E47BcF4d1Dc3792"
        ],
        tokensData:{
            "0x400a17C7644fEF90EC5e85C59BA2034A6D4B1366": {
                symbol: 'OCEAN',
                amount: 0
            },
            "0x0d92cadB0A0BC3693e985FB15E47BcF4d1Dc3792": {
                symbol: 'PSDN',
                amount: 0
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
                amount: 0
            },
            "0xc6913d3eCed79021a39E6955015313B22B72b76E": {
                symbol: 'PSDN',
                amount: 0
            }
        },
        totalRewards: 0,
        abi: airdropABI.default
    },
};

export const updateClaimablesFromAirdrop = async (chainId, airdropInfo, userAddress) => {
    if (!chainId || !airdropInfo || !userAddress) return null;
    let rewards = [];
    try {
        const rpcURL = getRpcUrlByChainId(chainId);
        if( rpcURL ) {
            const provider = new ethers.providers.JsonRpcProvider(rpcURL);
            const contract = new ethers.Contract(airdropInfo.airdropAddress, airdropInfo.abi, provider);
            const claimableRewards = await contract.claimables(userAddress, airdropInfo.tokens)
            let totalRewards = 0;
            for (let i = 0; i < claimableRewards.length; i++) {
                const rewardInEthers = ethers.utils.formatEther(BigInt(claimableRewards[i]).toString(10))
                airdropInfo.tokensData[airdropInfo.tokens[i]].amount = rewardInEthers > 0.0 ? rewardInEthers : 0.0
                totalRewards += rewardInEthers > 0.0 ? 1 : 0
            }

            airdropInfo.totalRewards = totalRewards
        }
    } catch (err) {
        console.error(err);
    }
}

export const updateAllClaimables = async (userAddress, selectedChains) => {
    if (!userAddress) return []
    const filteredChains = supportedChainIds.filter(x => selectedChains.indexOf(x) >= 0);

    await Promise.all(filteredChains.map(async function(chainId) {
        const airdropInfo = airdrops[chainId];
        for (const token in airdropInfo.tokens) {
            await updateClaimablesFromAirdrop(chainId, airdropInfo, userAddress);
        }
    }));

    return airdrops
}

export async function claimRewards(userAddress, chainId, tokens, tokensData, signer) {
    try {
        const tokenAddresses = tokens;
        let positiveClaimables = [];

        // TODO - Make sure that claim is only done on non-zero tokens
        for (let i = 0; i < tokenAddresses.length; i++) {
            if (Number(tokensData[tokenAddresses[i]].amount) > 0)
                positiveClaimables.push(tokenAddresses[i]);
        }

        if( positiveClaimables.length > 0 ) {
            const contract = new ethers.Contract(
                airdrops[chainId].airdropAddress,
                airdrops[chainId].abi,
                signer
            );
            const resp = await contract.claimMultiple(userAddress, positiveClaimables);
            await resp.wait();
            console.log("Success claiming rewards, txReceipt here");
            return positiveClaimables.length;
        }
        return 0;
    } catch (error) {
      console.log("Error claiming rewards :", error);
      return false;
    }
  }

export async function allocateRewards(airdropInfo, toAddresses, values, tokenAddress, signer) {
    try {
        const contract = new ethers.Contract(
            airdropInfo.airdropAddress,
            airdropInfo.abi,
            signer
        );

        const resp = await contract.allocate(
            toAddresses,
            values,
            tokenAddress
        )
        await resp.wait();

        return true;
    } catch (error) {
        console.log("Error allocating rewards :", error);
        return false;
    }
}
