import https from "https";
import { getPayPalAccessToken } from "../../../helpars/getPaypalAccessToken";

const sendPaymentToRider = async (riderPaypalEmail: string, amount: number) => {
  console.log(riderPaypalEmail, amount);
  const clientId =
    "ASd_lmSnTy8kndq2i7Ti5pOa78WOeio7wOc8UeGi7lIahMr6-8diXFiqvymTJylctAOKlFIrdPaQlfmB";
  const secret =
    "EE9AbR3F8K7Hm0IvpzzF5EEiF3Nn2Ze0V8r9uopPvB-l85MEiCzRt1g924hBZiIxOU7wNrLEVAnzmXV5";
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const url = new URL("https://api.sandbox.paypal.com/v1/payments/payouts");

  const payoutData = JSON.stringify({
    sender_batch_header: {
      sender_batch_id: `${Date.now()}`, // Unique batch ID
      email_subject: "You have a payment",
    },
    items: [
      {
        recipient_type: "EMAIL",
        amount: {
          value: amount.toFixed(2), // Amount to send
          currency: "USD",
        },
        receiver: riderPaypalEmail,
        note: "Thank you for your business!",
        sender_item_id: "item-1",
      },
    ],
  });

  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payoutData).toString(),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(url, options, (response: any) => {
      let data = "";

      response.on("data", (chunk: any) => {
        data += chunk;
      });

      response.on("end", () => {
        const result = JSON.parse(data);

        if (
          response.statusCode === 201 ||
          response.statusCode === 200 ||
          response.statusCode === 300
        ) {
          const transactionId = result.batch_header.payout_batch_id; // Extract transaction ID
          resolve({
            success: true,
            email: riderPaypalEmail,
            transactionId: transactionId,
            amount: amount.toFixed(2),
          });
        } else {
          reject({ success: false, message: result });
        }
      });
    });

    request.on("error", (error: any) => {
      console.error("Error sending payment:", error);
      reject({ success: false, message: "Failed to send payment." });
    });

    request.write(payoutData);
    request.end();
  });
};

const sendPaymentToOwner = async (req: any) => {
  const { amount } = req.body;

  try {
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    const orderData = JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: "USD",
          },
        },
      ],
    });

    const options = {
      hostname: "api-m.sandbox.paypal.com",
      path: "/v2/checkout/orders",
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(orderData), // Set content length
      },
    };

    return new Promise((resolve, reject) => {
      const reqPaypal = https.request(options, (res) => {
        let data = "";

        // Collect response data
        res.on("data", (chunk) => {
          data += chunk;
        });

        // On end of response, resolve the promise
        res.on("end", () => {
          try {
            const order = JSON.parse(data);
            resolve(order); // Resolve with the order details
          } catch (error) {
            reject(new Error("Failed to parse order response"));
          }
        });
      });

      // Handle request errors
      reqPaypal.on("error", (error) => {
        console.error("Error sending payment to owner:", error);
        reject(new Error("Failed to send payment to owner"));
      });

      // Write data and end the request
      reqPaypal.write(orderData);
      reqPaypal.end();
    });
  } catch (error) {
    console.error("Error in sendPaymentToOwner:", error);
    throw error; // Rethrow error for further handling
  }
};

// Function to capture the payment
const capturePayment = async (orderId: string) => {
  try {
    const accessToken = await getPayPalAccessToken();

    const options = {
      hostname: "api-m.sandbox.paypal.com",
      path: `/v2/checkout/orders/${orderId}/capture`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    return new Promise((resolve, reject) => {
      const reqPaypal = https.request(options, (res) => {
        let data = "";

        // Collect response data
        res.on("data", (chunk) => {
          data += chunk;
        });

        // On end of response, resolve the promise
        res.on("end", () => {
          try {
            const captureResult = JSON.parse(data);
            resolve(captureResult); // Resolve with the capture result
          } catch (error) {
            reject(new Error("Failed to parse capture response"));
          }
        });
      });

      // Handle request errors
      reqPaypal.on("error", (error) => {
        console.error("Error capturing payment:", error);
        reject(new Error("Failed to capture payment"));
      });

      // Write data and end the request
      reqPaypal.write(JSON.stringify({})); // Send an empty body for capture
      reqPaypal.end();
    });
  } catch (error) {
    console.error("Error in capturePayment:", error);
    throw error; // Rethrow error for further handling
  }
};

export const paymentService = {
  sendPaymentToRider,
  sendPaymentToOwner,
  capturePayment,
};
