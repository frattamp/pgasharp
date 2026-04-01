import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nkfwjwcwkgmwmiavzmvv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZndqd2N3a2dtd21pYXZ6bXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjk1NDcsImV4cCI6MjA5MDY0NTU0N30.EtpvOZi2GCX7eECrBvaaO5pb3rH5djeAjEme8U2JnjM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)