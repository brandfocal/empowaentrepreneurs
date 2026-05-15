const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/generated');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let globalModified = false;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace all Outfit with Montserrat globally, because Outfit is usually a display font used for headings
  // and the user specifically requested Montserrat.
  let newContent = content.replace(/fontFamily:\s*['"]Outfit,\s*sans-serif['"]/g, "fontFamily: 'Montserrat, sans-serif'");
  
  // Replace Inter with Montserrat for ANY large font size or uppercase header-like styles.
  // We'll search for style={{ ... }} blocks and check their contents.
  const styleRegex = /style=\{\{([\s\S]*?)\}\}/g;
  
  newContent = newContent.replace(styleRegex, (match, innerStyles) => {
    // If it has Inter
    if (innerStyles.includes('Inter')) {
      // Is it a header? 
      // Heuristics for a header:
      // 1. fontSize is clamp(...) with max size > 24px
      // 2. fontSize is '...px' with size >= 24px
      // 3. textTransform is uppercase and letterSpacing is large (section subheaders)
      // 4. fontWeight is 700 or 800
      
      let isHeader = false;
      
      if (/fontSize:\s*['"]clamp\([^,]*,[^,]*,\s*([2-9]\d|\d{3})px\)/.test(innerStyles)) {
        isHeader = true;
      } else if (/fontSize:\s*['"](?:isMobile\s*\?\s*['"][^'"]*['"]\s*:\s*)?['"]([2-9]\d|\d{3})px['"]/.test(innerStyles)) {
        const match = innerStyles.match(/fontSize:\s*['"](?:isMobile\s*\?\s*['"][^'"]*['"]\s*:\s*)?['"]([2-9]\d|\d{3})px['"]/);
        if (match && parseInt(match[1]) >= 24) isHeader = true;
      } else if (/textTransform:\s*['"]uppercase['"]/.test(innerStyles) && /letterSpacing:\s*['"]0\.\d+em['"]/.test(innerStyles) && /fontWeight:\s*(500|600|700)/.test(innerStyles)) {
        isHeader = true;
      }
      
      if (isHeader) {
        return match.replace(/['"]Inter,\s*sans-serif['"]/g, "'Montserrat, sans-serif'");
      }
    }
    return match;
  });
  
  // Also fix any <h1-h6> tags that STILL have Inter.
  const hRegex = /(<(?:h[1-6]|motion\.h[1-6])\b[^>]*>)/g;
  newContent = newContent.replace(hRegex, (match) => {
    return match.replace(/['"]Inter,\s*sans-serif['"]/g, "'Montserrat, sans-serif'");
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated pseudo-headers in ${file}`);
    globalModified = true;
  }
});

if (!globalModified) {
  console.log('No additional heading fonts needed updating.');
}
