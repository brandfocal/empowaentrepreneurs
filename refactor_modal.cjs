const fs = require('fs');

let pitchPage = fs.readFileSync('./src/components/generated/PitchingFestivalPage.tsx', 'utf8');

// 1. Rename PitchApplicationModal to PitchApplicationSection
pitchPage = pitchPage.replace(
  /const PitchApplicationModal = \(\{[^}]+\}\) => \{/,
  'const PitchApplicationSection = () => {'
);

// 2. Remove the modal wrapper and AnimatePresence
let returnIndex = pitchPage.indexOf('  return <AnimatePresence>');
let innerDivIndex = pitchPage.indexOf('      <motion.div initial={{', returnIndex);

if (returnIndex !== -1 && innerDivIndex !== -1) {
  let sectionStart = `  return <section id="application-section" style={{
    padding: isMobile ? '64px 20px' : '120px 64px',
    background: '#0a0906',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  }}>`;
  
  pitchPage = pitchPage.substring(0, returnIndex) + sectionStart + '\n' + pitchPage.substring(innerDivIndex);
}

// 3. Remove the trailing </motion.div> and </AnimatePresence>
pitchPage = pitchPage.replace(
  /        <\/AnimatePresence>\s*<\/motion\.div>\s*<\/motion\.div>\s*<\/AnimatePresence>;\s*\};/g,
  '        </AnimatePresence>\n      </motion.div>\n    </section>;\n};\n'
);

// 4. Update the Close button inside the modal to do nothing or remove it entirely
pitchPage = pitchPage.replace(
  /        <button onClick=\{onClose\} style=\{\{[\s\S]*?<\/button>\s*<AnimatePresence mode="wait">/g,
  '        <AnimatePresence mode="wait">'
);

pitchPage = pitchPage.replace(
  /            <motion\.button whileHover=\{\{[\s\S]*?<\/motion\.button>\s*<\/motion\.div>\}/g,
  '            </motion.div>}'
);

// 5. Remove isModalOpen state and the modal from the render
pitchPage = pitchPage.replace('  const [isModalOpen, setIsModalOpen] = useState(false);\n', '');
pitchPage = pitchPage.replace(
  /      <CtaSection onOpenModal=\{[^\}]+\} \/>\s*\{isModalOpen && <PitchApplicationModal onClose=\{[^\}]+\} \/>\}/g,
  '      <PitchApplicationSection />\n      <CtaSection />'
);

// 6. Update CtaSection props and button action
pitchPage = pitchPage.replace(
  'const CtaSection = ({ onOpenModal }: { onOpenModal: () => void }) => {',
  'const CtaSection = () => {'
);

pitchPage = pitchPage.replace(
  /            \{CTA_CARDS\.map\(\(card, i\) => <motion\.div onClick=\{[^\}]+\} key=\{card\.id\}/g,
  '            {CTA_CARDS.map((card, i) => <motion.div onClick={() => { if (card.id === \'cta-pitch\') document.getElementById(\'application-section\')?.scrollIntoView({ behavior: \'smooth\' }); }} key={card.id}'
);

fs.writeFileSync('./src/components/generated/PitchingFestivalPage.tsx', pitchPage, 'utf8');
console.log('Done refactoring modal to section.');
