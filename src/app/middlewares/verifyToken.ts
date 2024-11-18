import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "ryd-leap-peach",
  private_key_id: "358e34ba4f3ac9919cddbba39246fd360c220ed7",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQQM9pwcrSkdgR\nH3m2Mk79vVUE+FMRpxHULYiO82uVH0u1C6WrQM0SD4FX/LZtphi9VEHVCTDyiF6H\nH6Kc8IeEoXA/cMlQh+J/hCHyVozFdweg3OaMZ1mxKTMZMXeS2T3VvqXrhKmBA2q7\nW9EKm6rTM2E00ufuYjc4e/n48dwju37pFuyoHFZPUh54Qvq6wUMw7oeUeLjHy5Cc\nt4oYHfgs07KXzy7hA2zFCQAm+bhgYysHvxOPVYirlM4HbguhmWB4Y3XzGcRrvdYl\n3/V/h5Nvi2Jyh1w//H0W5YUPWKuAkhlD9VzPQt+zIDMjHnX3ewdJKN8fpxLH6Dd6\nWs+/CuiTAgMBAAECggEAZnlltpQSEiCK8g4LbZB+1xPpuIrbEWYk+0O2nSUBrLzc\nG4fSKx01a6wuiNXFDNp89Pj3dfVSXR2mahYyhchD3wszeTwuC4758KZbr+xP08D5\nA3p/hdo7Q9ZSmxSA0sVMTJfF/EjowZ+lTvFkwTQNUGTJcd1QHDi/FG/I9utIWFn/\n2jKZ2Inq+L1g64Fa1eYa2uxE20TG+LSSfMXS06T0m5oSMQVQexY73vLSG6VbhVbG\n4NkK9UxACj2Liylp3CKOugQDfgmrFlfYrSwUYO9arJdLTqHakdxCpOVwrEDb2YRd\nqTyEPiJrQxHp90hKdvuw3cdL2gQ2zh6EBfUhHNyW4QKBgQD9+NKx9q9yy31m7z2i\n5RlHouTRJxroW0gVySqrIZszTMl1i0yXbajGgqQy5j0dywPJF0GYckKa8IuFTpAi\nf3p9+bqpskXKYbxMcRMQ3/itAxfytHOZ1TtL+dhi9uPdqE52l7oUn0DDTGqe2zUa\nnhVZ5WB19tUa2A+j6qHxaJ2z4QKBgQDR6ocHuUg/ygThsl6cdKdouAjpnxFDQJcg\nLPIRe51riVX74ddnq6GgaUtMosyrdHQu7TNJYIhMaVN8TtGXFgb3s5UcVb6Lz5ys\nTCeq8GmWxkwmf/ZWmsJc20X/wK+D7H9Sj+PmlZMAqij7lcnqPs5x5mY0Ubznzrd5\n78ZnIJ5q8wKBgGyWl9d5hviJItwBDJR6af2kGzuGAc45QS/3bCPxYX9kpHp6jcvt\nGg2OTBBrOtRjOgIfzG8W432FvdHIjn4BjWkRfosR6x8l/LGeYy2C5btrqDCgkRDE\nB+9rKubdcv4R+UJhizFIChO2t5umVCVGVBC0rzKgz+sDWGSYbJdgSJVhAoGACtUl\nfrqLBe+w7My9oSlL8lV88EFrLKNKqThojYpph0EhFMyExy7OOm70mdHU6gwqarmG\n6gR3RCozSrjui/NxDJtR2JJ8MM7X8PRFH8ckS8mT6HC2D6YQ3aXbKOWSqSYtM9+F\nDUMuwNwHHWSPdO0kzi/rmkuVigja4woCnRPL2Q0CgYEAhMfbctWGrHCs/y5X+O1I\ntc+NR0vt8duaPyMTFitx6awVaAQlsDjgkSwEBdYE8sqC0LSc58XnIgTT2zTiljNE\nijrY9/ip2CY3Z0ETMqQ63+dNlChZVLej2wA61bp9y7CGlYS+kpM8g1V/wXqckoVp\nZxBhnGqSBo/7oQuXKVQ7HN8=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-uqice@ryd-leap-peach.iam.gserviceaccount.com",
  client_id: "112453387684436642369",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uqice%40ryd-leap-peach.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
  console.log("Initializing Firebase Admin SDK...");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}

export const verifyToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    console.log("Received Token:", token);

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      console.log("Decoded User:", decodedUser);

      req.user = decodedUser;
      next();
    } catch (error: any) {
      console.error("Error verifying token:", error.message, error.code);
      return res
        .status(401)
        .json({ message: "Unauthorized", error: error.message });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }
};
