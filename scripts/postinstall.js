const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const backupPath = path.join(__dirname, '..', 'packages.json.bak');

function postinstall() {
  if (fs.existsSync(backupPath)) {
    console.log('Restoring package.json from packages.json.bak...');
    fs.copyFileSync(backupPath, packageJsonPath);
    fs.unlinkSync(backupPath);
    console.log('Restored package.json and removed backup.');
  } else {
    console.log('No packages.json.bak backup found. Skipping restore.');
  }
}

postinstall();
