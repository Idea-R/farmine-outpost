import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServer } from './lib/supabase-server';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only gate /admin/* routes (except login page and auth API)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login' || pathname.startsWith('/admin/api/')) {
    return next();
  }

  const supabase = createSupabaseServer(context.request, context.cookies);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return context.redirect('/admin/login');
  }

  // Optional: restrict to a specific admin user ID
  const adminUserId = import.meta.env.ADMIN_USER_ID;
  if (adminUserId && user.id !== adminUserId) {
    return context.redirect('/admin/login');
  }

  // Attach user to locals for downstream pages
  context.locals.user = user;

  return next();
});
