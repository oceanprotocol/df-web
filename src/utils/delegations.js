import { ethers } from "ethers";
import { get } from "svelte/store";
import { gql } from "apollo-boost";
import * as VeDelegationABI from "./abis/veDelegationABI";
import { readContract } from "@wagmi/core";
import { getAddressByChainIdKey } from "../utils/address/address";
import moment from "moment";

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
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI
    );
    const delegated = await contract.delegated_boost(userAddress);
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
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
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
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI
    );
    const received = await contract.received_boost(userAddress);
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
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI
    );
    const tokenId = await contract.get_token_id(userAddress, id);
    return tokenId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const delegate = async (
  delegator,
  receiver,
  oceanUnlockDate,
  signer,
  id
) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI,
      signer
    );
    const calcGasLimit = await contract.estimateGas.create_boost(
      delegator,
      receiver,
      10000,
      moment().unix(),
      oceanUnlockDate.unix(),
      id
    );
    const resp = await contract.create_boost(
      delegator,
      receiver,
      10000,
      moment().unix(),
      oceanUnlockDate.unix(),
      id,
      { gasLimit: BigInt(calcGasLimit) + BigInt(10000) }
    );
    await resp.wait();
    return id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeDelegation = async (tokenId, signer) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(
        import.meta.env.VITE_VE_SUPPORTED_CHAINID,
        "veDelegation"
      ),
      veDelegationABI,
      signer
    );
    const calcGasLimit = await contract.estimateGas.burn(tokenId);
    const resp = await contract.burn(tokenId, {
      gasLimit: BigInt(calcGasLimit) + BigInt(10000),
    });
    await resp.wait();
    return resp;
  } catch (error) {
    throw error;
  }
};

export const cancelDelegation = async (tokenId, signer) => {
  try {
    const contract = new ethers.Contract(
      getAddressByChainIdKey(process.env.VE_SUPPORTED_CHAINID, "veDelegation"),
      veDelegationABI,
      signer
    );
    const calcGasLimit = await contract.estimateGas.cancel_boost(tokenId);
    const resp = await contract.cancel_boost(tokenId, {
      gasLimit: BigInt(calcGasLimit) + BigInt(10000),
    });
    await resp.wait();
    return resp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
