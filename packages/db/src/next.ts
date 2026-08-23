import { createBrowserClient, createServerClient } from '@supabase/ssr';

export function createNextBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase browser environment variables');
  return createBrowserClient(url, key);
}

// Server client construction is intentionally kept in the Next.js app layer because
// cookie read/write APIs differ by framework/runtime and must be implemented through Proxy.
export { createServerClient };
