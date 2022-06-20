import { writable } from "svelte/store";
import {getRpcUrlByChainId} from "./web3";
import {ethers} from "ethers";
import * as airdropABI from '../utils/abis/airdropABI';

export const airdropsConfig = {
    3: {
        airdropAddress: "0xEEd8434992b6742275Ac6386c286038fadcDdA9D",
        rewardAddress: "0x7a11195F780DfFda832f95853BBC69A9975eeEdE",
        tokensData:{
            "0x8967BCF84170c91B0d24D4302C2376283b0B3a07": {
                symbol: 'OCEAN',
                amount: 0
            }
        },
        totalRewards: 0,
        abi: airdropABI.default
    },
    4: {
        airdropAddress: "0x8EF47a82beBBCb4A95E3AABae76F0c1F0F1b63c1",
        rewardAddress: "0x7AC282A7Dc7a64D0F355B2f4CFc535C4c488BF12",
        tokensData:{
            "0x5e8DCB2AfA23844bcc311B00Ad1A0C30025aADE9": {
                symbol: 'OCEAN',
                amount: 0
            }
        },
        totalRewards: 0,
        abi: airdropABI.default
    },
    80001: {
        airdropAddress: "0xceaE92012f766F49A9Ed05132B8D77142308ed89",
        rewardAddress: "0xEEd8434992b6742275Ac6386c286038fadcDdA9D",
        tokensData:{
            "0xd8992Ed72C445c35Cb4A2be468568Ed1079357c8": {
                symbol: 'OCEAN',
                amount: 0
            }
        },
        totalRewards: 0,
        abi: airdropABI.default
    },
    1287: {
        airdropAddress: "0x4614dfCfcEB30Bc8f5408b005F07A47619f666F4",
        rewardAddress: "0x0cea7da0883C26BFb6B80B65e38d9577c1AD0909",
        tokensData:{
            "0xF6410bf5d773C7a41ebFf972f38e7463FA242477": {
                symbol: 'OCEAN',
                amount: 0
            }
        },
        totalRewards: 0,
        abi: airdropABI.default
    }
};

export let contracts = writable({});
export let airdrops = writable(airdropsConfig);

export const getTokenAddress = (chainId, tokenName) => {
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

    try {
        const rpcURL = getRpcUrlByChainId(chainId);
        if( rpcURL ) {
            const provider = new ethers.providers.JsonRpcProvider(rpcURL);
            const contract = new ethers.Contract(airdropData[chainId].airdropAddress, airdropData[chainId].abi, provider);
            const tokens = Object.keys(airdropData[chainId].tokensData)
            const claimableRewards = await contract.claimables(address, tokens)
            for (let i = 0; i < claimableRewards.length; i++) {
                const rewardInEthers = ethers.utils.formatEther(BigInt(claimableRewards[i]).toString(10))
                airdropData[chainId].tokensData[tokens[i]].amount = rewardInEthers > 0.0 ? rewardInEthers : 0.0
                airdropData[chainId].totalRewards += rewardInEthers > 0.0 ? 1 : 0
            }
        }
    } catch (err) {
        console.error(err);
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
                airdropData[chainId].abi,
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
