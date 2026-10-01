const fs = require('fs');
let code = fs.readFileSync('components/ContactModal.tsx', 'utf8');
code = code.replace(
  'const prefersReducedMotion = useReducedMotion();',
  'const [showTurnstile, setShowTurnstile] = useState(false);\n  const prefersReducedMotion = useReducedMotion();'
);
code = code.replace(
  '  useEffect(() => {\n    setMounted(true);\n  }, []);',
  '  useEffect(() => {\n    setMounted(true);\n  }, []);\n\n  useEffect(() => {\n    if (isOpen) {\n      const t = setTimeout(() => setShowTurnstile(true), 300);\n      return () => clearTimeout(t);\n    } else {\n      setShowTurnstile(false);\n    }\n  }, [isOpen]);'
);
code = code.replace(
  '{siteKey && (',
  '{siteKey && showTurnstile && ('
);
fs.writeFileSync('components/ContactModal.tsx', code);
console.log("Patched");
