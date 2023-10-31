export const getPredictoorData = async (userAddress) => {
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

  export const getPredictoorRoundSummary = async (userAddress, round) => {
    let res;
    try {
      res = await fetch(`${import.meta.env.VITE_BACKEND_API}/predictoor/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            predictoor_addr: userAddress,
            round: round
            },
            fields: [
              "prediction_count",
              "correct_prediction_count",
              "accuracy",
              "predictoor_addr"
            ]
        }),
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
    let data = await res.json();
    return data ? data[0] : 0
  };