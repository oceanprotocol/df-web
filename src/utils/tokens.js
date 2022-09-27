import { Decimal } from 'decimal.js';
import { ethers } from "ethers";
import { getRpcUrlByChainId, GASLIMIT_DEFAULT } from "./web3";
import * as TokenABI from "./abis/tokenABI";

const tokenABI = TokenABI.default

const oceanTokenAddressesByChain = {
  1: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
  4: "0x8967BCF84170c91B0d24D4302C2376283b0B3a07",
  8996: "0x067008a4045f7CF6222291D85cb143e35acA2f40"
}


export const getOceanTokenAddressByChainId = (chainId) => {
  return oceanTokenAddressesByChain[chainId]
}

//TODO - Standardize function calls & Params to follow ocean.js
export const getTokenContract = async (chainId, address, signer) => {
  try {
    const rpcURL = await getRpcUrlByChainId(chainId);
    if( rpcURL ) {
      return new ethers.Contract(address, TokenABI.default, signer);
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

//TODO - Standardize function calls & Params to follow ocean.js
export const balanceOf = async (balances, chainId, tokenAddress, account, provider) => {
  let balance
  try {
    if (balances[tokenAddress] === undefined) {
      balances[tokenAddress] = {};
    }
    const tokenContract = await getTokenContract(chainId, tokenAddress, provider);
    balance = await tokenContract.balanceOf(account);
    return balance
  } catch(err) {
    console.error(err);
  }
}

export const isTokenAmountApproved = async (tokenAddress, amount,
  owner,
  spender,signer)=>{
    if(!amount) return true
    try {
    const allowedAmount = await allowance(tokenAddress, owner, spender, signer)
    const allowedAmountFormated = ethers.utils.formatEther(allowedAmount);
    return new Decimal(allowedAmountFormated).greaterThanOrEqualTo(amount)
  }catch (err) {
    console.error(err);
  }


}

// Getter/View
export const allowance = async (
  datatokenAdress,
  owner,
  spender,
  signer
) => {
  const datatoken = new ethers.Contract(datatokenAdress, tokenABI, signer);

  return datatoken.allowance(owner, spender);
}

// Tx
// what: helper function to approve a certain tx, returns approval amount
// returns: float approvalAmount
export const approve = async (
  datatokenAddress,
  spender, //bpool is spender
  amount,
  signer,
  force = false
) => {
  const datatoken = new ethers.Contract(datatokenAddress, tokenABI, signer);
  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  try {
    estGas = await datatoken.estimateGas.approve(spender, ethers.utils.parseEther(amount.toString()))
    console.log("Esimated gas is: ", estGas);
  } catch (e) {
      estGas = gasLimitDefault
  }
  try {
      // TODO - Override gas price & limit
      // let gasPrice = getFairGasPrice();
      const tx = await datatoken.approve(spender,ethers.utils.parseEther(amount.toString()));
      return tx;
  } catch (e) {
      console.log(`ERRPR: Failed to approve spender to spend tokens : ${e.message}`)
      throw e;
  }
}
