import { ethers } from "ethers";
import { getJsonRpcProvider, getRpcUrlByChainId, GASLIMIT_DEFAULT } from "./web3";
import * as TokenABI from "./abis/tokenABI";

const tokenABI = TokenABI.default

//TODO - Standardize function calls & Params to follow ocean.js
export const getTokenContract = async (chainId, address) => {
  try {
    const rpcURL = getRpcUrlByChainId(chainId);
    if( rpcURL ) {
      const provider = new ethers.providers.JsonRpcProvider(rpcURL);
      return new ethers.Contract(address, TokenABI.default, provider);
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

//TODO - Standardize function calls & Params to follow ocean.js
export const balanceOf = async (balances, chainId, tokenAddress, account) => {
  try {
    const tokenContract = await getTokenContract(chainId, tokenAddress);
    if (balances[chainId] === undefined) {
      balances[chainId] = {};
    }
    return await tokenContract.balanceOf(account);
  } catch(err) {
    console.error(err);
  }
}

//TODO - Standardize function calls & Params to follow ocean.js
export const approveToken = async (tokenAddress, spender, amount, signer) => {
  try {
    const contract = new ethers.Contract(
        tokenAddress,
        TokenABI.default,
        signer
    );

    if( contract ) {
      const tx = await contract.approve(spender, ethers.utils.parseEther(amount.toString()))
      tx.wait()
    }
  } catch (err) {
    console.error(err);
  }
}

export const allowance = async (datatokenAddress, owner, spender) => {
  try {
    const datatoken = new web3.eth.Contract(tokenABI, datatokenAddress, {from: spender});
    const trxReceipt = await datatoken.methods.allowance(owner, spender).call();
    return web3.utils.fromWei(trxReceipt);
  } catch (e) {
    console.log(e);
  }
}

export const approve = async (datatokenAdress, spender, amount, address) => {
  const datatoken = new web3.eth.Contract(tokenABI, datatokenAdress, {
    from: address
  });

  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  try {
    estGas = await datatoken.methods
        .approve(spender, web3.utils.toWei(amount))
        .estimateGas({ from: address }, (err, estGas) => (err ? gasLimitDefault : estGas))
  } catch (e) {
    estGas = gasLimitDefault
  }
  const trxReceipt = await datatoken.methods
      .approve(spender, web3.utils.toWei(amount))
      .send({
        from: address,
        gas: estGas + 1,
        gasPrice: await getFairGasPrice()
      })
  return trxReceipt
}

export const BPallowance = async (
  datatokenAdress,
  owner,
  spender,
  signer
) => {
  const datatoken = new ethers.Contract(datatokenAdress, tokenABI, signer);

  const trxReceipt = await datatoken.allowance(owner, spender)
  return ethers.utils.formatEther(trxReceipt)
}

export const BPapprove = async (
  account,
  datatokenAddress,
  spender, //bpool is spender
  amount,
  force = false,
  signer
) => {
  const datatoken = new ethers.Contract(datatokenAddress, tokenABI, signer);

  if (!force) {
      const currentAllowence = await BPallowance(datatokenAddress, account, spender)
      if (
          new Decimal(ethers.utils.toWei(currentAllowence)).greaterThanOrEqualTo(amount)
      ) {
          return currentAllowence
      }
  }
  let result = null
  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  console.log(spender)
  try {
      estGas = await datatoken.approve(spender, amount)
  
  } catch (e) {
      estGas = gasLimitDefault
  }

  try {
      result = await datatoken.approve(spender, amount)
      
  } catch (e) {
      console.log(`ERRPR: Failed to approve spender to spend tokens : ${e.message}`)
  }
  return result
}
