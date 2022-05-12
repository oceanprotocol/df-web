import {supportedChainIds, getNetworkByChainId} from "../app.config";
import {ethers} from 'ethers';
import * as rinkebyAbi from './rinkebyAbi'
export const airdrops = {
    3: {
        airdropAddress: "0x789ddD01e0362A350e3401b510B759041d7D2c70",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0x01be23585060835e02b77ef475b0cc51aa1e0709"
        ],
        tokensData:{
            0xe6239d757c064c237dF31e08EbdD582f0608aCE0: {
                symbol: 'OCEAN',
                rewards: 0
            },
            0x01be23585060835e02b77ef475b0cc51aa1e0709: {
                symbol: 'PHSD',
                rewards: 0
            }
        },
        abi: rinkebyAbi.default
    },
    4: {
        airdropAddress: "0x70a5ACD28d534B7390e34E16f7c2c6192B7eb5B1",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0x01be23585060835e02b77ef475b0cc51aa1e0709"
        ],
        tokensData:{
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0": {
                symbol: 'OCEAN',
                rewards: 0
            },
            "0x01be23585060835e02b77ef475b0cc51aa1e0709": {
                symbol: 'PHSD',
                rewards: 0
            }
        },
        abi: rinkebyAbi.default
    },
};

export const abis = [
    "function claimable(address _to, address tokenAddress) public view returns (uint256)",
    "function claim(address[] calldata tokenAddresses) external returns (bool)"
]

export const getBalanceFromAirdrop = async (chainId, airdropAddress, tokenAddress, address) => {
    if (!chainId || !airdropAddress || !tokenAddress || !address) return null;
    let balance = null;
    try {
        const network = getNetworkByChainId(chainId);
        if( network !== undefined ) {
            const provider = new ethers.providers.JsonRpcProvider(network.provider);
            // TODO - Initialize contracts only once
            // TODO - Pass in signer to be able to R+W
            const contract = new ethers.Contract(airdropAddress, abi, provider);
            balance = contract.claimable(address, tokenAddress)
            balance = balance > 0 ? ethers.utils.formatEther(balance) : 0
        }
    } catch (err) {
        console.error(err, network, networks);
    }

    return balance;
}

export const getAllBalances = async (address) => {
    if (!address) return [];
    const balances = {};

    for (chainId of supportedChainIds) {
        if( airdrops[chainId] ) {
            const airdrop = airdrops[chainId];
            for (token of airdrop.tokens) {
                const balance = await getBalanceFromAirdrop(chainId, airdrop.airdropAddress, address, token);
                if (!balances[chainId])
                    balances[chainId] = {};

                balances[chainId][token] = balance;
            }
        }
    }

    return balances;
}
