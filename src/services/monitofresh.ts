import ky from "ky";

export const monitofresh = {
  async refreshAddressData(addresses: string[], token: string) {
    await ky.post(
      `https://yorckufresher-production.up.railway.app/refreshAddressListData`,
      {
        json: {
          addresses,
        },

        timeout: false,
        headers: {
          Authorization: token,
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  },
};
