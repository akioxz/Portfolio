const fs = require('fs');
let code = fs.readFileSync('components/Projects.tsx', 'utf8');

code = code.replace(
  'import { useUISounds } from "@/hooks/useUISounds";',
  'import { useUISounds } from "@/hooks/useUISounds";\nimport { useMediaQuery } from "@/hooks/useMediaQuery";'
);

code = code.replace(
  'const { playHover, playClick } = useUISounds();',
  'const { playHover, playClick } = useUISounds();\n  const isMobile = useMediaQuery("(max-width: 640px)");'
);

const oldVariants = `            const variants = {
              center: { 
                x: "0%", y: "0%", scale: 1, rotateY: 0, rotateZ: 0, zIndex: 30, opacity: 1 
              },
              left: { 
                x: "-65%", y: "5%", scale: 0.88, rotateY: 15, rotateZ: -6, zIndex: 10, opacity: 0.4 
              },
              right: { 
                x: "65%", y: "5%", scale: 0.88, rotateY: -15, rotateZ: 6, zIndex: 20, opacity: 0.4 
              },
              centerHover: { 
                y: "-4%", scale: 1.02, opacity: 1 
              },
              leftHover: { 
                x: "-72%", y: "2%", scale: 0.92, rotateY: 10, rotateZ: -8, opacity: 0.85 
              },
              rightHover: { 
                x: "72%", y: "2%", scale: 0.92, rotateY: -10, rotateZ: 8, opacity: 0.85 
              },
            };`;

const newVariants = `            const variants = {
              center: { 
                x: "0%", y: "0%", scale: 1, rotateY: 0, rotateZ: 0, zIndex: 30, opacity: 1 
              },
              left: isMobile ? {
                x: "-15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: -4, zIndex: 10, opacity: 0
              } : { 
                x: "-65%", y: "5%", scale: 0.88, rotateY: 15, rotateZ: -6, zIndex: 10, opacity: 0.4 
              },
              right: isMobile ? {
                x: "15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: 4, zIndex: 20, opacity: 0
              } : { 
                x: "65%", y: "5%", scale: 0.88, rotateY: -15, rotateZ: 6, zIndex: 20, opacity: 0.4 
              },
              centerHover: { 
                y: isMobile ? "0%" : "-4%", scale: isMobile ? 1 : 1.02, opacity: 1 
              },
              leftHover: isMobile ? {
                x: "-15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: -4, zIndex: 10, opacity: 0
              } : { 
                x: "-72%", y: "2%", scale: 0.92, rotateY: 10, rotateZ: -8, opacity: 0.85 
              },
              rightHover: isMobile ? {
                x: "15%", y: "0%", scale: 0.85, rotateY: 0, rotateZ: 4, zIndex: 20, opacity: 0
              } : { 
                x: "72%", y: "2%", scale: 0.92, rotateY: -10, rotateZ: 8, opacity: 0.85 
              },
            };`;

code = code.replace(oldVariants, newVariants);
fs.writeFileSync('components/Projects.tsx', code);
console.log("Patched Projects.tsx");
