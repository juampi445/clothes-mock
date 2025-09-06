import { FaInstagram, FaTwitter, FaFacebookF, FaTiktok } from 'react-icons/fa';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>DarkThreads</h4>
          <p>Premium streetwear for the modern individual. Redefining fashion with style, substance, and sustainability.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>
        <div className={styles.footerSection}>
          <h4>Customer Care</h4>
          <a href="#">Size Guide</a>
          <a href="#">Shipping Info</a>
          <a href="#">Returns</a>
          <a href="#">FAQ</a>
        </div>
        <div className={styles.footerSection}>
          <h4>Connect</h4>
          <a href="#"><FaInstagram className={styles.socialIcon} />Instagram</a>
          <a href="#"><FaTwitter className={styles.socialIcon} />Twitter</a>
          <a href="#"><FaFacebookF className={styles.socialIcon} />Facebook</a>
          <a href="#"><FaTiktok className={styles.socialIcon} />TikTok</a>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2025 DarkThreads. All rights reserved. | Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
}
