import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientSrcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Primary colors
  content = content.replace(/#963991/g, 'var(--primary-main)');
  content = content.replace(/150,57,145/g, 'var(--primary-rgb)');
  content = content.replace(/#c060bb/g, 'var(--primary-light)');
  content = content.replace(/#b84db3/g, 'var(--primary-light-alt)');
  content = content.replace(/#7a2d75/g, 'var(--primary-dark)');
  
  // Text colors
  content = content.replace(/#1a1a2e/g, 'var(--text-primary)');
  content = content.replace(/#888/g, 'var(--text-secondary)');
  content = content.replace(/#999/g, 'var(--text-secondary)');
  content = content.replace(/#aaa/g, 'var(--text-secondary)');
  content = content.replace(/#bbb/g, 'var(--text-secondary)');
  
  // Gradients
  content = content.replace(/#faf5ff/g, 'var(--bg-gradient-1)');
  content = content.replace(/#fdf4ff/g, 'var(--bg-gradient-2)');
  content = content.replace(/#f3e8ff/g, 'var(--bg-gradient-3)');
  content = content.replace(/#ede9fe/g, 'var(--bg-gradient-3)');

  // Paper/Glass backgrounds
  content = content.replace(/255, 255, 255/g, 'var(--bg-paper-rgb)');
  content = content.replace(/255,255,255/g, 'var(--bg-paper-rgb)');
  content = content.replace(/'white'/g, "'var(--bg-paper-solid)'");

  fs.writeFileSync(filePath, content, 'utf8');
}

walkDir(clientSrcDir, processFile);
console.log('Replacement complete.');
