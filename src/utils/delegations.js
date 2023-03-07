import {ethers} from "ethers";
import {get} from "svelte/store"
import * as VeDelegationABI from "./abis/veDelegationABI";
import {networkSigner} from "../stores/web3";
import {getAddressByChainIdKey} from "../utils/address/address";
import moment from "moment";

const veDelegationABI = VeDelegationABI.default

export const getUserVotingPowerWithDelegations = async(userAddress) => {
    try {
      const contract = new ethers.Contract(
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
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

export const getDelegatedVeOcean = async(userAddress) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI, 
      get(networkSigner)
    );
    const delegated = await contract.delegated_boost(userAddress)
    const delegatedFormated = ethers.utils.formatEther(BigInt(delegated).toString(10))
    return delegatedFormated
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getDelegatedExpiry = async(tokenId) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI, 
      get(networkSigner)
    );
    const delegationExpiry = await contract.token_expiry(tokenId)
    return moment(delegationExpiry)
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getReceivedDelegation = async(userAddress) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI, 
      get(networkSigner)
    );
    const received = await contract.received_boost(userAddress)
    const receivedFormated = ethers.utils.formatEther(BigInt(received).toString(10))
    return receivedFormated
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getTokenId = async(userAddress) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI, 
      get(networkSigner)
    );
    const tokenId = await contract.get_token_id(userAddress,1)
    console.log(tokenId)
    return tokenId
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const delegate = async(delegator, receiver, oceanUnlockDate, signer) => {
  const id = Math.floor(Math.random() * 10000)
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI, 
       signer
    );
    const calcGasLimit = await contract.estimateGas.create_boost(delegator, receiver, 100, moment().unix(), oceanUnlockDate.unix(), id)
    const resp = await contract.create_boost(delegator, receiver, 10000, moment().unix(), oceanUnlockDate.unix(), id, {gasLimit:BigInt(calcGasLimit) + BigInt(10000)})
    return resp
  } catch (error) {
    console.log(error)
    throw error;
  }
  }
