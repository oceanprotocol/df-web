import * as TokenABI from "./abis/tokenABI";

import {
  GASLIMIT_DEFAULT,
  getGasFeeEstimate,
  getRpcUrlByChainId,
} from "./web3";
import {
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";

import { Decimal } from "decimal.js";
import { ethers } from "ethers";

//TODO - Standardize function calls & Params to follow ocean.js
export const getTokenContract = async (chainId, address, signer) => {
  try {
    const rpcURL = await getRpcUrlByChainId(chainId);
    if (rpcURL) {
      return new ethers.Contract(address, TokenABI.default, signer);
    }
  } catch (err) {
    console.error(err);
  }
  return null;
};

//TODO - Standardize function calls & Params to follow ocean.js
export const balanceOf = async (balances, tokenAddress, account) => {
  try {
    if (balances[tokenAddress] === undefined) {
      balances[tokenAddress] = {};
    }
    const balance = await readContract({
      address: tokenAddress,
      args: [account],
      abi: TokenABI.default,
      functionName: "balanceOf",
    });
    return balance;
  } catch (err) {
    console.error(err);
  }
};

export const isTokenAmountApproved = async (
  tokenAddress,
  amount,
  owner,
  spender
) => {
  if (amount <= 0) {
    return false;
  }
  try {
    const allowedAmount = await allowance(tokenAddress, owner, spender);
    const allowedAmountFormated = ethers.utils.formatEther(allowedAmount);

    return new Decimal(allowedAmountFormated).greaterThanOrEqualTo(amount);
  } catch (err) {
    console.error(err);
  }
};

// Getter/View
export const allowance = async (datatokenAdress, owner, spender) => {
  const datatoken = await readContract({
    address: datatokenAdress,
    args: [owner, spender],
    abi: TokenABI.default,
    functionName: "allowance",
  });
  return datatoken;
};

// Tx
// what: helper function to approve a certain tx, returns approval amount
// returns: float approvalAmount
export const approve = async (
  datatokenAddress,
  spender, //bpool is spender
  amount
) => {
  try {
    // TODO - Override gas price & limit
    // let gasPrice = getFairGasPrice();
    const gasLimit = await getGasFeeEstimate(
      datatokenAddress,
      TokenABI.default,
      "approve",
      [spender, ethers.utils.parseEther(amount.toString())]
    );
    const { request } = await prepareWriteContract({
      address: datatokenAddress,
      args: [spender, ethers.utils.parseEther(amount.toString())],
      abi: TokenABI.default,
      functionName: "approve",
      overrides: {
        gasLimit: gasLimit,
      },
    });
    const { hash } = await writeContract(request);
    const resp = await waitForTransaction({ hash });
    return resp;
  } catch (e) {
    console.log(
      `ERRPR: Failed to approve spender to spend tokens : ${e.message}`
    );
    throw e;
  }
};

export const getTokenPriceFromCoingecko = async (token, currency) => {
  if (token === "ethereum" && currency === "usd") return 2059.45;

  if (token === "ocean-protocol" && currency === "usd") return 0.4341;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=${currency}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data[token][currency];
  } catch (e) {
    console.error(e);
    return null;
  }
};
