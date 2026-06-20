#!/bin/sh
# Pull @ceoloide and @infused-kim footprint libraries

# Configure Git to use HTTPS for GitHub
git config --global --unset-all url."https://github.com/".insteadOf 2>/dev/null || true
git config --global --add url."https://github.com/".insteadOf "ssh://git@github.com/"
git config --global --add url."https://github.com/".insteadOf "git+ssh://git@github.com/"
git config --global --add url."https://github.com/".insteadOf "git@github.com:"

if [ -n "$ERGOGEN_VERSION" ]; then
  echo "Installing Ergogen version $ERGOGEN_VERSION..."
  npm install "$ERGOGEN_VERSION" --no-save --legacy-peer-deps
elif [ ! -d node_modules/ergogen ]; then
  echo "Installing Ergogen..."
  npm install ergogen --legacy-peer-deps
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
else
  echo "Directory node_modules/ergogen not found."
fi
