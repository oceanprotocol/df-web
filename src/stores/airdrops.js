import {writable} from "svelte/store";
import {ethers} from "ethers";
import * as dfRewardsABI from "../utils/abis/DFRewardsABI";
import {getAddressByChainIdKey} from "../utils/address/address";
import { getGasFeeEstimate } from "../utils/web3";
import { prepareWriteContract, readContract, writeContract } from "@wagmi/core";

export let contracts = writable({});
export let rewards = writable();
export let APYs = writable();
export let veEstimate = writable(0);
export let veClaimables = writable(0);
export let dfEstimate = writable(0);
export let dfClaimables = writable(0);

export const getTokenAddress = (chainId, tokenName, airdropsConfig) => {
    if (!chainId || !tokenName) return null;
    try {
        if (airdropsConfig[chainId]) {
            const tokenData = Object.entries(airdropsConfig[chainId].tokensData).filter(([k, v]) => v.symbol === tokenName );
            if( !tokenData || tokenData.length === 0 ) {
                console.log("Can't find tokenName in configuration: ", tokenName);
                return null;
            }
            return tokenData[0][0];
        }
    } catch (err) {
        console.error(err);
    }

    return null;
}

export const getDFRewards = async(userAddress, tokenAddress) => {
    try {
        const estimateClaim = await readContract({
            address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "DFRewards"),
            args: [userAddress, tokenAddress],
            abi: dfRewardsABI.default,
            functionName: 'claimable',
          })
        const estimateClaimFormatted = ethers.utils.formatEther(BigInt(estimateClaim).toString(10));
        return estimateClaimFormatted
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function claimDFReward(userAddress, tokenAddress) {
    try {
        const gasLimit = await getGasFeeEstimate(getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "DFRewards"),dfRewardsABI.default,'claimFor',[userAddress, tokenAddress])
        const config = await prepareWriteContract({
        address: getAddressByChainIdKey(import.meta.env.VITE_VE_SUPPORTED_CHAINID, "DFRewards"),
        args: [userAddress, tokenAddress],
        abi: dfRewardsABI.default,
        functionName: 'claimFor',
        overrides:{
          gasLimit:gasLimit
        }
      })
      const tx = await writeContract(config)
      console.log("Success claiming rewards, txReceipt here", tx);
      return tx;
    } catch (error) {
        console.log("Error claiming rewards :", error);
        throw error;
    }
}
