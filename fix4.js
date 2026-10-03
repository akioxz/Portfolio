const fs = require('fs');
let c = fs.readFileSync('components/Navigation.tsx', 'utf8');
c = c.replace(/window\.dispatchEvent\(new CustomEvent\("page-transition-start", \{ detail: \{ href: "\/" \} \}\)\);/g, 'router.push("/");');
c = c.replace(/window\.dispatchEvent\(new CustomEvent\("page-transition-start", \{ detail: \{ href \} \}\)\);/g, 'router.push(href);');
fs.writeFileSync('components/Navigation.tsx', c);
