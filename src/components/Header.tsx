"use client";

import { useState } from 'react';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.scss';

interface HeaderProps {
  cartItemCount: number;
  onCartToggle: () => void;
}

export default function Header({ cartItemCount, onCartToggle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    console.log('Toggle mobile menu clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu');
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    onCartToggle();
    closeMobileMenu(); // Close mobile menu when cart is clicked
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#home" className={styles.logo}>
          DARK<span className={styles.accent}>THREADS</span>
        </a>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <ul className={`${styles.navLinks} ${styles.desktopNav}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <button 
              className={styles.cartButton}
              onClick={onCartToggle}
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>
          </li>
        </ul>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
          <ul className={styles.mobileNavLinks}>
            <li><a href="#home" onClick={closeMobileMenu}>Home</a></li>
            <li><a href="#products" onClick={closeMobileMenu}>Products</a></li>
            <li><a href="#about" onClick={closeMobileMenu}>About</a></li>
            <li><a href="#contact" onClick={closeMobileMenu}>Contact</a></li>
            <li className={styles.mobileCartItem}>
              <button 
                className={styles.mobileCartButton}
                onClick={handleCartClick}
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <FaShoppingCart />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>{cartItemCount}</span>
                )}
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.overlayVisible : ''}`}
          onClick={closeMobileMenu}
        />
      </nav>
    </header>
  );
}
