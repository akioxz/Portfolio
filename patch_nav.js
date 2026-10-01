const fs = require('fs');
let code = fs.readFileSync('components/Navigation.tsx', 'utf8');

code = code.replace('import ContactModal from "./ContactModal";\n', '');

code = code.replace(
  '  const [isContactModalOpen, setIsContactModalOpen] = useState(false);\n',
  ''
);

code = code.replace(
  '    const handleOpenModal = () => setIsContactModalOpen(true);\n    window.addEventListener("openContactModal", handleOpenModal);\n    return () => window.removeEventListener("openContactModal", handleOpenModal);',
  '    const handleOpenModal = () => {\n      const el = document.getElementById("contact");\n      if (el) el.scrollIntoView({ behavior: "smooth" });\n    };\n    window.addEventListener("openContactModal", handleOpenModal);\n    return () => window.removeEventListener("openContactModal", handleOpenModal);'
);

code = code.replace(
  'onClick={() => setIsContactModalOpen(true)}',
  'onClick={() => window.dispatchEvent(new CustomEvent("openContactModal"))}'
);

code = code.replace(
  '      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />\n',
  ''
);

code = code.replace(
  '  const [isContactModalOpen, setIsContactModalOpen] = useState(false);\n',
  ''
);

code = code.replace(
  'onClick={() => setIsContactModalOpen(true)}',
  'onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent("openContactModal")); }}'
);

code = code.replace(
  '      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />\n',
  ''
);

fs.writeFileSync('components/Navigation.tsx', code);
console.log("Patched nav");
