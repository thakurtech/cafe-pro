'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMenu } from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import { Product } from '@restaurant-os/types';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, items } = useCart();
  
  // For the MVP, we can hardcode a mock outlet ID, or you could get it from the URL/environment
  const outletId = 'default-outlet-id';

  useEffect(() => {
    async function loadMenu() {
      try {
        const menu = await fetchMenu(outletId);
        setProducts(menu);
      } catch (error) {
        console.error('Failed to load menu:', error);
        // Fallback mock data for visual development if API is not running
        setProducts([
          { id: '1', tenantId: 't1', name: 'Artisan Burger', description: 'Juicy beef patty with aged cheddar, caramelized onions, and house sauce on a brioche bun.', price: 1250, isAvailable: true },
          { id: '2', tenantId: 't1', name: 'Truffle Fries', description: 'Crispy fries tossed in truffle oil and parmesan cheese.', price: 600, isAvailable: true },
          { id: '3', tenantId: 't1', name: 'Matcha Latte', description: 'Premium matcha green tea with steamed oat milk.', price: 450, isAvailable: true },
          { id: '4', tenantId: 't1', name: 'Margherita Pizza', description: 'Classic Neapolitan style with San Marzano tomatoes, fresh mozzarella, and basil.', price: 1400, isAvailable: true },
          { id: '5', tenantId: 't1', name: 'Acai Bowl', description: 'Blended acai topped with fresh berries, house granola, and honey.', price: 900, isAvailable: true },
          { id: '6', tenantId: 't1', name: 'Avocado Toast', description: 'Smashed avocado on sourdough with chili flakes and poached egg.', price: 850, isAvailable: true },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const cartItemCount = items.reduce((sum, item) => sum + item.cartQuantity, 0);

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(priceInCents / 100);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo">
            Cafe Pro
          </Link>
          <Link href="/checkout" className="cart-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
          </Link>
        </div>
      </header>

      <main className="container">
        <div className="text-center mb-8">
          <h1>Our Menu</h1>
          <p className="product-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Discover our premium selection of handcrafted delights, made with the freshest ingredients just for you.
          </p>
        </div>

        {loading ? (
          <div className="text-center mt-8">
            <p>Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="glass-card flex" style={{ flexDirection: 'column' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="product-img" />
                ) : (
                  <div className="product-image-placeholder">
                    🍔
                  </div>
                )}
                
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description || 'Delicious freshly prepared item.'}</p>
                
                <div className="product-footer">
                  <span className="product-price">{formatPrice(product.price)}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn btn-primary"
                    disabled={!product.isAvailable}
                  >
                    {product.isAvailable ? 'Add to Cart' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
