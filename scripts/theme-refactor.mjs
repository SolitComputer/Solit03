import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

const REPLACEMENTS = [
  // Backgrounds
  { from: /\bbg-white\b/g, to: 'bg-surface' },
  { from: /\bbg-slate-50\b/g, to: 'bg-surface-muted' },
  { from: /\bbg-gray-50\b/g, to: 'bg-surface-muted' },
  
  // Texts
  { from: /\btext-slate-900\b/g, to: 'text-content' },
  { from: /\btext-gray-900\b/g, to: 'text-content' },
  { from: /\btext-slate-800\b/g, to: 'text-content' },
  { from: /\btext-gray-800\b/g, to: 'text-content' },
  
  { from: /\btext-slate-700\b/g, to: 'text-content-soft' },
  { from: /\btext-gray-700\b/g, to: 'text-content-soft' },
  { from: /\btext-slate-600\b/g, to: 'text-content-soft' },
  { from: /\btext-gray-600\b/g, to: 'text-content-soft' },
  
  { from: /\btext-slate-500\b/g, to: 'text-content-muted' },
  { from: /\btext-gray-500\b/g, to: 'text-content-muted' },
  { from: /\btext-slate-400\b/g, to: 'text-content-muted' },
  { from: /\btext-gray-400\b/g, to: 'text-content-muted' },

  // Borders
  { from: /\bborder-slate-300\b/g, to: 'border-border' },
  { from: /\bborder-gray-300\b/g, to: 'border-border' },
  { from: /\bborder-slate-200\b/g, to: 'border-border' },
  { from: /\bborder-gray-200\b/g, to: 'border-border' },
  { from: /\bborder-slate-100\b/g, to: 'border-border' },
  { from: /\bborder-gray-100\b/g, to: 'border-border' },
  { from: /\bborder-slate-50\b/g, to: 'border-border' },
  { from: /\bborder-gray-50\b/g, to: 'border-border' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const rule of REPLACEMENTS) {
        if (rule.from.test(content)) {
          content = content.replace(rule.from, rule.to);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(SRC_DIR);
console.log('Mass refactor completed.');
