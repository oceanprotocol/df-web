import {ethers} from "ethers";
import {get} from "svelte/store"
import * as VeDelegationABI from "./abis/veDelegationABI";
import {networkSigner} from "../stores/web3";
import {getAddressByChainIdKey} from "../utils/address/address";

const veDelegationABI = VeDelegationABI.default

export const getUserVotingPowerWithDelegations = async(userAddress) => {
    try {
      const contract = new ethers.Contract(
        getAddressByChainIdKey(process.env.CHAIN_ID, "veDelegation"),
        veDelegationABI, 
        get(networkSigner)
      );
      const balanceWithDelegations = await contract.adjusted_balance_of(userAddress)
      const balanceWithDelegationsFormatted = ethers.utils.formatEther(BigInt(balanceWithDelegations).toString(10))
      return balanceWithDelegationsFormatted
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const delegate = async(delegator, receiver, percentage, cancelTime, expireTime, id, signer) => {
    try {
      const contract = new ethers.Contract(
        getAddressByChainIdKey(process.env.CHAIN_ID, "veDelegation"),
        veDelegationABI, 
        signer
      );
      const resp = await contract.create_boost(delegator, receiver, percentage, cancelTime, expireTime, id)
      return resp
  } catch (error) {
    console.log(error)
    throw error;
  }
  }
