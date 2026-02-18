import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

const VALID_COMMANDS = [
  'stop_agent', 'start_agent', 'restart_agent',
  'stop_all', 'start_all',
  'pause_cycles', 'resume_cycles',
  'emergency_shutdown',
];

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServer(request, cookies);

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const { command, target, params } = body;

  if (!command || !VALID_COMMANDS.includes(command)) {
    return new Response(JSON.stringify({ error: 'Invalid command' }), { status: 400 });
  }

  // Rate limit: max 10 pending commands
  const { count } = await supabase
    .from('admin_commands')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if ((count || 0) >= 10) {
    return new Response(JSON.stringify({ error: 'Too many pending commands. Wait for execution.' }), { status: 429 });
  }

  const { data, error } = await supabase
    .from('admin_commands')
    .insert({
      command,
      target: target || null,
      params: params || {},
      issued_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, id: data.id }), { status: 200 });
};
