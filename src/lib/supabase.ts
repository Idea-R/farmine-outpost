import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://kmvvpvvbrbfjfqjhbhte.supabase.co';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Data fetchers (build-time or client-side) ---

export async function getAgents() {
  const { data, error } = await supabase
    .from('agent_souls')
    .select('agent_id, dwarven_name, display_name, specialization, emoji, mood, catchphrase, signature, color')
    .order('agent_id');
  if (error) console.error('Failed to fetch agents:', error.message);
  return data || [];
}

export async function getBlackboard(limit = 20) {
  const { data, error } = await supabase
    .from('shared_blackboard')
    .select('id, posted_by, entry_type, content, priority, status, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) console.error('Failed to fetch blackboard:', error.message);
  return data || [];
}

export async function getRecentTasks(limit = 20) {
  const { data, error } = await supabase
    .from('task_ledger')
    .select('id, task_description, assigned_to, delegated_by, status, priority, created_at, completed_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) console.error('Failed to fetch tasks:', error.message);
  return data || [];
}

export async function getIntrospections() {
  const { data, error } = await supabase
    .from('introspection_log')
    .select('agent_id, mood_before, mood_after, growth_goals, burnout_flag, created_at')
    .order('created_at', { ascending: false })
    .limit(9);
  if (error) console.error('Failed to fetch introspections:', error.message);
  return data || [];
}

export async function getMorningBriefing() {
  const { data, error } = await supabase
    .from('shared_blackboard')
    .select('content, created_at')
    .eq('entry_type', 'announcement')
    .eq('posted_by', 'dev_master')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') console.error('Failed to fetch briefing:', error.message);
  return data || null;
}

// --- Vault fetchers ---

export async function getVaultTools() {
  const { data, error } = await supabase
    .from('vault_tools')
    .select('id, name, description, tier, cost_per_use, daily_limit, global_daily_limit, requires_approval, enabled')
    .eq('enabled', true)
    .order('tier');
  if (error) console.error('Failed to fetch vault tools:', error.message);
  return data || [];
}

export async function getVaultUsage(limit = 50) {
  const { data, error } = await supabase
    .from('vault_usage')
    .select('agent_id, tool_id, date, count, total_cost')
    .order('date', { ascending: false })
    .limit(limit);
  if (error) console.error('Failed to fetch vault usage:', error.message);
  return data || [];
}

// --- API Spend fetchers ---

export async function getApiSpend(since: string) {
  const { data, error } = await supabase
    .from('api_spend')
    .select('agent_id, model, provider, estimated_cost, input_tokens, output_tokens, reasoning_tokens, call_type, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false });
  if (error) console.error('Failed to fetch api spend:', error.message);
  return data || [];
}
