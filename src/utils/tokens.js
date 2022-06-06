import { Decimal } from 'decimal.js';
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

// export const allowance = async (datatokenAddress, owner, spender) => {
//   try {
//     const datatoken = new ethers.Contract(datatokenAddress, tokenABI,{from: spender});
//     const trxReceipt = await datatoken.methods.allowance(owner, spender).call();
//     return ethers.utils.formatEther(trxReceipt);
//   } catch (e) {
//     console.log(e);
//   }
// }
//
// export const approve = async (datatokenAdress, spender, amount, address) => {
//   const datatoken = new ethers.Contract(datatokenAdress, tokenABI, {
//     from: address
//   });
//
//   const gasLimitDefault = GASLIMIT_DEFAULT
//   let estGas
//   try {
//     estGas = await datatoken.methods
//         .approve(spender, ethers.utils.parseEther(amount.toString()))
//         .estimateGas({ from: address }, (err, estGas) => (err ? gasLimitDefault : estGas))
//   } catch (e) {
//     estGas = gasLimitDefault
//   }
//   const trxReceipt = await datatoken.methods
//       .approve(spender, ethers.utils.parseEther(amount.toString()))
//       .send({
//         from: address,
//         gas: estGas + 1,
//         gasPrice: await getFairGasPrice()
//       })
//   return trxReceipt
// }

// Getter/View
export const allowance = async (
  datatokenAdress,
  owner,
  spender,
  signer
) => {
  const datatoken = new ethers.Contract(datatokenAdress, tokenABI, signer);

  console.log("signer: ", signer);
  console.log("datatoken datatokenAdress: ", datatokenAdress);
  console.log("datatoken contract: ", datatoken);

  return datatoken.allowance(owner, spender);
}

// Tx
// what: helper function to approve a certain tx, returns approval amount
// returns: float approvalAmount
export const approve = async (
  account,
  datatokenAddress,
  spender, //bpool is spender
  amount,
  signer,
  force = false
) => {
  const datatoken = new ethers.Contract(datatokenAddress, tokenABI, signer);

  console.log("BPapprove account: ", account);
  console.log("BPapprove spender: ", spender);
  console.log("BPapprove amount: ", amount);
  console.log("BPapprove signer: ", signer);
  console.log("BPapprove datatoken datatokenAdress: ", datatokenAddress);
  console.log("BPapprove datatoken contract: ", datatoken);

  if (!force) {
      const result = await allowance(datatokenAddress, account, spender, signer)
      console.log("allowance result: ", result);
      const allowanceEthers = ethers.utils.formatEther(result);
      if ( new Decimal(allowanceEthers).greaterThanOrEqualTo(amount) ) {
          console.log("Allowance > amount, use allowance. Allowance is: ", allowanceEthers);
          amount = allowanceEthers;
      }
  }
  const gasLimitDefault = GASLIMIT_DEFAULT
  let estGas
  console.log("Spender is: ", spender);
  try {
    console.log("Esimated gas for allowance of amount: ", amount);
    estGas = await datatoken.estimateGas.approve(spender, ethers.utils.parseEther(amount.toString()))
    console.log("Esimated gas is: ", estGas);
  } catch (e) {
      estGas = gasLimitDefault
  }

  try {
      // TODO - Override gas price & limit
      // let gasPrice = getFairGasPrice();
      const tx = await datatoken.approve(
          spender,
          ethers.utils.parseEther(amount.toString()));
      return tx;
  } catch (e) {
      console.log(`ERRPR: Failed to approve spender to spend tokens : ${e.message}`)
  }
  return null;
}
