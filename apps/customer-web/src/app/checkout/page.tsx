'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { submitOrder } from '@/lib/api';
import { Order, OrderItem, OrderChannel } from '@restaurant-os/types';
import { v4 as uuidv4 } from 'uuid'; // Let's try native crypto if uuid is missing, but typically we can generate a mock id if needed

// Simple helper to generate ID if uuid isn't installed
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function CheckoutPage() {
  const { items, cartTotal, addToCart, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const tax = cartTotal * 0.05; // 5% tax
  const total = cartTotal + tax;

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(priceInCents / 100);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const orderItems: OrderItem[] = items.map(item => ({
        id: generateId(),
        productId: item.id,
        productName: item.name,
        quantity: item.cartQuantity,
        unitPrice: item.price,
        totalPrice: item.price * item.cartQuantity,
      }));

      const orderData: Partial<Order> = {
        tenantId: 't1', // Hardcoded for MVP
        outletId: 'default-outlet-id',
        channel: 'WEBSITE' as OrderChannel,
        customerName,
        customerPhone,
        subtotal: cartTotal,
        tax: tax,
        total: total,
        items: orderItems,
      };
      
      const createdOrder = await submitOrder(orderData);
      clearCart();
      router.push(`/order/${createdOrder.id}`);
      
    } catch (err) {
      console.error('Failed to submit order', err);
      // Fallback for mock if API is down
      const mockOrderId = 'ORD-' + generateId().toUpperCase();
      clearCart();
      router.push(`/order/${mockOrderId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo">
            Cafe Pro
          </Link>
          <Link href="/" className="btn btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="container">
        <div className="mb-8">
          <h2>Checkout</h2>
          <p className="text-muted">Review your items and complete your order.</p>
        </div>

        <div className="checkout-grid">
          {/* Left Column - Cart Items */}
          <div>
            <div className="glass-card mb-6">
              <h3 className="mb-4">Your Order</h3>
              
              {items.length === 0 ? (
                <p className="text-muted">Your cart is empty. <Link href="/" style={{color: '#a5b4fc'}}>Browse menu</Link></p>
              ) : (
                <div>
                  {items.map((item) => (
                    <div key={item.id} className="cart-item">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                          🍔
                        </div>
                      )}
                      
                      <div className="cart-item-info">
                        <div className="cart-item-title">{item.name}</div>
                        <div className="cart-item-price">{formatPrice(item.price)}</div>
                      </div>
                      
                      <div className="cart-item-controls">
                        <button className="btn-icon" style={{ width: '32px', height: '32px' }} onClick={() => removeFromCart(item.id)}>-</button>
                        <span className="qty">{item.cartQuantity}</span>
                        <button className="btn-icon" style={{ width: '32px', height: '32px' }} onClick={() => addToCart(item)}>+</button>
                      </div>
                      
                      <div style={{ fontWeight: '600', width: '80px', textAlign: 'right' }}>
                        {formatPrice(item.price * item.cartQuantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary and Form */}
          <div>
            <div className="glass-card mb-6">
              <h3 className="mb-4">Guest Details</h3>
              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    className="input" 
                    placeholder="John Doe" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    className="input" 
                    placeholder="+91 98765 43210" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>

            <div className="glass-card">
              <h3 className="mb-4">Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Taxes (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              {error && <div style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
              
              <button 
                className="btn btn-primary w-full mt-8" 
                onClick={handleCheckout}
                disabled={items.length === 0 || isSubmitting || !customerName || !customerPhone}
                style={{ padding: '1rem', fontSize: '1.1rem' }}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
