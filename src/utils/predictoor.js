export const getPredictoorAccuracy = async (userAddress) => {
    let res;
    try {
      res = await fetch(`${import.meta.env.VITE_BACKEND_API}/predictoor/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
                round: {
                  $gt: -1,
                }
            },
          fields: [
            "accuracy",
          ]
        }),
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
    let data = await res.json();
    return data.length > 0 ? data.legth : 0
  };