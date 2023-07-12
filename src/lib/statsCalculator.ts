export const statsCalculator = (history_list: any[]) => {
  const positions: {
    token: string;
    ethInvested: number;
    tokenAmountReceived: number;
    ethReceived: number;
    status: "closed" | "open";
    tokenAmountSold: number;
  }[] = [];

  const swap_list = history_list
    .filter((el: any) => {
      return (
        ((+el.sends?.[0]?.amount > 0 && +el.sends?.[0]?.price > 0) ||
          (+el.receives?.[0]?.amount > 0 && +el.receives?.[0]?.price > 0)) &&
        el.is_scam === false
      );
    })
    .filter(
      (item: any) =>
        item.project_id &&
        (item.project_id.startsWith("uniswap") ||
          item.project_id.startsWith("1inch") ||
          item.project_id.toLowerCase().startsWith("dydx") ||
          item.project_id.startsWith("sushi") ||
          item.project_id.startsWith("curve") ||
          item.project_id.startsWith("paraswap") ||
          item.project_id.startsWith("airswap") ||
          item.project_id.startsWith("slingshot") ||
          item.project_id.startsWith("0x")) &&
        item.sends.length &&
        item.receives.length
    )
    .reverse();
  for (const swap of swap_list) {
    let position = positions.find(
      (el) =>
        (el.token === swap.sends[0].token_id ||
          swap.receives[0].token_id === el.token) &&
        el.status === "open"
    );
    if (!position && swap.sends[0].token_id === "eth") {
      position = {
        token: swap.receives[0].token_id,
        ethInvested: swap.sends[0].amount,
        tokenAmountReceived: swap.receives[0].amount,
        ethReceived: 0,
        tokenAmountSold: 0,
        status: "open",
      };
      positions.push(position);
      continue;
    }
    if (!position) {
      continue;
    }
    if (swap.receives[0].token_id === "eth") {
      position!.ethReceived += swap.receives[0].amount;
      position!.tokenAmountSold += swap.sends[0].amount;
    } else if (swap.sends[0].token_id === "eth") {
      position!.ethInvested += swap.sends[0].amount;
      position!.tokenAmountReceived += swap.receives[0].amount;
    }

    if (
      position!.tokenAmountReceived.toString().split(".")[0] ===
      position!.tokenAmountSold.toString().split(".")[0]
    ) {
      position!.status = "closed";
    }
  }
  const winrate =
    positions
      .filter((el) => el.status === "closed")
      .map((el) => {
        return el.ethReceived / el.ethInvested > 1 ? true : false;
      })
      .filter((el) => el).length /
    positions.filter((el) => el.status === "closed").length;
  const roi =
    (positions
      .filter((el) => el.status === "closed")
      .reduce((acc, el) => {
        return acc + el.ethReceived / el.ethInvested;
      }, 0) /
      positions.filter((el) => el.status === "closed").length) *
      100 -
    100;

  return {
    winrate,
    roi,
  };
};
