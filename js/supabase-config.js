// ===================================
// SUPABASE CONFIGURATION
// ===================================

// Initialize Supabase client
const SUPABASE_URL = 'https://xxnqykwinpjqsuhlnrlv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bnF5a3dpbnBqcXN1aGxucmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzc4MjMsImV4cCI6MjA3NTY1MzgyM30.QnYcMZS-Jz6rsmhZa07lv9m0EFEoMPGGhM165frewJI';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ Supabase connected successfully!');
