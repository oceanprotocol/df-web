import { ethers } from "ethers";
import { gql } from "apollo-boost";
import * as VeDelegationABI from "./abis/veDelegationABI";
import {
  prepareWriteContract,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { getAddressByChainIdKey } from "../utils/address/address";
import moment from "moment";
import { getGasFeeEstimate } from "./web3.js";

const veDelegationABI = VeDelegationABI.default;

export const GET_USER_LAST_DELEGATION = gql`
  query userDelegation($userAddress: String!) {
    veDelegations(where: { delegator_contains: $userAddress }) {
      id
      receiver {
        id
      }
      tokenId
      expireTime
      updates(orderBy: timestamp, orderDirection: desc) {
        timestamp
        sender
        amount
        type
      }
    }
  }
`;

export const getUserVotingPowerWithDelegations = async (userAddress) => {
  try {
    const balanceWithDelegations = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      args: [userAddress],
      abi: veDelegationABI,
      functionName: "adjusted_balance_of",
    });
    const balanceWithDelegationsFormatted = ethers.utils.formatEther(
      BigInt(balanceWithDelegations).toString(10)
    );
    return balanceWithDelegationsFormatted;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDelegatedVeOcean = async (userAddress) => {
  try {
    const delegated = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      args: [userAddress],
      abi: veDelegationABI,
      functionName: "delegated_boost",
    });
    const delegatedFormated = ethers.utils.formatEther(
      BigInt(delegated).toString(10)
    );
    return delegatedFormated;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDelegatedExpiry = async (tokenId) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      veDelegationABI
    );
    const delegationExpiry = await contract.token_expiry(tokenId);
    return moment(delegationExpiry);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getReceivedDelegation = async (userAddress) => {
  try {
    const received = await readContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      args: [userAddress],
      abi: veDelegationABI,
      functionName: "received_boost",
    });
    const receivedFormated = ethers.utils.formatEther(
      BigInt(received).toString(10)
    );
    return receivedFormated;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTokenId = async (userAddress, id) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      veDelegationABI
    );
    const tokenId = await contract.get_token_id(userAddress, id);
    return tokenId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const delegate = async (delegator, receiver, oceanUnlockDate, id) => {
  try {
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      veDelegationABI,
      "create_boost",
      [delegator, receiver, 10000, moment().unix(), oceanUnlockDate.unix(), id]
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      args: [
        delegator,
        receiver,
        10000,
        moment().unix(),
        oceanUnlockDate.unix(),
        id,
      ],
      abi: veDelegationABI,
      functionName: "create_boost",
      gas: gasLimit,
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
    return id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeDelegation = async (tokenId) => {
  try {
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      veDelegationABI,
      "burn",
      [tokenId]
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      args: [tokenId],
      abi: veDelegationABI,
      functionName: "burn",
      gas: gasLimit,
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
    return resp;
  } catch (error) {
    throw error;
  }
};

export const cancelDelegation = async (tokenId) => {
  try {
    const gasLimit = await getGasFeeEstimate(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      veDelegationABI,
      "cancel_boost",
      [tokenId]
    );
    const { request } = await prepareWriteContract({
      address: getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      args: [tokenId],
      abi: veDelegationABI,
      functionName: "cancel_boost",
      gas: gasLimit,
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
    return resp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
