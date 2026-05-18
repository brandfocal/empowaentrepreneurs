import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src', 'components', 'generated');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Replace em-dash and en-dash
    content = content.replace(/([a-zA-Z0-9"'])\s+[—–]\s+([a-zA-Z])/g, '$1: $2');
    content = content.replace(/([a-zA-Z0-9"'])[—–]([a-zA-Z])/g, '$1: $2');
    content = content.replace(/([a-zA-Z0-9"'])[—–]\s+([a-zA-Z])/g, '$1: $2');
    content = content.replace(/([a-zA-Z0-9"'])\s+[—–]([a-zA-Z])/g, '$1: $2');
    
    // For standalone hyphens acting as em-dashes ` - `
    // Look for (Letter or Quote) (Space) (-) (Space) (Letter)
    // Exclude math keywords: clientX, clientY, index, calc
    content = content.replace(/([a-zA-Z"'])\s+-\s+([a-zA-Z])/g, (match, p1, p2, offset, string) => {
        const contextBefore = string.substring(Math.max(0, offset - 10), offset + 1);
        const contextAfter = string.substring(offset + 4, offset + 15);
        
        // Exclude math and known false positives
        if (contextBefore.includes('clientX') || contextBefore.includes('clientY') || contextBefore.includes('index')) {
            return match;
        }
        
        // If it looks like text, replace with a colon
        return `${p1}: ${p2}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated', path.basename(filePath));
    }
}

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
files.forEach(f => processFile(path.join(componentsDir, f)));
