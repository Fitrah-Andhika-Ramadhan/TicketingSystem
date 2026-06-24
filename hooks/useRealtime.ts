import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Buat client hanya jika env vars tersedia (menghindari error saat Vercel build/prerender)
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export function useRealtime(
  table: string,
  onUpdate: (payload: any) => void,
  filter?: string
) {
  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase URL or Anon Key missing. Realtime disabled.');
      return;
    }

    let channel = supabase
      .channel(`realtime_${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table, filter: filter },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onUpdate, filter]);
}
