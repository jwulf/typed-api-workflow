#!/bin/bash

# REST API OpenAPI Domain Patcher Script
# This script automatically adds missing x-eventually-consistent extensions to the domain spec

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../camunda" && pwd)"
ANALYZER_DIR="$SCRIPT_DIR"

# Build the analyzer
echo "🔨 Building REST API Consistency Analyzer..."
cd "$ANALYZER_DIR"
mvn clean compile -q

# Create backup of OpenAPI spec
OPENAPI_SPEC="$PROJECT_ROOT/../rest-api.domain.yaml"
BACKUP_SPEC="$OPENAPI_SPEC.backup.$(date +%Y%m%d_%H%M%S)"

echo "💾 Creating backup: $(basename "$BACKUP_SPEC")"
cp "$OPENAPI_SPEC" "$BACKUP_SPEC"

# Run the patcher
echo "🔧 Running OpenAPI domain patcher..."
mvn exec:java@patch -Dexec.args="$PROJECT_ROOT/zeebe/gateway-rest/src/main/java/io/camunda/zeebe/gateway/rest/controller $OPENAPI_SPEC" -q

echo "✅ Patching complete!"
echo "📁 Backup saved to: $BACKUP_SPEC"
echo ""
echo "🔍 Re-running verification to check results..."
cd "$ANALYZER_DIR"

if mvn exec:java@analyze -Dexec.args="$PROJECT_ROOT/zeebe/gateway-rest/src/main/java/io/camunda/zeebe/gateway/rest/controller $OPENAPI_SPEC" -q; then
    echo "✅ All endpoints are now consistent!"
else
    echo "⚠️  Some issues may remain. Check the analysis output above."
fi

echo ""
echo "To restore the original file if needed:"
echo "  cp \"$BACKUP_SPEC\" \"$OPENAPI_SPEC\""
