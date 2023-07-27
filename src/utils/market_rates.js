export const getRate = async(bnb_symbol, cg_symbol) => {
    let rate = await getBinanceRate(bnb_symbol);
    if (rate !== null) {
        return rate;
    }

    rate = await getCoingeckoRate(cg_symbol);
    if (rate !== null) {
        return rate;
    }

    return null;
}

export const getBinanceRate = async (token_symbol) => {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${token_symbol}USDT`);
    const data = await response.json();
    return parseFloat(data.price);
}

export const getCoingeckoRate = async (tokenId) => {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    const data = await response.json();
    return data[tokenId].usd;
}