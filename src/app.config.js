import networks from "./networks-metadata.json"

//for production
//export const supportedChainIds = [1, 137, 56, 246, 1285];

//for testing
export const supportedChainIds = [3, 4];

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
