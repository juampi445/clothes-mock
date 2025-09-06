"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Cart.module.scss';

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

interface CartProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onRemoveItem: (productId: number) => void;
  getCartTotal: () => number;
}

export default function Cart({ isOpen, cart, onClose, onRemoveItem, getCartTotal }: CartProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleProceedToCheckout = () => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Navigate to checkout page
    router.push('/checkout');
    // Close cart
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.cartOverlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div 
        className={`${styles.cartSidebar} ${isOpen ? styles.slideIn : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.cartHeader}>
          <h3>Shopping Cart</h3>
          <button 
            className={styles.closeCart}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <span>Start shopping to add items to your cart</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemImage}>
                  <Image 
                    src={item.image} 
                    alt={item.name}
                    width={60}
                    height={60}
                    className={styles.cartImg}
                  />
                </div>
                <div className={styles.cartItemInfo}>
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p className={styles.cartItemPrice}>${item.price * item.quantity}</p>
                </div>
                <button 
                  className={styles.removeBtn}
                  onClick={() => onRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <strong>Total: ${getCartTotal()}</strong>
            </div>
            <button 
              className={styles.checkoutBtn}
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
