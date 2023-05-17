import {ethers} from "ethers";
import {get} from "svelte/store"
import {gql} from "apollo-boost";
import * as VeDelegationABI from "./abis/veDelegationABI";
import {networkSigner} from "../stores/web3";
import {getAddressByChainIdKey} from "../utils/address/address";
import moment from "moment";

const veDelegationABI = VeDelegationABI.default

export const GET_USER_LAST_DELEGATION = gql`
  query userDelegation($userAddress: String!) {
    veDelegations(where: {delegator_contains: "0x6f356fccac3b56d9d772d7dc2e23062475d9279d" } )
       {
        id
        receiver {
          id
        }
        tokenId
        updates(orderBy:timestamp orderDirection:desc){
          timestamp
          sender
          amount
          type
        }
      }
    }
`;

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

export const getTokenId = async(userAddress, id) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI, 
      get(networkSigner)
    );
    const tokenId = await contract.get_token_id(userAddress, id)
    return tokenId
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const delegate = async(delegator, receiver, oceanUnlockDate, signer, tokenId) => {
  const id = tokenId ? tokenId : 1
  try {
    console.log('herrre')
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI, 
       signer
    );
    const calcGasLimit = await contract.estimateGas.create_boost(delegator, receiver, 10000, moment().unix(), oceanUnlockDate.unix(), id)
    const resp = await contract.create_boost(delegator, receiver, 10000, moment().unix(), oceanUnlockDate.unix(), id, {gasLimit:BigInt(calcGasLimit) + BigInt(10000)})
    await resp.wait()
    return id
  } catch (error) {
    console.log(error)
    throw error;
  }
  }

  export const removeDelegation = async(tokenId, signer) => {
    try {
      const contract = new ethers.Contract(
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
        veDelegationABI, 
         signer
      );
      const calcGasLimit = await contract.estimateGas.burn(tokenId)
      const resp = await contract.burn(tokenId, {gasLimit:BigInt(calcGasLimit) + BigInt(10000)})
      await resp.wait()
      return resp
    } catch (error) {
      throw error;
    }
  }

  export const cancelDelegation = async(tokenId, signer) => {
    try {
      const contract = new ethers.Contract(
        getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
        veDelegationABI, 
         signer
      );
      const calcGasLimit = await contract.estimateGas.cancel_boost(tokenId)
      const resp = await contract.cancel_boost(tokenId, {gasLimit:BigInt(calcGasLimit) + BigInt(10000)})
      await resp.wait()
      return resp
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
