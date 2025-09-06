"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function DemoCheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    address: '456 Demo Avenue',
    city: 'Los Angeles',
    zipCode: '90210',
    country: 'US'
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <FaCheckCircle />
          </div>
          <h2>Demo Order Completed!</h2>
          <p>This was a demonstration. In a real environment, your payment would be processed securely.</p>
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
                
                <PaymentSection hasStripeKey={false} />

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.payButton}
                >
                  {loading ? 'Processing Payment...' : `Demo Order - $${getCartTotal()}`}
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
