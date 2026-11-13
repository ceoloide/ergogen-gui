#!/bin/sh
# Prepare the Ergogen engine used by the GUI.
#
# The installed package (node_modules/ergogen) lives in pnpm's virtual store and
# its files are hard links into the shared, content-addressable pnpm store, so
# it is treated as read-only. Instead, this script copies it into a
# checkout-owned folder (ENGINE_DIR), adds the @ceoloide and @infused-kim
# footprint libraries at pinned commits and replaces the footprint index.
# Bundlers and scripts import the engine from ENGINE_DIR.
#
# The script never installs packages, builds Ergogen or changes Git
# configuration. It rebuilds the engine only when one of its inputs changes.
#
# Footprint libraries can be moved to another commit (or mirror) for testing:
#   CEOLOIDE_FOOTPRINTS_COMMIT=<sha> pnpm run build-ergogen
set -eu

CEOLOIDE_FOOTPRINTS_URL=${CEOLOIDE_FOOTPRINTS_URL:-https://github.com/ceoloide/ergogen-footprints.git}
CEOLOIDE_FOOTPRINTS_COMMIT=${CEOLOIDE_FOOTPRINTS_COMMIT:-fd8a628c7175495bdb48fc41a0f56e5ef31f7e5d}
INFUSED_KIM_FOOTPRINTS_URL=${INFUSED_KIM_FOOTPRINTS_URL:-https://github.com/infused-kim/kb_ergogen_fp.git}
INFUSED_KIM_FOOTPRINTS_COMMIT=${INFUSED_KIM_FOOTPRINTS_COMMIT:-bb80a207d8a6fa7b9245caad2c2d97e2adc2f612}

PROJECT_ROOT=$(pwd)
PATCH_DIR=$(cd "$(dirname "$0")" && pwd)
INSTALLED_ERGOGEN="$PROJECT_ROOT/node_modules/ergogen"
ENGINE_DIR="$PROJECT_ROOT/node_modules/.ergogen-engine"
STAMP_FILE="$ENGINE_DIR/.engine-stamp"
VITE_CACHE_DIR="$PROJECT_ROOT/node_modules/.vite"

# Git operations below must target the temporary footprint repositories even
# when this script runs from a Git hook that exports the project's repository.
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
  GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_COMMON_DIR GIT_PREFIX

fail() {
  echo "build-ergogen: $*" >&2
  exit 1
}

require_commit_sha() {
  variable_name=$1
  value=$2
  if ! printf '%s\n' "$value" | grep -Eq '^[0-9a-f]{40}$'; then
    fail "$variable_name must be a full 40-character commit SHA, got '$value'."
  fi
}

# Prints the ergogen specifier pnpm last installed for this project.
# shellcheck disable=SC2016 # $2 belongs to the JavaScript regex replacement.
installed_ergogen_specifier() {
  node -e '
    const fs = require("fs");
    const lockfile = fs.readFileSync(process.argv[1], "utf8");
    const match = lockfile.match(/^ {6}ergogen:\n {8}specifier: (.+)$/m);
    if (match) console.log(match[1].replace(/^([\x27"])(.*)\1$/, "$2"));
  ' "$PROJECT_ROOT/node_modules/.pnpm/lock.yaml" 2>/dev/null || true
}

# --- Validate inputs --------------------------------------------------------

require_commit_sha CEOLOIDE_FOOTPRINTS_COMMIT "$CEOLOIDE_FOOTPRINTS_COMMIT"
require_commit_sha INFUSED_KIM_FOOTPRINTS_COMMIT "$INFUSED_KIM_FOOTPRINTS_COMMIT"

if [ ! -f "$INSTALLED_ERGOGEN/package.json" ]; then
  fail "node_modules/ergogen not found. Run 'PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install' first."
fi

if [ -n "${ERGOGEN_VERSION:-}" ]; then
  requested_specifier=${ERGOGEN_VERSION#ergogen@}
  installed_specifier=$(installed_ergogen_specifier)
  if [ "$installed_specifier" != "$requested_specifier" ]; then
    fail "ERGOGEN_VERSION is '$ERGOGEN_VERSION' but the installed ergogen is '${installed_specifier:-unknown}'. Install it with: ERGOGEN_VERSION='$ERGOGEN_VERSION' node scripts/preinstall.js && PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --no-frozen-lockfile"
  fi
fi

# Resolve pnpm's symlink so the copy starts from the real package folder.
INSTALLED_ERGOGEN_REAL=$(cd "$INSTALLED_ERGOGEN" && pwd -P)
# pnpm places a package's dependencies next to it in the virtual store.
ERGOGEN_DEPENDENCIES_DIR=$(dirname "$INSTALLED_ERGOGEN_REAL")
INSTALLED_VERSION=$(node -p 'require(process.argv[1]).version' "$INSTALLED_ERGOGEN_REAL/package.json")

# --- Skip when the engine is already up to date ------------------------------

expected_stamp=$(
  echo "ergogen=$INSTALLED_ERGOGEN_REAL@$INSTALLED_VERSION"
  echo "ceoloide=$CEOLOIDE_FOOTPRINTS_URL@$CEOLOIDE_FOOTPRINTS_COMMIT"
  echo "infused-kim=$INFUSED_KIM_FOOTPRINTS_URL@$INFUSED_KIM_FOOTPRINTS_COMMIT"
  echo "index=$(cksum < "$PATCH_DIR/footprints_index.js")"
  echo "script=$(cksum < "$0")"
)

if [ -f "$STAMP_FILE" ] && [ "$(cat "$STAMP_FILE")" = "$expected_stamp" ]; then
  echo "Ergogen engine is up to date ($ENGINE_DIR)."
  exit 0
fi

# --- Assemble the engine in a staging folder ---------------------------------

STAGING_DIR="$ENGINE_DIR.staging.$$"
cleanup() {
  rm -rf "$STAGING_DIR"
}
trap cleanup EXIT
trap 'exit 1' INT TERM

echo "Preparing Ergogen $INSTALLED_VERSION engine in $ENGINE_DIR..."
mkdir -p "$STAGING_DIR"

# cp creates new files, so later edits never reach the shared pnpm store.
# Nested node_modules and dist folders are left behind by older versions of
# this script, which installed and built Ergogen in place.
find "$INSTALLED_ERGOGEN_REAL" -mindepth 1 -maxdepth 1 \
  ! -name node_modules ! -name dist \
  -exec cp -R {} "$STAGING_DIR/" \;
ln -s "$ERGOGEN_DEPENDENCIES_DIR" "$STAGING_DIR/node_modules"

fetch_footprints() {
  name=$1
  url=$2
  commit=$3
  destination="$STAGING_DIR/src/footprints/$name"

  echo "Fetching @$name's footprint library at $commit..."
  rm -rf "$destination"
  git init -q "$destination"
  if ! git -C "$destination" fetch -q --depth 1 "$url" "$commit"; then
    fail "could not fetch commit $commit of @$name's footprint library from $url."
  fi
  git -C "$destination" -c advice.detachedHead=false checkout -q FETCH_HEAD
  rm -rf "$destination/.git"
}

fetch_footprints ceoloide "$CEOLOIDE_FOOTPRINTS_URL" "$CEOLOIDE_FOOTPRINTS_COMMIT"
fetch_footprints infused-kim "$INFUSED_KIM_FOOTPRINTS_URL" "$INFUSED_KIM_FOOTPRINTS_COMMIT"

echo "Installing the footprint index..."
rm -f "$STAGING_DIR/src/footprints/index.js"
cp "$PATCH_DIR/footprints_index.js" "$STAGING_DIR/src/footprints/index.js"

# Inline package.json so bundled worker code does not need to resolve it.
echo "Inlining package.json in ergogen.js and io.js..."
node -e '
  const fs = require("fs");
  const path = require("path");
  const engine = process.argv[1];
  const manifest = JSON.parse(
    fs.readFileSync(path.join(engine, "package.json"), "utf8")
  );
  const replacements = {
    "src/ergogen.js": [
      /const version = require\(\x27\.\.\/package\.json\x27\)\.version/,
      "const version = " + JSON.stringify(manifest.version),
    ],
    "src/io.js": [
      /const package_json = require\(\x27\.\.\/package\.json\x27\)/,
      "const package_json = " + JSON.stringify(manifest),
    ],
  };
  for (const [file, [pattern, replacement]] of Object.entries(replacements)) {
    const target = path.join(engine, file);
    if (!fs.existsSync(target)) continue;
    const content = fs.readFileSync(target, "utf8");
    fs.writeFileSync(target, content.replace(pattern, replacement), "utf8");
  }
' "$STAGING_DIR"

# Loading the engine resolves every footprint in the index and every runtime
# dependency, so a missing file fails here instead of in the browser.
echo "Verifying the engine loads..."
if ! node -e 'require(process.argv[1])' "$STAGING_DIR" >/dev/null; then
  fail "the prepared engine failed to load; see the error above."
fi

printf '%s\n' "$expected_stamp" > "$STAGING_DIR/.engine-stamp"

# --- Replace the previous engine ---------------------------------------------

rm -rf "$ENGINE_DIR"
mv "$STAGING_DIR" "$ENGINE_DIR"

# Vite keys its dependency cache on the lockfile and config, not on file
# contents, so drop it to pick up the new engine.
rm -rf "$VITE_CACHE_DIR"

echo "Ergogen engine ready."
