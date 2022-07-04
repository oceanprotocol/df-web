export const getRewards = async(userAddress) => {
  let res;
  try {
    res = await fetch(`${process.env.BACKEND_API}/rewards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "query":{
          "LP_addr":userAddress.toLowerCase()
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