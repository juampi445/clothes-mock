import { FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import styles from './Products.module.scss';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface ProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function Products({ products, onAddToCart }: ProductsProps) {
  return (
    <section id="products" className={styles.products}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsContainer}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <Image 
                  src={product.image} 
                  alt={product.name}
                  width={400}
                  height={400}
                  className={styles.productImg}
                  priority={product.id <= 3}
                />
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className={styles.productFooter}>
                  <div className={styles.price}>${product.price}</div>
                  <button 
                    className={styles.addToCartBtn}
                    onClick={() => onAddToCart(product)}
                  >
                    <FaPlus /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
