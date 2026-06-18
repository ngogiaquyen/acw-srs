const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const newContent = content
    .replace(/Người thuê/g, 'Chủ trạm')
    .replace(/người thuê/g, 'chủ trạm');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walk(filePath);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        replaceInFile(filePath);
      }
    }
  }
}

walk(path.join(__dirname, 'app'));
walk(path.join(__dirname, 'components'));
walk(path.join(__dirname, 'lib'));

console.log('Done replacing.');
