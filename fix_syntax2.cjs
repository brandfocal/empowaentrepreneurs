const fs = require('fs');
const path = require('path');

function fixSyntaxErrorsInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixSyntaxErrorsInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      let newContent = content.replace(/<button \} style=\{\{/g, '<button onClick={() => setOpenId(openId === cat.id ? "" : cat.id)} style={{');
      newContent = newContent.replace(/href="#" \}(?:\})? whileHover=\{\{/g, 'href="#" onClick={e => e.preventDefault()} whileHover={{');
      newContent = newContent.replace(/href="\#" \} whileHover=\{\{/g, 'href="#" onClick={e => e.preventDefault()} whileHover={{');

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        console.log(`Fixed syntax in ${fullPath}`);
      }
    }
  }
}

fixSyntaxErrorsInDir(path.join(__dirname, 'src/components'));
