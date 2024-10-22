import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  stripe_key: process.env.STRIPE_SECRET_KEY,
  backend_base_url: process.env.BACKEND_BASE_URL,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
    contact_mail_address: process.env.CONTACT_MAIL_ADDRESS,
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  socialLogin: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // facebookClientId:process.env.FACEBOOK_CLIENT_ID,
    // facebookClientSecret:process.env.FACEBOOK_CLIENT_SECRET,
    // githubClientId:process.env.GITHUB_CLIENT_ID,
    // githubClientSecret:process.env.GITHUB_CLIENT_SECRET,
  },

  paypal: {
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalSecretId: process.env.PAYPAL_SECRET_ID,
  },
};
