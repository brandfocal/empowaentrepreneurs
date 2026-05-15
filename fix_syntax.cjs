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
      
      // The broken syntax looks like: href="#" } style={{
      // or to="#" } style={{
      
      let newContent = content.replace(/href="#" \}(?:\})? style=\{\{/g, 'href="#" onClick={e => { e.preventDefault(); setMobileMenuOpen(false); }} style={{');
      
      // Let's also check for FundingSummitPage.tsx which had some other errors at 2515
      // FundingSummitPage.tsx(2515,13): error TS1109: Expression expected.
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf-8');
        console.log(`Fixed syntax in ${fullPath}`);
      }
    }
  }
}

fixSyntaxErrorsInDir(path.join(__dirname, 'src/components'));
