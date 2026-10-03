const fs = require('fs');
let c = fs.readFileSync('components/Projects.tsx', 'utf8');
c = c.replace(/<Link \n            href="\/projects"/g, '<Link \n            href="/projects"\n            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("page-transition-start", { detail: { href: "/projects" } })); }}');
fs.writeFileSync('components/Projects.tsx', c);
