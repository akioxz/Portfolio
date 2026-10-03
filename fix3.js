const fs = require('fs');
let c = fs.readFileSync('app/layout.tsx', 'utf8');
c = c.replace(/import PageTransition from '@\/components\/PageTransition';\n?/g, '');
c = c.replace(/<PageTransition \/>\n?\s*/g, '');
fs.writeFileSync('app/layout.tsx', c);
