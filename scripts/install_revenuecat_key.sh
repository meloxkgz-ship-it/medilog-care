#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_DIR="$ROOT_DIR/ios/MediLogNative/Config"
LOCAL_CONFIG="$CONFIG_DIR/RevenueCat.local.xcconfig"

usage() {
  echo "Usage: $0 appl_your_ios_public_sdk_key" >&2
}

if [[ $# -ne 1 ]]; then
  usage
  exit 64
fi

KEY="$1"
if [[ "$KEY" != appl_* ]]; then
  echo "RevenueCat iOS Public SDK Key must start with 'appl_'." >&2
  exit 65
fi

mkdir -p "$CONFIG_DIR"
cat > "$LOCAL_CONFIG" <<EOF
// Local RevenueCat config. Do not commit.
REVENUECAT_API_KEY = $KEY
EOF

chmod 600 "$LOCAL_CONFIG"
echo "Wrote $LOCAL_CONFIG"
