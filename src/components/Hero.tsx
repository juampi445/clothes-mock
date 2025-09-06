import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Fashion <span className={styles.accent}>Redefined</span>
        </h1>
        <p className={styles.subtitle}>
          Discover premium streetwear and timeless pieces designed for the modern individual. 
          Where darkness meets style, and comfort meets elegance.
        </p>
        <div className={styles.heroButtons}>
          <button className={styles.ctaButton}>Shop Collection</button>
          <button className={styles.secondaryButton}>View Lookbook</button>
        </div>
      </div>
    </section>
  );
}
