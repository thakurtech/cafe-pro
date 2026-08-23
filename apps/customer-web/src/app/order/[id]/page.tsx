'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card text-center" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'rgba(74, 222, 128, 0.2)', 
          color: '#4ade80',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          border: '1px solid rgba(74, 222, 128, 0.5)'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Order Placed!</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          Your order has been successfully placed and is being prepared by our kitchen.
        </p>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Order ID</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', letterSpacing: '1px' }}>{orderId}</div>
        </div>
        
        <Link href="/" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
