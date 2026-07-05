const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const backupPath = path.join(__dirname, '..', 'packages.json.bak');

function preinstall() {
  const ergogenVersion = process.env.ERGOGEN_VERSION;
  if (!ergogenVersion) {
    console.log(
      'ERGOGEN_VERSION env variable is not set. Skipping preinstall patch.'
    );
    return;
  }

  console.log(`ERGOGEN_VERSION is set to: ${ergogenVersion}`);

  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found!');
    return;
  }

  // Read and parse package.json
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  if (packageJson.dependencies && packageJson.dependencies.ergogen) {
    if (packageJson.dependencies.ergogen === ergogenVersion) {
      console.log(
        `ergogen dependency in package.json is already set to ${ergogenVersion}. No patch needed.`
      );
      // If a leftover backup exists from a matching version (e.g. failed prior run), clean it up
      if (fs.existsSync(backupPath)) {
        console.log('Cleaning up leftover packages.json.bak...');
        fs.unlinkSync(backupPath);
      }
      return;
    }

    // If backup already exists, restore it first to start from a clean state before patching again
    if (fs.existsSync(backupPath)) {
      console.log(
        'Backup file packages.json.bak already exists. Restoring to start from clean state.'
      );
      fs.copyFileSync(backupPath, packageJsonPath);
    } else {
      // Back up the original package.json
      console.log('Backing up package.json to packages.json.bak...');
      fs.copyFileSync(packageJsonPath, backupPath);
    }

    console.log(
      `Temporarily patching ergogen dependency in package.json to: ${ergogenVersion}`
    );
    packageJson.dependencies.ergogen = ergogenVersion;

    // Write back modified package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf8'
    );
  } else {
    console.warn(
      'Dependency "ergogen" not found in package.json. Skipping modification.'
    );
  }
}

preinstall();
