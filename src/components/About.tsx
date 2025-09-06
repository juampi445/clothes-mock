import styles from './About.module.scss';

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutContainer}>
        <div className={styles.aboutContent}>
          <h2>About DarkThreads</h2>
          <p>
            Founded in 2020, DarkThreads emerged from a vision to create clothing that speaks 
            to the modern individual&apos;s desire for both style and substance. We believe that 
            fashion should be an extension of your personality - bold, confident, and unapologetically authentic.
          </p>
          <p>
            Our collections blend streetwear aesthetics with premium materials and craftsmanship. 
            Every piece is designed to move with you through your daily adventures while making 
            a statement about who you are and what you stand for.
          </p>
          <p>
            We&apos;re committed to sustainable practices, ethical manufacturing, and creating pieces 
            that last beyond fleeting trends. When you choose DarkThreads, you&apos;re not just buying 
            clothes - you&apos;re investing in a philosophy of timeless style.
          </p>
        </div>
        <div className={styles.aboutImage}>
          Our Story
        </div>
      </div>
    </section>
  );
}
