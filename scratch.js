
const fs = require('fs');
const files = [
  'src/components/generated/AgencyLandingPage.tsx',
  'src/components/generated/AboutUsPage.tsx',
  'src/components/generated/ProgrammePage.tsx',
  'src/components/generated/ExperienceZones.tsx'
];
files.forEach(f => {
  console.log('--- ' + f + ' ---');
  const code = fs.readFileSync(f, 'utf8');
  const lines = code.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('Register Now') || l.includes('Partner With Us') || l.includes('minHeight: \'100vh\'')) {
      console.log((i+1) + ': ' + l.trim());
    }
  });
});

