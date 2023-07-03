import ky from "ky";

export const monitofresh = {
  async refreshAddressData(addresses: string[]) {
    await ky.post(`http://localhost:8080/refreshAddressListData`, {
      json: {
        addresses,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
