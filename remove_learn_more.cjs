const fs = require('fs');
const path = require('path');

function removeLearnMoreInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeLearnMoreInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Match the pattern of the Learn More button in StickyRegistrationBanner
      // It starts with {!isMobile && <motion.a and ends with <span>Learn More</span>\n          </motion.a>}
      // We'll use a regex
      const regex = /\{!isMobile && <motion\.a[^>]*?whileHover[^>]*?>[\s\S]*?<span>Learn More<\/span>\s*<\/motion\.a>\}/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Removed Learn More from ${fullPath}`);
      }
    }
  }
}

removeLearnMoreInDir(path.join(__dirname, 'src/components'));
