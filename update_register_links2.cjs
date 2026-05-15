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

      const regex = /<(?:a|motion\.a|Link)\b([^>]*?)>([\s\S]*?)<\/(?:a|motion\.a|Link)>/g;
      
      content = content.replace(regex, (match, attrs, inner) => {
        if (inner.includes('Register Now')) {
          if (attrs.includes('href="#"') || attrs.includes("href='#'") || attrs.includes('to="#"') || attrs.includes("to='#'")) {
            changed = true;
            let newAttrs = attrs.replace(/href=['"]#['"]/, 'href="/summit"')
                                .replace(/to=['"]#['"]/, 'to="/summit"')
                                .replace(/onClick=\{e\s*=>\s*e\.preventDefault\(\)\}/g, '');
            return match.replace(attrs, newAttrs);
          }
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceRegisterNowInDir(path.join(__dirname, 'src/components'));
