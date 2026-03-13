// ============================================================
//  supabaseClient.js — cliente Supabase singleton
// ============================================================
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://nlxhtmbgdkunfeukvkcj.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5seGh0bWJnZGt1bmZldWt2a2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzc1MzEsImV4cCI6MjA4ODgxMzUzMX0.1s6XEKPOpeE_DKu0fZFMoQ-ZTkB47ABfbTJWHXRmmRE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
