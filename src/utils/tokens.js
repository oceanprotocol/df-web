import * as TokenABI from "./abis/tokenABI";

import { getRpcUrlByChainId, getGasFeeEstimate } from "./web3";
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
  try {
    const datatoken = await readContract({
      address: datatokenAdress,
      args: [owner, spender],
      abi: TokenABI.default,
      functionName: "allowance",
    });
    return datatoken;
  } catch (err) {
    console.error("allowance: Error reading contract", err);
    // Return 0 on error to allow the app to continue
    return BigInt(0);
  }
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
    if (!datatokenAddress || !spender) {
      throw new Error("Token address and spender address are required");
    }

    const parsedAmount = ethers.utils.parseEther(amount.toString());

    // TODO - Override gas price & limit
    // let gasPrice = getFairGasPrice();
    const gasLimit = await getGasFeeEstimate(
      datatokenAddress,
      TokenABI.default,
      "approve",
      [spender, parsedAmount]
    );

    // Check if wagmi has an active connector
    try {
      const { getAccount } = await import("@wagmi/core");
      const account = getAccount();

      if (account.connector) {
        // Use wagmi if connector is available
        const { request } = await prepareWriteContract({
          address: datatokenAddress,
          args: [spender, parsedAmount],
          abi: TokenABI.default,
          functionName: "approve",
          overrides: {
            gasLimit: gasLimit,
          },
        });
        const { hash } = await writeContract(request);
        const resp = await waitForTransaction({ hash });
        return resp;
      }
    } catch (wagmiError) {
      console.warn("Wagmi approve failed, falling back to ethers:", wagmiError);
    }

    // Fallback: Use ethers.js directly for injected wallets
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        datatokenAddress,
        TokenABI.default,
        signer
      );

      const tx = await contract.approve(spender, parsedAmount, {
        gasLimit: gasLimit,
      });

      const resp = await tx.wait();
      return resp;
    } else {
      throw new Error(
        "No wallet provider found. Please install MetaMask or another wallet extension."
      );
    }
  } catch (e) {
    console.log(
      `ERRPR: Failed to approve spender to spend tokens : ${e.message}`
    );
    throw e;
  }
};

export const getTokenPriceFromCoingecko = async (token, currency) => {
  try {
    const res = await fetch(
      `https://price-data.predictoor.ai/api/v3/ticker/price?symbol=${token}${currency}`
    );
    const data = await res.json();
    return parseFloat(data.price);
  } catch (e) {
    console.error(e);
    return null;
  }
};
