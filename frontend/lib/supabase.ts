import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables are not configured');
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
}
