"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './checkout.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// For demo purposes - you can replace with your actual Stripe publishable key
const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

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

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Pre-filled test data including Stripe test card info
  const [customerInfo, setCustomerInfo] = useState({
    email: 'test@example.com',
    name: 'John Doe',
    address: '123 Test Street',
    city: 'New York',
    postalCode: '10001',
    country: 'US',
    cardNumber: '4242 4242 4242 4242', // Stripe test card
    expiryDate: '12/25',
    cvc: '123'
  });

  useEffect(() => {
    // Get cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      // Redirect to home if no cart
      router.push('/');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      if (!stripe || !elements) {
        // Demo mode - simulate payment without Stripe
        console.log('Demo mode: Simulating payment...');
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          
          // Clear cart and redirect after success
          localStorage.removeItem('cart');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }, 2000);
        return;
      }

      // Real Stripe payment flow
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card element not found');
        setLoading(false);
        return;
      }

      // Create payment intent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getCartTotal(),
          currency: 'usd',
        }),
      });

      const { clientSecret, error: serverError } = await response.json();

      if (serverError) {
        setError(serverError);
        setLoading(false);
        return;
      }

      // Confirm the payment with the card element
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              postal_code: customerInfo.postalCode,
              country: customerInfo.country,
            },
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentIntentId(paymentIntent.id);
        setLoading(false);
        setSuccess(true);
        
        // Clear cart and redirect after success
        localStorage.removeItem('cart');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      console.error('Payment error:', err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>✓</div>
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
          {paymentIntentId && (
            <p className={styles.paymentId}>Payment ID: {paymentIntentId}</p>
          )}
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className={styles.pageTitle}>Checkout</h1>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className={styles.checkoutForm}>
              {/* Customer Information */}
              <div className={styles.formSection}>
                <h3>Customer Information</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className={styles.formControl}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        className={styles.formControl}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className={styles.formSection}>
                <h3>Shipping Address</h3>
                <div className={styles.formGroup}>
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className={styles.formControl}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        className={styles.formControl}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.formGroup}>
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={customerInfo.postalCode}
                        onChange={handleInputChange}
                        className={styles.formControl}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Country</label>
                  <select
                    name="country"
                    value={customerInfo.country}
                    onChange={handleInputChange}
                    className={styles.formControl}
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                  </select>
                </div>
              </div>

              {/* Payment Information */}
              <div className={styles.formSection}>
                <h3>Payment Information</h3>
                {!STRIPE_KEY ? (
                  <div className={styles.demoModeInfo}>
                    <p><strong>🎭 Demo Mode Active</strong></p>
                    <p>No Stripe API key configured. The payment will be simulated.</p>
                    <p>In a real environment, add your Stripe publishable key to <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code></p>
                  </div>
                ) : (
                  <div className={styles.testCardInfo}>
                    <p><strong>Test Card Details (Use these for testing):</strong></p>
                    <p>Card Number: 4242 4242 4242 4242</p>
                    <p>Expiry: Any future date | CVC: Any 3 digits</p>
                  </div>
                )}
                
                {STRIPE_KEY ? (
                  <div className={styles.cardElementContainer}>
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#e0e0e0',
                            backgroundColor: 'transparent',
                            fontFamily: 'inherit',
                            '::placeholder': {
                              color: '#a0a0a0',
                            },
                          },
                          invalid: {
                            color: '#ff6b6b',
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className={styles.demoCardInput}>
                    <input
                      type="text"
                      placeholder="Card Number (Demo Mode)"
                      value="4242 4242 4242 4242"
                      className={styles.formControl}
                      disabled
                    />
                    <div className="row">
                      <div className="col-6">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value="12/25"
                          className={styles.formControl}
                          disabled
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          placeholder="CVC"
                          value="123"
                          className={styles.formControl}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={styles.payButton}
              >
                {loading ? 'Processing Payment...' : 
                 !STRIPE_KEY ? `Demo Order - $${getCartTotal()}` :
                 `Complete Order - $${getCartTotal()}`}
              </button>
            </form>
          </div>

          <div className="col-lg-4">
            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>
              <div className={styles.orderItems}>
                {cart.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.orderItemImage}>
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        width={50}
                        height={50}
                        className={styles.orderImg}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className={styles.itemPrice}>
                      ${item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.orderTotal}>
                <strong>Total: ${getCartTotal()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Update cart count for header
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const count = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      setCartItemCount(count);
    }
  }, []);

  return (
    <div>
      <Header 
        cartItemCount={cartItemCount} 
        onCartToggle={() => {}} 
      />
      
      <main className={styles.checkoutMain}>
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <CheckoutForm />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
