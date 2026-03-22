import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');

function updateFiles(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    
    if (stat.isDirectory()) {
      updateFiles(filepath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(filepath, 'utf-8');
      const updated = content.replace(/@clerk\/clerk-react/g, '@clerk/nextjs');
      
      if (updated !== content) {
        fs.writeFileSync(filepath, updated, 'utf-8');
        console.log(`✓ Updated ${filepath}`);
      }
    }
  }
}

updateFiles(srcDir);
console.log('Done! All @clerk/clerk-react imports updated to @clerk/nextjs');
