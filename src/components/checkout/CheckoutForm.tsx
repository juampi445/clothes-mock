"use client";

import { useState, useEffect } from 'react';
import StripeCheckoutForm from './StripeCheckoutForm';
import styles from './CheckoutForm.module.scss';

interface CheckoutFormProps {
  hasStripeKey: boolean;
}

export default function CheckoutForm({ hasStripeKey }: CheckoutFormProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server side to avoid hydration issues
  if (!isClient) {
    return (
      <div className={styles.checkoutContainer}>
        <div className="container">
          <div className="text-center">
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  // If we have Stripe key, render the Stripe form (which will be wrapped in Elements)
  if (hasStripeKey) {
    return <StripeCheckoutForm />;
  }

  // If no Stripe key, show message to use demo checkout instead
  return (
    <div className={styles.checkoutContainer}>
      <div className="container">
        <div className={styles.checkoutHeader}>
          <h1>Checkout</h1>
          <p>Stripe configuration not found. Using demo mode.</p>
        </div>
      </div>
    </div>
  );
}
