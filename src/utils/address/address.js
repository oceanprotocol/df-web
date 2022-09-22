import addresses from "./address.json"

export const getAddressesByChainId = async (chainId) => {
    console.log(chainId)
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
    console.log(chainId, key)
    addressesByChainId = getAddressesByChainId(chainId);
    console.log(addressesByChainId)
    if(addressesByChainId) {
        if(addressesByChainId.hasOwnProperty(key)) {
            console.log(addressesByChainId[key])
            return addressesByChainId[key];
        }
    }
    return null;
};
