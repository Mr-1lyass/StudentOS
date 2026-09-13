const SUPABASE_URL = 'https://xmynevhdbrrdmwwyvhfo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_drcO7qPquTmUYI67S7UTtw_NGuhMiDQ';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);