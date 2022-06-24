import { writable } from "svelte/store";
import {getRpcUrlByChainId} from "../utils/web3";
import {ethers} from "ethers";
import * as airdropABI from "../utils/abis/airdropABI";

export let contracts = writable({});
export let airdrops = writable({});

export const getTokenAddress = (chainId, tokenName, airdropsConfig) => {
    if (!chainId || !tokenName) return null;
    try {
        if (airdropsConfig[chainId]) {
            const tokenData = Object.entries(airdropsConfig[chainId].tokensData).filter(([k, v]) => v.symbol === tokenName );
            if( !tokenData || tokenData.length === 0 ) {
                console.log("Can't find tokenName in configuration: ", tokenName);
                return null;
            }
            return tokenData[0][0];
        }
    } catch (err) {
        console.error(err);
    }

    return null;
}

export const updateClaimablesFromAirdrop = async (airdropData, chainId, address) => {
    if (!chainId || !address) return null;
    let tokens
    try {
        const rpcURL = await getRpcUrlByChainId(chainId);
        if( rpcURL ) {
            tokens = Object.keys(airdropData[chainId].tokensData)
            const provider = new ethers.providers.JsonRpcProvider(rpcURL);
            const contract = new ethers.Contract(airdropData[chainId].airdropAddress, airdropABI.default, provider);
            const claimableRewards = await contract.claimables(address, tokens)
            for (let i = 0; i < claimableRewards.length; i++) {
                const rewardInEthers = ethers.utils.formatEther(BigInt(claimableRewards[i]).toString(10))
                airdropData[chainId].tokensData[tokens[i]].amount = rewardInEthers > 0.0 ? rewardInEthers : 0.0
                airdropData[chainId].totalRewards = parseInt(airdropData[chainId].totalRewards)
                airdropData[chainId].totalRewards += rewardInEthers > 0.0 ? 1 : 0
            }
        }
    } catch (err) {
        for (let i = 0; i < tokens.length; i++) {
            airdropData[chainId].tokensData[tokens[i]].amount = 0.0
        }
    }
}

export const updateAllClaimables = async (airdropData, selectedNetworks, userAddress) => {
    const filteredChains = JSON.parse(process.env.SUPPORTED_CHAIN_IDS).filter(x => selectedNetworks.indexOf(x) >= 0);
    await Promise.all(filteredChains.map(async function(chainId) {
        if( airdropData[chainId] ) {
            await updateClaimablesFromAirdrop(airdropData, chainId, userAddress);
        } else {
            console.log("Airdrop configuration is not proprely initialized. Please check .supportedChainIds and app configuration.")
        }
    }));

    airdrops.set(airdropData);
}

export async function claimRewards(airdropData, chainId, tokensData, userAddress, signer) {
    try {
        const tokenAddresses = Object.keys(tokensData);
        let positiveClaimables = [];
        // TODO - Make sure that claim is only done on non-zero tokens
        for (let i = 0; i < tokenAddresses.length; i++) {
            if (Number(tokensData[tokenAddresses[i]].amount) > 0)
                positiveClaimables.push(tokenAddresses[i]);
        }

        if( positiveClaimables.length > 0 ) {
            const contract = new ethers.Contract(
                airdropData[chainId].airdropAddress,
                airdropABI.default,
                signer
            );
            const resp = await contract.claimMultiple(userAddress, positiveClaimables);
            await resp.wait();
            console.log("Success claiming rewards, txReceipt here");
            return positiveClaimables.length;
        }
        return 0;
    } catch (error) {
        console.log("Error claiming rewards :", error);
        return false;
    }
}
