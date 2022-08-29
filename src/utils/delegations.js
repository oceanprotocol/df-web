import {ethers} from "ethers";
import {getRpcUrlByChainId} from "./web3";
import * as VeDelegationABI from "./abis/veDelegationABI";

const veDelegationABI = VeDelegationABI.default

export const getUserVotingPowerWithDelegations = async(userAddress) => {
    const rpcURL = await getRpcUrlByChainId(process.env.VE_SUPPORTED_CHAINID);
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcURL);
      const contract = new ethers.Contract(process.env.VE_DELEGATION_CONTRACT, veDelegationABI, provider);
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
      const contract = new ethers.Contract(process.env.VE_DELEGATION_CONTRACT, veDelegationABI, signer);
      console.log(contract)
      const resp = await contract.create_boost(delegator, receiver, percentage, cancelTime, expireTime, id)
      return resp
  } catch (error) {
    console.log(error)
    throw error;
  }
  }