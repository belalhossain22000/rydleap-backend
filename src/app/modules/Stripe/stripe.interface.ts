export interface TStripeSaveWithCustomerInfo {
  user: User;
  paymentMethodId: string;
  amount: number;
  address: Address;
}

interface Address {
  city: string;
  postal_code: string;
  country: string;
}

interface User {
  name: string;
  email: string;
}