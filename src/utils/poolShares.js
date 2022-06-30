export const getAllPoolSharesForLPAddress = async(userAddress) => {
    const query = {
      LP_addr: userAddress
    };
    let res;
    try {
      res = await fetch(`${process.env.BACKEND_API}/stakes`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
        }),
      });
    } catch (error) {
      console.log(error);
      return [];
    }
    let data = await res.json();
    return data;
  }

  export const getPoolSharesForLPAddress = async(poolAddress, userAddress) => {
    const query = {
      LP_addr: userAddress
    };
    let res;
    try {
      res = await fetch(`https://df-sql.oceandao.org/stakes`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
        }),
      });
    } catch (error) {
      console.log(error);
      return [];
    }
    let data = await res.json();
    return data;
  }