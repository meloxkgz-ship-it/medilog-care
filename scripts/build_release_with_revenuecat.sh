#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_CONFIG="$ROOT_DIR/ios/MediLogNative/Config/RevenueCat.local.xcconfig"
PROJECT="$ROOT_DIR/ios/MediLogNative/MediLogNative.xcodeproj"
SCHEME="MediLogNative"
ARCHIVE_PATH="${1:-$ROOT_DIR/.asc/artifacts/MediLogNative-RevenueCat.xcarchive}"

"$ROOT_DIR/scripts/verify_revenuecat_release.mjs" --require-key

KEY="$(awk -F '=' '/REVENUECAT_API_KEY/ { gsub(/[[:space:]]/, "", $2); print $2; exit }' "$LOCAL_CONFIG")"
if [[ "$KEY" != appl_* ]]; then
  echo "RevenueCat key is missing or invalid." >&2
  exit 65
fi

xcodebuild \
  -project "$PROJECT" \
  -scheme "$SCHEME" \
  -configuration Release \
  -destination "generic/platform=iOS" \
  -archivePath "$ARCHIVE_PATH" \
  REVENUECAT_API_KEY="$KEY" \
  clean archive

echo "Archived RevenueCat-enabled build to $ARCHIVE_PATH"
