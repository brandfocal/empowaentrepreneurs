const fs = require('fs');
const path = require('path');

function removeOnClick(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeOnClick(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Look for motion.a or a with href="/summit" or "/partnerships" and any onClick that just prevents default
      // A tag can span multiple lines.
      // So we use a regex to find all <a or <motion.a tags entirely up to their >
      const tagRegex = /<(a|motion\.a)\b([^>]+)>/g;
      
      let changed = false;
      let newContent = content.replace(tagRegex, (match, tag, attrs) => {
        if (attrs.includes('href="/summit"') || attrs.includes("href='/summit'") || attrs.includes('href="/partnerships"') || attrs.includes("href='/partnerships'")) {
          // It's a target link. Strip out any onClick that looks like e => e.preventDefault()
          let newAttrs = attrs.replace(/\bonClick=\{[^}]*e\.preventDefault\(\)[^}]*\}/g, '');
          if (newAttrs !== attrs) {
            changed = true;
            return `<${tag}${newAttrs}>`;
          }
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        console.log(`Fixed onClick in ${fullPath}`);
      }
    }
  }
}

removeOnClick(path.join(__dirname, 'src/components'));
