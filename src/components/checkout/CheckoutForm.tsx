"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCheckCircle } from 'react-icons/fa';
import CustomerInfoForm from './CustomerInfoForm';
import PaymentSection from './PaymentSection';
import OrderSummary from './OrderSummary';
import styles from './CheckoutForm.module.scss';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface CheckoutFormProps {
  hasStripeKey: boolean;
}

export default function CheckoutForm({ hasStripeKey }: CheckoutFormProps) {
  const [isClient, setIsClient] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Fashion Street',
    city: 'New York',
    zipCode: '10001',
    country: 'US'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isClient]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasStripeKey) {
      // Demo mode - simulate order processing
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      setSuccess(true);
      setLoading(false);
      
      // Clear cart and redirect after demo
      localStorage.removeItem('cart');
      setTimeout(() => {
        router.push('/?checkout=demo-success');
      }, 3000);
      return;
    }

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(getCartTotal()) * 100), // Convert to cents
          currency: 'usd',
          customerInfo,
          cart
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const cardElement = elements.getElement('card');
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              postal_code: customerInfo.zipCode,
              country: customerInfo.country,
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        // Clear cart
        localStorage.removeItem('cart');
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          router.push('/?checkout=success');
        }, 3000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during payment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  if (success) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <FaCheckCircle />
          </div>
          <h2>{hasStripeKey ? 'Payment Successful!' : 'Demo Order Completed!'}</h2>
          <p>
            {hasStripeKey 
              ? 'Thank you for your purchase. You will receive a confirmation email shortly.'
              : 'This was a demonstration. In a real environment, your payment would be processed securely.'
            }
          </p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className="container">
        <div className={styles.checkoutHeader}>
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        {cart.length === 0 ? (
          <div className={styles.emptyCart}>
            <h3>Your cart is empty</h3>
            <p>Add some items to your cart before checkout.</p>
            <button 
              onClick={() => router.push('/')} 
              className={`btn ${styles.shopBtn}`}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.checkoutForm}>
            <div className="row">
              <div className="col-lg-8">
                <CustomerInfoForm 
                  customerInfo={customerInfo}
                  setCustomerInfo={setCustomerInfo}
                />
                
                <PaymentSection hasStripeKey={hasStripeKey} />

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.payButton}
                >
                  {loading ? 'Processing Payment...' : 
                   !hasStripeKey ? `Demo Order - $${getCartTotal()}` :
                   `Complete Order - $${getCartTotal()}`}
                </button>
              </div>

              <div className="col-lg-4">
                <OrderSummary cart={cart} getCartTotal={getCartTotal} />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
