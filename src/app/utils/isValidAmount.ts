export function isValidAmount(amount: any): boolean {
  // Check if the value is a number and is finite
  if (typeof amount === "number" && Number.isFinite(amount)) {
    // Check if the number is non-negative
    return amount >= 0;
  }
  return false;
}
