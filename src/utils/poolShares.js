export const getAllPoolSharesForLPAddress = async(userAddress) => {
    let res;
    try {
      res = await fetch(`${process.env.BACKEND_API}/stakes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "query":{
            "LP_addr": userAddress.toLowerCase()
          }
        }),
      });
    } catch (error) {
      console.log(error);
      return [];
    }
    let data = await res.json();
    return data;
  }

  export const getStakedAmountForLPAddress = async(stakes,poolAddress) => {
    let pool;
    pool = stakes.find((poolStake) =>poolStake.pool_addr === poolAddress)
    return pool ? pool.stake_amt * 2 : 0;
  }