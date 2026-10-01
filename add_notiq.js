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
  const newProject = {
    name: "Notiq",
    eyebrow: "AI Note-taking App",
    description: "An AI-powered note-taking app for students featuring voice transcription via Whisper API and automated quiz generation with Claude.",
    tags: ["React Native", "Expo", "Supabase", "OpenAI", "Claude"],
    specs: [
      { label: "Role", value: "Solo Developer" },
      { label: "Type", value: "Academic Project" },
      { label: "Platform", value: "iOS / Android" }
    ],
    sort_order: 2
  };
  
  const { data, error } = await supabase.from('projects').insert(newProject);
  console.log("Error:", error);
  console.log("Success! Added Notiq");
}
run();
