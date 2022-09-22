import addresses from "./address.json"

export const getAddressesByChainId = (chainId) => {
    if (!chainId) return false;
    for (const address in addresses) {
        try {
            const networkChainId = addresses[address].chainId
            if( chainId === networkChainId ) {
                return addresses[address];
            }
        } catch (err) {
            console.error(err, addresses[address], addresses);
        }
    }
    return null;
};

export const getAddressByChainIdKey = (chainId, key) => {
    let addressesByChainId = getAddressesByChainId(parseInt(chainId));
    if(addressesByChainId) {
        if(addressesByChainId[key]) {
            return addressesByChainId[key];
        }
    }
    return null;
};
