import { CardElement } from '@stripe/react-stripe-js';
import styles from './PaymentSection.module.scss';

interface PaymentSectionProps {
  hasStripeKey: boolean;
}

export default function PaymentSection({ hasStripeKey }: PaymentSectionProps) {
  return (
    <div className={styles.formSection}>
      <h3>Payment Information</h3>
      {!hasStripeKey ? (
        <div className={styles.demoModeInfo}>
          <p><strong>🎭 Demo Mode Active</strong></p>
          <p>No Stripe API key configured. The payment will be simulated.</p>
          <p>In a real environment, add your Stripe publishable key to <code>STRIPE_PUBLISHABLE_KEY</code></p>
        </div>
      ) : (
        <div className={styles.testCardInfo}>
          <p><strong>Test Card Details (Use these for testing):</strong></p>
          <p>Card Number: 4242 4242 4242 4242</p>
          <p>Expiry: Any future date | CVC: Any 3 digits</p>
        </div>
      )}
      
      {hasStripeKey ? (
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
  );
}
