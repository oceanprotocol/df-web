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

export const setupAppConfig = () => {
    if(import.meta.env.VITE_NODE_ENV == 'production'){
        SUPPORTED_CHAIN_IDS = "[1]"
        BACKEND_API = "https://df-sql.oceandao.org"
        SUBGRAPH_API = "https://v4.subgraph.mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
        SUPPORTED_CHAINID = 1
    }else{
        SUPPORTED_CHAIN_IDS = "[5]"
        BACKEND_API = "https://test-df-sql.oceandao.org"
        SUBGRAPH_API = "https://v4.subgraph.goerli.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
        VE_SUPPORTED_CHAINID = 5
        DEBUGGING = "enabled"
    }
}
