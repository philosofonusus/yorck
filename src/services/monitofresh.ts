import ky from "ky";

export const monitofresh = {
  async refreshAddressData(addresses: string[]) {
    await ky.post(
      `https://yorckufresh-production.up.railway.app/refreshAddressListData`,
      {
        json: {
          addresses,
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  },
};
