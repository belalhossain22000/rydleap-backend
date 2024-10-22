const calculateServiceCharge = (totalAmount: any, serviceRate: any) => {
  const serviceCharge = (totalAmount * serviceRate) / 100;
  const amountToDriver = totalAmount - serviceCharge;
  return { serviceCharge, amountToDriver };
};

const totalAmount = 100; // The amount the user paid
const serviceRate = 10; // 10% service charge
const { serviceCharge, amountToDriver } = calculateServiceCharge(
  totalAmount,
  serviceRate
);
