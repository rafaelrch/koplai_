import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oaxjdnvwwwkmcgcmsvhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGpkbnZ3d3drbWNnY21zdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTY1OTAsImV4cCI6MjA2NjU3MjU5MH0.vTI-LaYD59BoloFaLBt_OTr7mh5659TaaDwuPUqa7PQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
