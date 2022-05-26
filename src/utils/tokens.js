import {ethers} from 'ethers';
import {getRpcUrlByChainId} from "./web3";
import * as TokenAbi from './abis/tokenABI'

export async function getTokenContract(chainId, address) {
    const provider = getRpcUrlByChainId(chainId);
    return new ethers.Contract(address, TokenAbi.default, provider);
}

export async function balanceOf(chainId, tokenAddress, account) {
    const tokenContract = getTokenContract(chainId, tokenAddress);
    return tokenContract.balanceOf(account);
}
