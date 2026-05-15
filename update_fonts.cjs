const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/generated');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace fontFamily inside any <hX or <motion.hX tags
  // We'll use a regex that looks for <h or <motion.h followed by anything up to fontFamily: 'Inter...
  // Since JS regex doesn't support infinite lookbehind, we can just replace it iteratively
  
  // A simple way is to match the tag open, then any characters (non-greedy) until fontFamily: '...',
  // but only if there's no closing > in between.
  
  let modified = false;
  
  // This matches <h1 ... > or <motion.h1 ... > and replaces Inter with Montserrat
  // Since style={{...}} is inside the opening tag, we can look for:
  // /<(h[1-6]|motion\.h[1-6])[^>]*?fontFamily:\s*['"](?:Inter|Outfit)[^'"]*['"]/g
  // Wait, [^>] will stop at a >. But arrow functions inside onClick e.g. onClick={() => ...} have >!
  // So [^>] might fail.
  
  // Alternative: just find all `fontFamily: 'Inter, sans-serif'` and `fontFamily: 'Outfit, sans-serif'`
  // Let's just find headers by finding font sizes that are large, e.g. > 18px. But that's complicated.
  
  // Let's use a simpler regex: replace all 'Inter' and 'Outfit' with 'Montserrat' inside any style block
  // that belongs to an h1, h2, h3, h4, h5, h6 tag.
  const regex = /(<(?:h[1-6]|motion\.h[1-6])\b[\s\S]*?>)/g;
  
  content = content.replace(regex, (match) => {
    if (match.includes('fontFamily: \'Inter, sans-serif\'') || match.includes('fontFamily: "Inter, sans-serif"')) {
      modified = true;
      return match.replace(/fontFamily:\s*['"]Inter,\s*sans-serif['"]/g, "fontFamily: 'Montserrat, sans-serif'");
    }
    if (match.includes('fontFamily: \'Outfit, sans-serif\'') || match.includes('fontFamily: "Outfit, sans-serif"')) {
      modified = true;
      return match.replace(/fontFamily:\s*['"]Outfit,\s*sans-serif['"]/g, "fontFamily: 'Montserrat, sans-serif'");
    }
    return match;
  });

  // What about pseudo-headers? The user said "from Hero section to section header".
  // Section headers often say "Our Mission" or something.
  // Let's also look for textTransform: 'uppercase' with letterSpacing, those are sub-headers.
  // Actually, I'll just change the h1-h6 tags for now, and see if it covers it.
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done.');
