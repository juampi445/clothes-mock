import Image from 'next/image';
import styles from './OrderSummary.module.scss';

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

interface OrderSummaryProps {
  cart: CartItem[];
  getCartTotal: () => string;
}

export default function OrderSummary({ cart, getCartTotal }: OrderSummaryProps) {
  return (
    <div className={styles.orderSummary}>
      <h3>Order Summary</h3>
      <div className={styles.orderItems}>
        {cart.map(item => (
          <div key={item.id} className={styles.orderItem}>
            <div className={styles.orderItemImage}>
              <Image 
                src={item.image} 
                alt={item.name}
                width={60}
                height={60}
                className={styles.orderImg}
              />
            </div>
            <div className={styles.itemInfo}>
              <h4>{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.orderTotal}>
        <div className={styles.totalRow}>
          <span>Subtotal:</span>
          <span>${getCartTotal()}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className={styles.totalRow}>
          <span>Tax:</span>
          <span>$0.00</span>
        </div>
        <div className={`${styles.totalRow} ${styles.finalTotal}`}>
          <span>Total:</span>
          <span>${getCartTotal()}</span>
        </div>
      </div>
    </div>
  );
}
