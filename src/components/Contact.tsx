import styles from './Contact.module.scss';

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.contactContainer}>
        <h2 className={styles.sectionTitle}>Get In Touch</h2>
        <p className={styles.contactDescription}>
          Have questions about our products or need styling advice? We&apos;d love to hear from you.
        </p>
        <form className={styles.contactForm}>
          <div className={styles.formGroup}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
          </div>
          <input type="text" placeholder="Subject" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit" className={styles.submitBtn}>Send Message</button>
        </form>
      </div>
    </section>
  );
}
