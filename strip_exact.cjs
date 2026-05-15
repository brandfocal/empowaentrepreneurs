const fs = require('fs');
const path = require('path');

function stripExactOnClick(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      stripExactOnClick(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // We know the exact string that is causing issues
      const searchString = 'onClick={e => e.preventDefault()}';
      
      // Let's only remove it if it's on the same line or right next to a motion.a or a tag with a real href, 
      // but honestly just removing it completely is safer than broken regexes.
      
      if (content.includes(searchString)) {
        // Let's make sure we only replace it when it's part of a link that goes to /summit or /partnerships
        // Actually, let's just do a regex that finds:
        // href="/summit" onClick={e => e.preventDefault()}
        // href="/partnerships" onClick={e => e.preventDefault()}
        // onClick={e => e.preventDefault()} whileHover={{...}}
        
        let changed = false;
        
        // case 1: href before onClick
        const regex1 = /(href=["']\/(?:summit|partnerships)["'])\s*onClick=\{e\s*=>\s*e\.preventDefault\(\)\}/g;
        content = content.replace(regex1, (match, p1) => {
          changed = true;
          return p1;
        });

        // case 2: onClick before href
        const regex2 = /onClick=\{e\s*=>\s*e\.preventDefault\(\)\}\s*(href=["']\/(?:summit|partnerships)["'])/g;
        content = content.replace(regex2, (match, p1) => {
          changed = true;
          return p1;
        });
        
        // case 3: User diffs show: <motion.a href="/summit" onClick={e => e.preventDefault()}
        // The first regex catches this exactly!

        if (changed) {
          fs.writeFileSync(fullPath, content, 'utf-8');
          console.log(`Fixed exact onClick in ${fullPath}`);
        }
      }
    }
  }
}

stripExactOnClick(path.join(__dirname, 'src/components'));
