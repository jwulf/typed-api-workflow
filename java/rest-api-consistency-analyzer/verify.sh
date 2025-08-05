#!/bin/bash

# REST API Consistency Verification Script
# This script runs the consistency check and exits with appropriate code

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../camunda" && pwd)"
ANALYZER_DIR="$SCRIPT_DIR/../rest-api-consistency-analyzer"

# Build the analyzer if not already built
if [ ! -d "$ANALYZER_DIR/target/classes" ]; then
    echo "🔨 Building REST API Consistency Analyzer..."
    cd "$ANALYZER_DIR"
    mvn clean compile -q
fi

# Run the analyzer
echo "🚀 Running REST API consistency verification..."
cd "$ANALYZER_DIR"

if mvn exec:java@analyze -Dexec.args="$PROJECT_ROOT/zeebe/gateway-rest/src/main/java/io/camunda/zeebe/gateway/rest/controller $PROJECT_ROOT/zeebe/gateway-protocol/src/main/proto/rest-api.yaml" -q; then
    echo "✅ All endpoints are consistent!"
    exit 0
else
    echo "❌ Inconsistencies found. Run './patch-openapi.sh' to fix them automatically."
    exit 1
fi
