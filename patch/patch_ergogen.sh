#!/bin/sh
# Pull @ceoloide and @infused-kim footprint libraries

# Backup original Git configuration for GitHub insteadOf
original_instead_of=$(git config --global --get-all url."https://github.com/".insteadOf 2>/dev/null)

# Cleanup function to restore original configuration
cleanup() {
  echo "Restoring original Git configuration..."
  git config --global --unset-all url."https://github.com/".insteadOf 2>/dev/null || true
  if [ -n "$original_instead_of" ]; then
    printf "%s\n" "$original_instead_of" | while read -r val; do
      if [ -n "$val" ]; then
        git config --global --add url."https://github.com/".insteadOf "$val"
      fi
    done
  fi
}

# Ensure original configuration is restored on exit (success or failure)
trap cleanup EXIT INT TERM

# Configure Git to use HTTPS for GitHub
git config --global --unset-all url."https://github.com/".insteadOf 2>/dev/null || true
git config --global --add url."https://github.com/".insteadOf "ssh://git@github.com/"
git config --global --add url."https://github.com/".insteadOf "git+ssh://git@github.com/"
git config --global --add url."https://github.com/".insteadOf "git@github.com:"

if [ -n "$ERGOGEN_VERSION" ]; then
  echo "Installing Ergogen version $ERGOGEN_VERSION..."
  PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm add "$ERGOGEN_VERSION" --registry=https://registry.npmjs.org
elif [ ! -d node_modules/ergogen ]; then
  echo "Installing Ergogen..."
  PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm add ergogen --registry=https://registry.npmjs.org
fi

if [ -d node_modules/ergogen ]; then
  echo "Patching Ergogen..."
  if [ -d node_modules/ergogen/src/footprints/ceoloide ]; then 
    echo "Removing existing @ceoloide's footprint library"
    rm -rf node_modules/ergogen/src/footprints/ceoloide
  fi
  git clone https://github.com/ceoloide/ergogen-footprints.git node_modules/ergogen/src/footprints/ceoloide
  if [ -d node_modules/ergogen/src/footprints/infused-kim ]; then 
    echo "Removing existing @infused-kim's footprint library"
    rm -rf node_modules/ergogen/src/footprints/infused-kim
  fi
  git clone https://github.com/infused-kim/kb_ergogen_fp.git node_modules/ergogen/src/footprints/infused-kim
  
  # Add the footprints to the index
  echo "Patching footprints/index.js..."
  cp -f patch/footprints_index.js node_modules/ergogen/src/footprints/index.js
  
  # Clear Webpack compile cache to force rebuilds when dependencies or files in node_modules change
  if [ -d node_modules/.cache ]; then
    echo "Clearing Webpack cache..."
    rm -rf node_modules/.cache
  fi

  # Store project root to handle pnpm virtual store paths correctly
  PROJECT_ROOT=$(pwd)

  # Patch package.json requires in ergogen files to prevent bundler resolution warnings/errors in worker context
  if [ -f node_modules/ergogen/src/ergogen.js ]; then
    echo "Patching package.json require in ergogen.js..."
    ERG_VERSION=$(node -p "require('./node_modules/ergogen/package.json').version")
    node -e "
      const fs = require('fs');
      let content = fs.readFileSync('node_modules/ergogen/src/ergogen.js', 'utf8');
      content = content.replace(/const version = require\('\\.\\.\\/package\\.json'\\)\\.version/, 'const version = \"' + '$ERG_VERSION' + '\"');
      fs.writeFileSync('node_modules/ergogen/src/ergogen.js', content, 'utf8');
    "
  fi

  if [ -f node_modules/ergogen/src/io.js ]; then
    echo "Patching package.json require in io.js..."
    node -e "
      const fs = require('fs');
      const pkg = require('./node_modules/ergogen/package.json');
      let content = fs.readFileSync('node_modules/ergogen/src/io.js', 'utf8');
      content = content.replace(/const package_json = require\('\\.\\.\\/package\\.json'\\)/, 'const package_json = ' + JSON.stringify(pkg));
      fs.writeFileSync('node_modules/ergogen/src/io.js', content, 'utf8');
    "
  fi

  # Build and copy built ergogen
  echo "Building Ergogen..."
  (
    cd node_modules/ergogen
    PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --ignore-workspace --registry=https://registry.npmjs.org
    pnpm run build
    cp dist/ergogen.js "$PROJECT_ROOT/public/dependencies/ergogen.js"
  )
else
  echo "Directory node_modules/ergogen not found."
fi

