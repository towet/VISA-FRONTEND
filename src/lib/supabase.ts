import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qbwuycspbjmqmlmvpwnt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFid3V5Y3NwYmptcW1sbXZwd250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwNjU0NDAsImV4cCI6MjA1MTY0MTQ0MH0.YuzWiQIKL9QzwZFAK99_Gfia6esTUEYL-SG9-BOCR9A';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
    fetch: (url, options) => {
      const finalOptions = {
        ...options,
        cache: 'no-cache',
        credentials: 'same-origin',
        mode: 'cors',
      };
      return fetch(url, finalOptions);
    },
  },
});
