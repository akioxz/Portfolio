const fs = require('fs');
let c = fs.readFileSync('components/LayoutWrapper.tsx', 'utf8');

c = c.replace(/import \{ motion \} from "motion\/react";/, 'import { motion, AnimatePresence } from "motion/react";');

c = c.replace(/<MobileMenu \/>/, '<MobileMenu />\n        <AnimatePresence mode="wait">');

c = c.replace(/\{children\}\s*<\/motion.div>\s*<\/ReactLenisWrapper>/, '{children}\n        </motion.div>\n        </AnimatePresence>\n      </ReactLenisWrapper>');

fs.writeFileSync('components/LayoutWrapper.tsx', c);
