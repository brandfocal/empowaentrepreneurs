import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src', 'components', 'generated');
const layoutFile = path.join(__dirname, 'src', 'components', 'layout', 'UniversalLayout.tsx');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Check if Link is imported
    if (!content.includes('import { Link }') && !content.includes('import { Link,')) {
        if (content.includes(`from 'react-router-dom'`)) {
            content = content.replace(/import \{(.*?)\} from 'react-router-dom'/, "import { Link, $1 } from 'react-router-dom'");
        } else {
            content = `import { Link } from 'react-router-dom';\n` + content;
        }
    }

    // Fix <a href="/something" ...> to <Link to="/something" ...>
    content = content.replace(/<a\s+href="(\/[^"]*)"/g, '<Link to="$1"');
    content = content.replace(/<\/a>/g, '</Link>');

    // Replace <motion.a href="/..." with <Link to="/..."><motion.div
    content = content.replace(/<motion\.a\s+href="(\/[^"]*)"/g, '<Link to="$1" style={{textDecoration: "none", display: "inline-block"}}><motion.div');
    content = content.replace(/<\/motion\.a>/g, '</motion.div></Link>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated', filePath);
    }
}

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
files.forEach(f => processFile(path.join(componentsDir, f)));
processFile(layoutFile);
