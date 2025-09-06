import { FaStar, FaShippingFast, FaRecycle, FaGem, FaUndo, FaUsers } from 'react-icons/fa';
import styles from './Features.module.scss';

export default function Features() {
  const features = [
    {
      icon: <FaStar />,
      title: "Premium Quality",
      description: "Every piece is crafted with the finest materials and attention to detail, ensuring durability and comfort that lasts."
    },
    {
      icon: <FaShippingFast />,
      title: "Fast Shipping",
      description: "Free worldwide shipping on orders over $100. Express delivery available for those who can't wait to upgrade their style."
    },
    {
      icon: <FaRecycle />,
      title: "Sustainable Fashion",
      description: "Committed to ethical production and eco-friendly practices. Fashion that doesn't cost the earth."
    },
    {
      icon: <FaGem />,
      title: "Unique Designs",
      description: "Limited edition collections that set you apart from the crowd. Be part of an exclusive community of style pioneers."
    },
    {
      icon: <FaUndo />,
      title: "Easy Returns",
      description: "30-day hassle-free returns and exchanges. Your satisfaction is our guarantee."
    },
    {
      icon: <FaUsers />,
      title: "Community",
      description: "Join a community of fashion-forward individuals who share your passion for authentic style and self-expression."
    }
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Why Choose Us</h2>
        <div className={styles.featuresContainer}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
