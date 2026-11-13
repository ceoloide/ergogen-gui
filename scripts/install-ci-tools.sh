#!/bin/sh
# Pinned native tools for the Linux x86_64 CI/agent environment.
set -eu
if [ "$(uname -s)/$(uname -m)" != 'Linux/x86_64' ]; then
  echo 'Install actionlint 1.7.12, ShellCheck 0.11.0 and zizmor 1.32.0 for your platform (see README).' >&2
  exit 1
fi
install_dir=${1:-"$(pwd)/.tools/bin"}
mkdir -p "$install_dir"
install_dir=$(cd "$install_dir" && pwd)
archive_dir=$(mktemp -d)
trap 'rm -rf "$archive_dir"' EXIT HUP INT TERM

# Verify each official release archive before extracting a single executable.
fetch() {
  url=$1
  checksum=$2
  archive=$3
  curl --fail --silent --show-error --location --retry 3 "$url" --output "$archive_dir/$archive"
  printf '%s  %s\n' "$checksum" "$archive_dir/$archive" | sha256sum --check
}
fetch 'https://github.com/rhysd/actionlint/releases/download/v1.7.12/actionlint_1.7.12_linux_amd64.tar.gz' \
  '8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8' actionlint.tar.gz
tar -xzf "$archive_dir/actionlint.tar.gz" -C "$install_dir" actionlint
fetch 'https://github.com/koalaman/shellcheck/releases/download/v0.11.0/shellcheck-v0.11.0.linux.x86_64.tar.xz' \
  '8c3be12b05d5c177a04c29e3c78ce89ac86f1595681cab149b65b97c4e227198' shellcheck.tar.xz
tar -xJf "$archive_dir/shellcheck.tar.xz" -C "$archive_dir" shellcheck-v0.11.0/shellcheck
cp "$archive_dir/shellcheck-v0.11.0/shellcheck" "$install_dir/shellcheck"
fetch 'https://github.com/zizmorcore/zizmor/releases/download/v1.32.0/zizmor-x86_64-unknown-linux-gnu.tar.gz' \
  'bb110cc765eca9cd7efb2e284a956be5974c60027b0970f16397d86208a9957b' zizmor.tar.gz
tar -xzf "$archive_dir/zizmor.tar.gz" -C "$install_dir" zizmor
printf 'Installed actionlint 1.7.12, ShellCheck 0.11.0 and zizmor 1.32.0 in %s\n' "$install_dir"
