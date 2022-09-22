import addresses from "./address.json"

export const getAddressesByChainId = async (chainId) => {
    if (!chainId) return false;
    for (const address of addresses) {
        try {
            const networkChainId = address.chainId
            if( chainId === networkChainId ) {
                return address;
            }
        } catch (err) {
            console.error(err, address, addresses);
        }
    }
    return null;
};

export const getAddressByChainIdKey = async (chainId, key) => {
    addressesByChainId = getAddressesByChainId(chainId);
    if(addressesByChainId) {
        if(addressesByChainId.hasOwnProperty(key)) {
            return addressesByChainId[key];
        }
    }
    return null;
};
