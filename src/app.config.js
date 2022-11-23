import networks from "./networks-metadata.json"

export const getNetworkByChainId = async (chainId) => {
    if (!chainId) return false;
    for (const network of networks) {
        try {
            const networkChainId = network.chainId
            if( chainId === networkChainId ) {
                return network;
            }
        } catch (err) {
            console.error(err, network, networks);
        }
    }
    return null;
};

export const setupAppConfig = async() => {
    if(process.env.NODE_ENV === 'production'){
        process.env.SUPPORTED_CHAIN_IDS = "[1]"
        process.env.BACKEND_API = "https://df-sql.oceandao.org"
        process.env.SUBGRAPH_API = "https://v4.subgraph.mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
        process.env.VE_SUPPORTED_CHAINID = 1
    }else{
        process.env.SUPPORTED_CHAIN_IDS = "[5]"
        process.env.BACKEND_API = "https://test-df-sql.oceandao.org"
        process.env.SUBGRAPH_API = "https://v4.subgraph.goerli.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
        process.env.VE_SUPPORTED_CHAINID = 5
        process.env.DEBUGGING = "enabled"
    }
}
