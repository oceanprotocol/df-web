import networks from "networks-metadata.json"

export const supportedChainIds = [0, 1, 137, 56, 246, 1285];

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

module.exports = {
    supportedChainIds,
    getNetworkByChainId
}
