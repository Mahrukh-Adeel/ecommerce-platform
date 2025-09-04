export interface CreditCardInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CheckoutData {
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  orderData: {
    products: Array<{
      productId: string;
      quantity: number;
    }>;
    address: string;
    paymentMethod: string;
  };
}

export interface PaymentDetails {
  method: 'credit_card' | 'cash_on_delivery';
  cardLastFour?: string;
  cardType?: string;
}
