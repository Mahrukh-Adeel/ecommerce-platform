import type { CreditCardInfo } from '../types/payment';

export const validateCreditCardForm = (creditCardInfo: CreditCardInfo, sameAsShipping: boolean = true): boolean => {
  const digits = creditCardInfo.cardNumber.replace(/\D/g, '');
  
  const isCardNumberValid = digits.length >= 13;
  const isExpiryValid = creditCardInfo.expiryMonth.trim().length > 0 && creditCardInfo.expiryYear.trim().length > 0;
  const isCvvValid = creditCardInfo.cvv.length >= 3;
  const isCardholderNameValid = creditCardInfo.cardholderName.trim().length > 0;
  
  let isBillingAddressValid = true;
  if (!sameAsShipping) {
    isBillingAddressValid = (
      creditCardInfo.billingAddress.streetAddress.trim().length > 0 &&
      creditCardInfo.billingAddress.city.trim().length > 0 &&
      creditCardInfo.billingAddress.state.trim().length > 0 &&
      creditCardInfo.billingAddress.zipCode.trim().length > 0
    );
  }
  
  return (
    isCardNumberValid &&
    isExpiryValid &&
    isCvvValid &&
    isCardholderNameValid &&
    isBillingAddressValid
  );
};

export const validateCardNumber = (cardNumber: string): { isValid: boolean; message?: string } => {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return { isValid: false, message: 'Please enter your card number' };
  }
  
  if (digits.length < 13) {
    return { isValid: false, message: 'Please enter a valid card number' };
  }
  
  return { isValid: true };
};

export const validateCVV = (cvv: string): { isValid: boolean; message?: string } => {
  if (cvv.length === 0) {
    return { isValid: false, message: 'Please enter CVV' };
  }
  
  if (cvv.length < 3) {
    return { isValid: false, message: 'CVV must be 3-4 digits' };
  }
  
  return { isValid: true };
};

export const validateExpiryDate = (month: string, year: string): { isValid: boolean; message?: string } => {
  if (!month || !year) {
    return { isValid: false, message: 'Please select expiry date' };
  }
  
  const currentYear = new Date().getFullYear();
  const expiryYear = parseInt(year);
  
  if (expiryYear < currentYear) {
    return { isValid: false, message: 'Please check expiry year' };
  }
  
  return { isValid: true };
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const getCardType = (cardNumber: string): string => {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.startsWith('4')) return 'Visa';
  if (digits.startsWith('5') || digits.startsWith('2')) return 'Mastercard';
  if (digits.startsWith('3')) return 'American Express';
  
  return 'Card';
};