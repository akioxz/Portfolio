const fs = require('fs');

const pages = [
  'app/admin/(dashboard)/projects/page.tsx',
  'app/admin/(dashboard)/experience/page.tsx',
  'app/admin/(dashboard)/certifications/page.tsx',
  'app/admin/(dashboard)/stack/page.tsx'
];

pages.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace max-w-5xl mx-auto with w-full
    content = content.replace(/max-w-5xl mx-auto/g, 'w-full max-w-screen-xl');
    fs.writeFileSync(file, content);
  }
});

let inboxFile = 'app/admin/(dashboard)/inbox/InboxClient.tsx';
if (fs.existsSync(inboxFile)) {
  let content = fs.readFileSync(inboxFile, 'utf8');
  content = content.replace(/max-w-4xl mx-auto/g, 'w-full max-w-screen-xl');
  fs.writeFileSync(inboxFile, content);
}
console.log("Removed mx-auto center alignments");
