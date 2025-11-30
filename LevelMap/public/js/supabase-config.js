// Supabase Configuration
const SUPABASE_URL = 'https://xierzrkqijhymluffqyl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZXJ6cmtxaWpoeW1sdWZmcXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDIzNDEsImV4cCI6MjA4MDAxODM0MX0.n1iMrNmtIqrUiFvolu2Tm_d0wLfvEydsfwk5xiGwHEI';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

