import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let initAttempted = false;

/**
 * Returns the Supabase client if configured, or null if env vars are missing.
 * This allows the app to gracefully degrade to localStorage-only mode.
 */
export function getSupabaseClient(): SupabaseClient | null {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    if (initAttempted) {
        return null; // Already tried and failed
    }

    initAttempted = true;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase not configured. Using localStorage fallback.');
        return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

// Legacy export for backward compatibility - will throw at runtime if env vars missing
export const supabase = typeof window !== 'undefined'
    ? getSupabaseClient()
    : (null as unknown as SupabaseClient);

export interface Invoice {
    id: number;
    created_at: string;
    invoice_id: string; // The NFT token ID or internal ID
    vendor_name: string;
    client_name: string;
    amount: number;
    currency: string;
    due_date: string;
    risk_score: number;
    grade: string;
    deploy_hash: string;
    ipfs_url: string;
    funding_status: 'available' | 'funded';
    investor_deploy_hash?: string;
    investor_address?: string;
    funded_at?: string;
    yield_rate?: string;
    term_days?: string;
}
