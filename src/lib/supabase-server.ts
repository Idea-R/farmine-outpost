import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://kmvvpvvbrbfjfqjhbhte.supabase.co';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Creates a Supabase client for server-side use (SSR pages / middleware).
 * Reads and writes auth tokens via httpOnly cookies.
 */
export function createSupabaseServer(request: Request, cookies: AstroCookies) {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, {
            ...options,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
          });
        });
      },
    },
  });
}
