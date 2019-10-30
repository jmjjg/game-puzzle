#!/usr/bin/env sh

set -o errexit
set -o nounset
set -o pipefail

NODE_MODULES_DIR="${NODE_MODULES_DIR:-/opt/node_modules}"
GRUNT_TASK="${GRUNT_TASK:-default}"
${NODE_MODULES_DIR}/grunt-cli/bin/grunt "${GRUNT_TASK}"
