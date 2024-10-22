import axios from "axios";

export const getPayPalAccessToken = async () => {
  const PAYPAL_API = "https://api-m.sandbox.paypal.com";
  const response = await axios({
    method: "post",
    url: `${PAYPAL_API}/v1/oauth2/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username:
        "ASd_lmSnTy8kndq2i7Ti5pOa78WOeio7wOc8UeGi7lIahMr6-8diXFiqvymTJylctAOKlFIrdPaQlfmB",
      password:
        "EE9AbR3F8K7Hm0IvpzzF5EEiF3Nn2Ze0V8r9uopPvB-l85MEiCzRt1g924hBZiIxOU7wNrLEVAnzmXV5",
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
};
