const fs = require('fs');

// 1. Navigation.tsx
let nav = fs.readFileSync('components/Navigation.tsx', 'utf8');
nav = nav.replace('{ label: "Experience", href: "/#experience" },\n', '');
nav = nav.replace('{ label: "Experience", href: "/#experience" },\r\n', '');
fs.writeFileSync('components/Navigation.tsx', nav);

// 2. page.tsx
let page = fs.readFileSync('app/page.tsx', 'utf8');
// We need to merge experienceData into projectsData
// But wait, the data comes from Supabase!
