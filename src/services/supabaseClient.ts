import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://vlnvdfijtlmzhhfyfyqi.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_SQyjxC24_qhUGZHu662kPQ_lrkyQbk-';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
