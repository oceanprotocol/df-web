import networks from "./networks-metadata.json"

export const supportedChainIds = [1, 137, 3, 4, 1287, 80001];
export const initChainIds = [1, 137, 3, 4, 1287, 80001];

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
