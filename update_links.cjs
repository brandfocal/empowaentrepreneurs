const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      // We'll replace instances where href="#" onClick={e => e.preventDefault()} or href="#" is used
      // in the same tag that eventually contains "Partner With Us" or "Reserve Your Power Seat".
      // A safe way is to split by "Partner With Us" and "Reserve Your Power Seat" and look backwards to the closest <a or <motion.a or <Link
      
      const searchTerms = ['Partner With Us', 'Reserve Your Power Seat'];
      for (const term of searchTerms) {
        let parts = content.split(term);
        if (parts.length > 1) {
          for (let i = 0; i < parts.length - 1; i++) {
            // Find the last <a, <motion.a, or <Link before this term
            let prev = parts[i];
            let aIdx = Math.max(prev.lastIndexOf('<a '), prev.lastIndexOf('<motion.a '), prev.lastIndexOf('<Link '));
            if (aIdx !== -1) {
              // Now replace href="#" or to="#" with href="/partnerships"
              let tagContext = prev.substring(aIdx);
              if (tagContext.includes('href="#"')) {
                let updatedTagContext = tagContext.replace('href="#"', 'href="/partnerships"').replace('onClick={e => e.preventDefault()}', '');
                parts[i] = prev.substring(0, aIdx) + updatedTagContext;
                changed = true;
              } else if (tagContext.includes('to="#"')) {
                let updatedTagContext = tagContext.replace('to="#"', 'to="/partnerships"');
                parts[i] = prev.substring(0, aIdx) + updatedTagContext;
                changed = true;
              }
            }
          }
          content = parts.join(term);
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src/components'));
