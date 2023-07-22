import ky from "ky";

export const monitofresh = {
  
  async refreshAddressData(addresses: string[], token: string) {
    await ky.post(
      `https://yorckufresh-production.up.railway.app/refreshAddressListData`,
      {
        json: {
          addresses,
        },

        timeout: false,
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  },
};
