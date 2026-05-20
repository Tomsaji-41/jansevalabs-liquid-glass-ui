const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];

const REPLACEMENTS = [
  { regex: /text-\[\#0B1F4E\]/g, replace: "text-white/95" },
  { regex: /bg-\[\#F0FFF5\]/g, replace: "bg-[#2DB549]/10" },
  { regex: /bg-\[\#F8FAFC\]/g, replace: "bg-white/5" },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of REPLACEMENTS) {
        content = content.replace(rule.regex, rule.replace);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of DIRECTORIES) {
  const fullDirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullDirPath)) {
    processDirectory(fullDirPath);
  }
}

console.log("Fix replacement complete.");
