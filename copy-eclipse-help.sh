#!/bin/bash

# Copy Eclipse help files from xtext-website to xtext repository
# Usage: ./copy-eclipse-help.sh [xtext-repo-path]

set -e

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Default paths
XTEXT_WEBSITE_DIR="${SCRIPT_DIR}"
XTEXT_REPO_DIR="${1:-$HOME/xtext-main/git/xtext}"
XTEXT_DOC_DIR="$XTEXT_REPO_DIR/org.eclipse.xtext.doc/contents"

# Check if xtext-website exists
if [ ! -d "$XTEXT_WEBSITE_DIR/xtext-website" ]; then
    echo "Error: xtext-website directory not found at $XTEXT_WEBSITE_DIR"
    exit 1
fi

# Check if xtext repo exists
if [ ! -d "$XTEXT_REPO_DIR" ]; then
    echo "Error: Xtext repository not found at $XTEXT_REPO_DIR"
    echo "Usage: $0 [path-to-xtext-repo]"
    exit 1
fi

echo "=== Building Hugo site ==="
cd "$XTEXT_WEBSITE_DIR/xtext-website"
hugo

echo ""
echo "=== Copying Eclipse help files ==="
echo "Source: $XTEXT_WEBSITE_DIR/xtext-website/public/eclipse/"
echo "Target: $XTEXT_DOC_DIR/"
echo ""

mkdir -p "$XTEXT_DOC_DIR"
cp -r public/eclipse/* "$XTEXT_DOC_DIR/"

echo ""
echo "=== Done ==="
echo "Eclipse help files copied to: $XTEXT_DOC_DIR"
echo ""
echo "Next steps in xtext repo:"
echo "1. cd $XTEXT_REPO_DIR/org.eclipse.xtext.doc"
echo "2. Generate toc.xml if needed"
echo "3. Build and test Eclipse help"
