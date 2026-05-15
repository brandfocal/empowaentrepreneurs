const fs = require('fs');
const path = require('path');

function removePreventDefaultInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removePreventDefaultInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // We want to remove onClick={...} from any <a or <motion.a or <Link that has href="/summit" or href="/partnerships"
      // A tag might span multiple lines, so we use [\s\S]
      const regex = /<(a|motion\.a|Link)([\s\S]*?(?:href=["']\/summit["']|href=["']\/partnerships["'])[\s\S]*?)>/g;
      
      let changed = false;
      let newContent = content.replace(regex, (match, p1, p2) => {
        // remove onClick={anything} 
        let cleanedP2 = p2.replace(/onClick=\{[^}]*\}/g, '');
        if (cleanedP2 !== p2) changed = true;
        return `<${p1}${cleanedP2}>`;
      });
      
      // Also catch cases where href comes after onClick
      const regex2 = /<(a|motion\.a|Link)([^>]*?onClick=\{[^}]*\}[^>]*?(?:href=["']\/summit["']|href=["']\/partnerships["'])[^>]*?)>/g;
      newContent = newContent.replace(regex2, (match, p1, p2) => {
        let cleanedP2 = p2.replace(/onClick=\{[^}]*\}/g, '');
        if (cleanedP2 !== p2) changed = true;
        return `<${p1}${cleanedP2}>`;
      });

      if (changed) {
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        console.log(`Updated onClick in ${fullPath}`);
      }
    }
  }
}

removePreventDefaultInDir(path.join(__dirname, 'src/components'));
