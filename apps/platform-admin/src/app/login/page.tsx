'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function PlatformAdminLoginPage() {
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
        
        // In local development or for seed purposes, we want to make sure the user exists.
        // We'll also automatically try to insert a profile and a tenant_member with role PLATFORM_ADMIN
        // for demonstration or bootstrap purposes.
        if (data?.user) {
          const profileResult = await supabase.from('profiles').insert({
            user_id: data.user.id,
            full_name: email.split('@')[0],
            phone: '',
          });
          
          // To register as a platform admin, we'll try to insert a role in tenant_members for the demo tenant.
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
              role: 'PLATFORM_ADMIN',
            });
          }
        }

        setMessage({ type: 'success', text: 'Platform Admin user registered successfully! You can now log in.' });
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
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Restaurant OS
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Platform Admin Console</p>
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
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="admin@restaurantos.com"
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
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Admin Account' : 'Sign In to Console'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-700 pt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need to set up a new local Admin? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
