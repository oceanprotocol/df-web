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
    switch(import.meta.env.VITE_NODE_ENV){
        case "production":
            console.log("NODE_ENV has been set to production")
            import.meta.env.VITE_SUPPORTED_CHAIN_IDS = "[1]"
            import.meta.env.VITE_BACKEND_API = "https://df-sql.oceandao.org"
            import.meta.env.VITE_SUBGRAPH_API = "https://v4.subgraph.mainnet.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
            import.meta.env.VITE_VE_SUPPORTED_CHAINID = 1
            break
        case "staging":
            console.log("NODE_ENV has been set to staging")
            process.env.VITE_SUPPORTED_CHAIN_IDS = "[5]"
            process.env.VITE_BACKEND_API = "https://test-df-sql.oceandao.org"
            process.env.VITE_SUBGRAPH_API = "https://v4.subgraph.goerli.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
            process.env.VITE_VE_SUPPORTED_CHAINID = 5
            process.env.VITE_DEBUGGING = "enabled"
            break
        case "development":
            console.log("NODE_ENV has been set to development")
            process.env.VITE_SUPPORTED_CHAIN_IDS = "[8996]"
            process.env.VITE_BACKEND_API = "https://test-df-sql.oceandao.org"
            process.env.VITE_SUBGRAPH_API = "https://v4.subgraph.goerli.oceanprotocol.com/subgraphs/name/oceanprotocol/ocean-subgraph"
            process.env.VITE_VE_SUPPORTED_CHAINID = 8996
            process.env.VITE_DEBUGGING = "enabled"
            break
        default:
            console.log("NODE_ENV environment variable not set")
    }
}
