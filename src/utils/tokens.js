import { Decimal } from 'decimal.js';
import { ethers } from "ethers";
import { getRpcUrlByChainId, GASLIMIT_DEFAULT } from "./web3";
import * as TokenABI from "./abis/tokenABI";

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

    return balance;
  } catch(err) {
    console.error(err);
  }
}

export const isTokenAmountApproved = async (tokenAddress, amount,
  owner,
  spender,signer)=>{
    if(amount <= 0) {
      return false;
    }
    try {
    const allowedAmount = await allowance(tokenAddress, owner, spender, signer)
    return new Decimal(allowedAmount).greaterThanOrEqualTo(amount)
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
  const datatoken = new ethers.Contract(datatokenAdress, TokenABI.default, signer);
  const amt = await datatoken.allowance(owner, spender)
  return ethers.utils.formatEther(amt);
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
  const datatoken = new ethers.Contract(datatokenAddress, TokenABI.default, signer);
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
