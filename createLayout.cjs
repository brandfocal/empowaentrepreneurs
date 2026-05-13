const fs = require('fs');

const code = fs.readFileSync('src/components/generated/AgencyLandingPage.tsx', 'utf8');

function extract(name) {
  const regex = new RegExp('const ' + name + ' = [\\s\\S]*?(?=\\nconst |\\nexport )');
  const match = code.match(regex);
  if (match) return match[0];
  return '';
}

const imports = `import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/use-mobile';
import { Link } from 'react-router-dom';
`;

const icons = extract('PlusSquareIcon') + '\n' + extract('PlusSquareIconLight') + '\n' + extract('ArrowIconDark');
const navConstants = extract('STICKY_NAV_ITEMS');
const footerConstants = extract('FOOTER_NAV_COLS') + '\n' + extract('FOOTER_LEGAL');
const progress = extract('ScrollProgressBar');
const nav = extract('StickyNav');
const social = extract('SocialIcon');
const footer = extract('SiteFooter');

const layout = `
${imports}

${icons}

${navConstants}

${footerConstants}

${progress}

${nav}

${social}

${footer}

export const UniversalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <ScrollProgressBar />
      <StickyNav />
      <main style={{ flex: 1, width: '100%' }}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};
`;

fs.mkdirSync('src/components/layout', { recursive: true });
fs.writeFileSync('src/components/layout/UniversalLayout.tsx', layout);
