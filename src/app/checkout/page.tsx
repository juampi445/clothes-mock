"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

// Dynamic imports to prevent SSR issues
const StripeCheckoutForm = dynamic(() => import('../../components/checkout/StripeCheckoutForm'), {
  ssr: false,
  loading: () => <p>Loading payment form...</p>
});

const DemoCheckoutForm = dynamic(() => import('../../components/checkout/DemoCheckoutForm'), {
  ssr: false,
  loading: () => <p>Loading demo checkout...</p>
});

interface CartItem {
  id: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [isClient, setIsClient] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    // Fetch Stripe publishable key from API
    const initializeStripe = async () => {
      try {
        const response = await fetch('/api/stripe-config');
        if (response.ok) {
          const { publishableKey } = await response.json();
          if (publishableKey) {
            setStripePromise(loadStripe(publishableKey));
          }
        } else {
          console.warn('Failed to fetch Stripe configuration');
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      }
    };

    initializeStripe();
  }, [isClient]);

  // Empty cart toggle function since checkout doesn't need cart toggle
  const handleCartToggle = () => {
    // No-op for checkout page
  };

  // Don't render until client-side to avoid SSR issues
  if (!isClient) {
    return (
      <div className="checkout-page">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header cartItemCount={cartItemCount} onCartToggle={handleCartToggle} />
      
      <main>
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm />
          </Elements>
        ) : (
          <DemoCheckoutForm />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
