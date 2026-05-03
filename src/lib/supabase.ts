import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Singleton via globalThis — prevents duplicate clients on Vite HMR
const g = globalThis as unknown as { __supabase?: ReturnType<typeof createClient<Database>> }

export const supabase: ReturnType<typeof createClient<Database>> =
  g.__supabase ??
  (g.__supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        // Bypass Navigator Locks — the default implementation causes
        // NavigatorLockAcquireTimeoutError when multiple tabs compete for
        // the same lock key during initialization, breaking session recovery.
        lock: (_name, _acquireTimeout, fn) => fn(),
      },
    }
  ))
