import { create } from 'zustand';

export interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  mobile: string;
  isInternational: boolean;
  isDone: boolean;
}

export interface PaymentDetails {
  name: string;
  cardNumber: string;
  expiry: string;
  ccv: string;
  type: 'credit' | 'paypal';
}

interface CheckoutStore {
  shipping: ShippingDetails;
  payment: PaymentDetails;
  setShippingDetails: (details: ShippingDetails) => void;
  setPaymentDetails: (details: Partial<PaymentDetails>) => void;
  resetCheckout: () => void;
}

const initialShipping: ShippingDetails = {
  fullName: '',
  email: '',
  address: '',
  mobile: '',
  isInternational: false,
  isDone: false,
};

const initialPayment: PaymentDetails = {
  name: '',
  cardNumber: '',
  expiry: '',
  ccv: '',
  type: 'credit',
};

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  shipping: initialShipping,
  payment: initialPayment,

  setShippingDetails: (details) => {
    set({ shipping: details });
  },

  setPaymentDetails: (details) => {
    set((state) => ({
      payment: { ...state.payment, ...details },
    }));
  },

  resetCheckout: () => {
    set({ shipping: initialShipping, payment: initialPayment });
  },
}));
