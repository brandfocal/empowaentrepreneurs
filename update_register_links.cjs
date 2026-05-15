const fs = require('fs');
const path = require('path');

function replaceRegisterNowInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceRegisterNowInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      const searchTerms = ['Register Now'];
      for (const term of searchTerms) {
        let parts = content.split(term);
        if (parts.length > 1) {
          for (let i = 0; i < parts.length - 1; i++) {
            let prev = parts[i];
            let aIdx = Math.max(prev.lastIndexOf('<a '), prev.lastIndexOf('<motion.a '), prev.lastIndexOf('<Link '));
            if (aIdx !== -1 && prev.length - aIdx < 500) { // arbitrary safe distance check
              let tagContext = prev.substring(aIdx);
              if (tagContext.includes('href="#"')) {
                let updatedTagContext = tagContext.replace('href="#"', 'href="/summit"').replace('onClick={e => e.preventDefault()}', '');
                parts[i] = prev.substring(0, aIdx) + updatedTagContext;
                changed = true;
              } else if (tagContext.includes('to="#"')) {
                let updatedTagContext = tagContext.replace('to="#"', 'to="/summit"');
                parts[i] = prev.substring(0, aIdx) + updatedTagContext;
                changed = true;
              } else if (tagContext.includes('href="') && !tagContext.includes('href="/summit"')) {
                 let updatedTagContext = tagContext.replace(/href="[^"]*"/, 'href="/summit"').replace('onClick={e => e.preventDefault()}', '');
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

replaceRegisterNowInDir(path.join(__dirname, 'src/components'));
