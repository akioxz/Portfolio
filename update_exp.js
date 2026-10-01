const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
});

// Use service role key to bypass RLS
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const r1 = await supabase.from('experience').update({ subtitle: 'Academic Project: Multi-System Podcast Platform' }).eq('project', 'Reson8');
  console.log("R1", r1.error);
  
  const r2 = await supabase.from('experience').update({ subtitle: 'Academic Project: Smart Campus Student Attendance' }).eq('project', 'SCSAGA');
  console.log("R2", r2.error);
  
  const r3 = await supabase.from('experience').update({ subtitle: 'Academic Project: Sales Dashboard & ETL' }).eq('project', 'Water Station Dashboard');
  console.log("R3", r3.error);
  
  console.log("Updated via Service Role!");
}
run();
