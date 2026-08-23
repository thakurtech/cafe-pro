'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function MerchantLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data?.user) {
          await supabase.from('profiles').insert({
            user_id: data.user.id,
            full_name: email.split('@')[0],
            phone: '',
          });
          
          // To register as a merchant owner, we'll try to insert a role in tenant_members for the demo tenant.
          // First, fetch the demo tenant ID.
          const { data: tenant } = await supabase
            .from('tenants')
            .select('id')
            .eq('slug', 'demo-cafe')
            .single();

          if (tenant) {
            await supabase.from('tenant_members').insert({
              tenant_id: tenant.id,
              user_id: data.user.id,
              role: 'OWNER',
            });
          }
        }

        setMessage({ type: 'success', text: 'Merchant account registered successfully! You can now log in.' });
        setIsSignUp(false);
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        window.location.href = '/';
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred during authentication.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
            Restaurant OS
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Merchant Dashboard & POS</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              placeholder="owner@mycafe.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm border font-medium ${
                message.type === 'error'
                  ? 'bg-rose-950/50 border-rose-800 text-rose-200'
                  : 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold transition shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Owner Account' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-700 pt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-sky-400 hover:text-sky-300 text-sm font-medium transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need to set up a new local Cafe Owner? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
