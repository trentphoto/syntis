import { createClient } from "./server";

export type UserRoleRow = { role: string | null; assigned_at: string | null; is_active: boolean | null };

export async function getUserRoleFromSession() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    return null;
  }

  const claims = data.claims as Record<string, any>;
  const userId = claims?.sub ?? claims?.user_id ?? claims?.userId ?? null;
  if (!userId) {
    return null;
  }

  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role, assigned_at, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (roleError) {
    return null;
  }

  return (roleData as unknown) as UserRoleRow | null;
}
