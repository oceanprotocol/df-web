import { ethers } from "ethers";
import { web3, getJsonRpcProvider, getRpcUrlByChainId } from "./web3";
import * as TokenABI from "./abis/tokenABI";

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
