const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: exp } = await supabase.from('experience').select('id, project, sort_order').order('sort_order');
  const { data: proj } = await supabase.from('projects').select('id, title, sort_order').order('sort_order');
  console.log("Experiences:", exp);
  console.log("Projects:", proj);
}
run();
