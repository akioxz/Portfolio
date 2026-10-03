const fs = require('fs');
let c = fs.readFileSync('components/LayoutWrapper.tsx', 'utf8');

c = c.replace(/initial=\{\{ opacity: 0 \}\}/, 'initial={{ opacity: 0, y: 20 }}');
c = c.replace(/animate=\{\{ opacity: 1 \}\}/, 'animate={{ opacity: 1, y: 0 }}\n          exit={{ opacity: 0, y: 20 }}');
c = c.replace(/transition=\{\{ duration: 0.3, ease: \[0.22, 1, 0.36, 1\] \}\}/, 'transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}');

fs.writeFileSync('components/LayoutWrapper.tsx', c);
