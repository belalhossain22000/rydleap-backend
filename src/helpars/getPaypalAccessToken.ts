import axios, { AxiosResponse } from "axios";
import config from "../config";

// Define the type for the response
interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Function to get PayPal access token
export const getPayPalAccessToken = async (): Promise<string> => {
  const PAYPAL_API = "https://api-m.sandbox.paypal.com";

  const response: AxiosResponse<PayPalAccessTokenResponse> = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials", // Pass the data as the second argument
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: config.paypal.paypalClientId || "",
        password: config.paypal.paypalSecretId || "",
      },
    }
  );

  return response.data.access_token;
};
