#!/usr/bin/env bash

# normalize-icon-colors.sh
# Rewrites hardcoded SVG paint colors to currentColor in src/assets/icons.
# Usage:
#   ./scripts/normalize-icon-colors.sh
#   ./scripts/normalize-icon-colors.sh --check

set -euo pipefail

MODE="write"
if [[ "${1:-}" == "--check" ]]; then
  MODE="check"
fi

ICON_DIR="$(pwd)/src/assets/icons"

if [[ ! -d "$ICON_DIR" ]]; then
  echo "Icon directory not found: $ICON_DIR" >&2
  exit 1
fi

changed_count=0
total_count=0

rewrite_svg() {
  local input_file="$1"
  local output_file="$2"

  perl -0777 -pe '
    # Attribute-based paint values
    s/\bstroke="(?!none\b|currentColor\b|url\()[^"]+"/stroke="currentColor"/gi;
    s/\bfill="(?!none\b|currentColor\b|url\()[^"]+"/fill="currentColor"/gi;
    s/\bstop-color="(?!none\b|currentColor\b|url\()[^"]+"/stop-color="currentColor"/gi;

    # style="..." paint values
    s/(\bstyle="[^"]*?)\bstroke\s*:\s*(?!none\b|currentColor\b|url\()[^;\"]+/$1 . "stroke:currentColor"/gie;
    s/(\bstyle="[^"]*?)\bfill\s*:\s*(?!none\b|currentColor\b|url\()[^;\"]+/$1 . "fill:currentColor"/gie;
    s/(\bstyle="[^"]*?)\bstop-color\s*:\s*(?!none\b|currentColor\b|url\()[^;\"]+/$1 . "stop-color:currentColor"/gie;
  ' "$input_file" > "$output_file"
}

while IFS= read -r -d '' svg_file; do
  total_count=$((total_count + 1))
  tmp_file="$(mktemp)"

  rewrite_svg "$svg_file" "$tmp_file"

  if ! cmp -s "$svg_file" "$tmp_file"; then
    changed_count=$((changed_count + 1))

    if [[ "$MODE" == "write" ]]; then
      mv "$tmp_file" "$svg_file"
      echo "updated: ${svg_file#$ICON_DIR/}"
    else
      rm -f "$tmp_file"
      echo "would update: ${svg_file#$ICON_DIR/}"
    fi
  else
    rm -f "$tmp_file"
  fi
done < <(find "$ICON_DIR" -type f -name '*.svg' -print0 | sort -z)

if [[ "$MODE" == "check" ]]; then
  if [[ "$changed_count" -gt 0 ]]; then
    echo "\n$changed_count of $total_count SVG files need normalization."
    exit 2
  fi

  echo "All $total_count SVG files are normalized."
  exit 0
fi

echo "\nNormalized $changed_count of $total_count SVG files."
