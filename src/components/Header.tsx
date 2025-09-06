"use client";

import { FaShoppingCart } from 'react-icons/fa';
import styles from './Header.module.scss';

interface HeaderProps {
  cartItemCount: number;
  onCartToggle: () => void;
}

export default function Header({ cartItemCount, onCartToggle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          DARK<span className={styles.accent}>THREADS</span>
        </div>
        <ul className={styles.navLinks}>
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <button 
              className={styles.cartButton}
              onClick={onCartToggle}
            >
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
