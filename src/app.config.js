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
    switch(process.env.NODE_ENV){
        case "production":
            console.log("NODE_ENV has been set to production")
            process.env.SUPPORTED_CHAIN_IDS = "[1]"
            process.env.BACKEND_API = "https://df-sql.oceandao.org"
            process.env.SUBGRAPH_API = "https://v4.subgraph.mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
            process.env.VE_SUPPORTED_CHAINID = 1
            break
        case "staging":
            console.log("NODE_ENV has been set to staging")
            process.env.SUPPORTED_CHAIN_IDS = "[5]"
            process.env.BACKEND_API = "https://test-df-sql.oceandao.org"
            process.env.SUBGRAPH_API = "https://v4.subgraph.goerli.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
            process.env.VE_SUPPORTED_CHAINID = 5
            process.env.DEBUGGING = "enabled"
            break
        case "development":
            console.log("NODE_ENV has been set to development")
            process.env.SUPPORTED_CHAIN_IDS = "[8996]"
            process.env.BACKEND_API = "https://test-df-sql.oceandao.org"
            process.env.SUBGRAPH_API = "https://v4.subgraph.goerli.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
            process.env.VE_SUPPORTED_CHAINID = 8996
            process.env.DEBUGGING = "enabled"
            break
        default:
            console.log("NODE_ENV environment variable not set")
    }
}
