#!/bin/sh

basedir="node_modules/ergogen/src/footprints/"

if [ ! -d node_modules/ergogen ]; then
  echo "Installing Ergogen..."
  npm install ergogen
fi

process_user() {
  username=$1
  folder=$2
  repo=$3
  if [ -d ${folder} ]; then
    echo "Removing ${folder} for a clean clone"
    rm -rf ${folder}
  fi

  echo "Cloning @${username}'s repository into ${folder}"
  git clone -q ${repo}.git ${folder}
  index_patch="${index_patch}
;// @${username}'s footprints"
  index_patch="${index_patch}$(find ${folder} -maxdepth 1 -type f -iname '*.js' | while read file; do
    entry_name="${username}/$(echo ${file} | awk -F'/' '{ print $NF }' | rev | cut -c 4- | rev)"
    echo ";'${entry_name}': require('./${entry_name}.js'),"
  done)"
}

GITUSERS="${GITUSERS:-ceoloide kim}"

index_patch=""

declare -A ceoloide=([folder]='ceoloide' [repo]='https://github.com/ceoloide/ergogen-footprints')
declare -A kim=([folder]='infused-kim' [repo]='https://github.com/infused-kim/kb_ergogen_fp')

# Process GITUSERS as a semicolon and colon separated list of users if it exists, otherwise fall back and default to a list of usernames, which need to match the declared listed above

if [[ ${GITUSERS} =~ [\:\;] ]]; then # POSIX extended RegEx check for colon or semicolon in the string
  while read folderrepo; do
    echo "Using user:repo format based on \$GITUSERS"
    username="$(cut -d ':' -f 1 <<< "${folderrepo}")"
    folder="node_modules/ergogen/src/footprints/${username}"
    repo="$(cut -d ':' -f 2-  <<< "${folderrepo}")"

    process_user $username $folder $repo
  done <<< "$(echo ${GITUSERS} | tr ';' '\n')"
else
  echo "Using username list based on \$GITUSERS"
  IFS=' ' read -ra users <<< "${GITUSERS}"
  for user in "${users[@]}"; do
    declare -n user_array="${user}"

    username="${user_array[folder]}"
    folder="node_modules/ergogen/src/footprints/${username}"
    repo="${user_array[repo]}"

    process_user $username $folder $repo
  done
fi

# Check for the extras folder
if [ -d patch/extras ]; then
  echo "Adding footprints from patch/extras"
  index_patch="${index_patch};// Extra footprints"
  index_patch="${index_patch}$(find patch/extras -type f | while read file; do
    filename=$(cut -d '/' -f 2- <<< "${file}")
    footprintname=$(rev <<< "${filename}" | cut -c 4- | rev)
    echo ";'${footprintname}': require('${filename}'),"
    mkdir -p "${basedir}extras/"
    cp "${file}" "${basedir}extras/"
  done)"
fi

result_file="./patch/index_modified.js"

if ! [ -e ${result_file} ]; then
  touch ${result_file}
fi

index_patch=$(echo ${index_patch} | sed 's/;/\\n  /g')

printf "$(head -n -1 ./patch/index_base.js && printf "${index_patch}" && echo && tail -n 1 ./patch/index_base.js)" > ./patch/index_modified.js

echo "Replacing original footprint index file"
cp -f ./patch/index_modified.js ./node_modules/ergogen/src/footprints/index.js
