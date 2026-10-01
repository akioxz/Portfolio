const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');
code = code.replace(
  'import Footer from "@/components/Footer";',
  'import Footer from "@/components/Footer";\nimport ContactSection from "@/components/ContactSection";'
);
code = code.replace(
  '<Footer />',
  '<ContactSection />\n        <Footer />'
);
fs.writeFileSync('app/page.tsx', code);
console.log("Patched page.tsx");
