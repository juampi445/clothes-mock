"use client";

import { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import DemoCheckoutForm from '../../components/checkout/DemoCheckoutForm';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CartItem {
  id: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [hasStripeKey, setHasStripeKey] = useState(false);

  useEffect(() => {
    // Update cart count
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cart: CartItem[] = JSON.parse(savedCart);
        const totalItems = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        setCartItemCount(totalItems);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    // Fetch Stripe publishable key from API
    const initializeStripe = async () => {
      try {
        const response = await fetch('/api/stripe-config');
        if (response.ok) {
          const { publishableKey } = await response.json();
          if (publishableKey) {
            setStripePromise(loadStripe(publishableKey));
            setHasStripeKey(true);
          }
        } else {
          console.warn('Failed to fetch Stripe configuration');
          setHasStripeKey(false);
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        setHasStripeKey(false);
      }
    };

    initializeStripe();
  }, []);

  // Empty cart toggle function since checkout doesn't need cart toggle
  const handleCartToggle = () => {
    // No-op for checkout page
  };

  return (
    <div className="checkout-page">
      <Header cartItemCount={cartItemCount} onCartToggle={handleCartToggle} />
      
      <main>
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm hasStripeKey={hasStripeKey} />
          </Elements>
        ) : (
          <DemoCheckoutForm />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
