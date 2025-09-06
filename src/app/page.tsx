"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Products from '../components/Products';
import About from '../components/About';
import Features from '../components/Features';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
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

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products: Product[] = [
    { 
      id: 1, 
      name: "Midnight Hoodie", 
      price: 89, 
      description: "Ultra-soft cotton blend with minimalist design",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center"
    },
    { 
      id: 2, 
      name: "Tech Cargo Pants", 
      price: 129, 
      description: "Functional streetwear with multiple pockets",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&crop=center"
    },
    { 
      id: 3, 
      name: "Urban Leather Jacket", 
      price: 299, 
      description: "Genuine leather with modern cut and details",
      image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop&crop=center"
    },
    { 
      id: 4, 
      name: "Stealth Sneakers", 
      price: 159, 
      description: "All-black premium sneakers for every occasion",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center"
    },
    { 
      id: 5, 
      name: "Essential Oversized Tee", 
      price: 49, 
      description: "Relaxed fit tee in premium organic cotton",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center"
    },
    { 
      id: 6, 
      name: "Black Denim Jacket", 
      price: 119, 
      description: "Classic denim jacket with modern twist",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop&crop=center"
    }
  ];

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <div>
      <Header 
        cartItemCount={getCartItemCount()} 
        onCartToggle={() => setIsCartOpen(!isCartOpen)} 
      />
      <Hero />
      <Products products={products} onAddToCart={addToCart} />
      <About />
      <Features />
      <Contact />
      <Footer />
      <Cart 
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={removeFromCart}
        getCartTotal={getCartTotal}
      />
    </div>
  );
}
