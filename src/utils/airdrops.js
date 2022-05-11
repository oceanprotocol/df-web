import {supportedChainIds, getNetworkByChainId} from "../app.config";
const ethers = require("ethers");
require("dotenv").config();

export const airdrops = {
    3: {
        airdropAddress: "0x789ddD01e0362A350e3401b510B759041d7D2c70",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0x8127479a825EA352B542F41ea513Ff207e363421"
        ]
    },
    4: {
        airdropAddress: "0x9C862055A084E802F3Bc6Cf38862C3B9eb1e8879",
        tokens: [
            "0xe6239d757c064c237dF31e08EbdD582f0608aCE0",
            "0x8127479a825EA352B542F41ea513Ff207e363421"
        ]
    },
};

export const abi = [
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
