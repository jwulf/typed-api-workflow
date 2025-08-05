#!/bin/bash

# REST API Consistency Analyzer Runner Script
# This script builds and runs the analyzer with proper paths

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../camunda" && pwd)"
ANALYZER_DIR="$SCRIPT_DIR/../rest-api-consistency-analyzer"

# Build the analyzer
echo "🔨 Building REST API Consistency Analyzer..."
cd "$ANALYZER_DIR"
mvn clean compile -q

# Run the analyzer
echo "🚀 Running analysis..."
mvn exec:java -Dexec.args="$PROJECT_ROOT/zeebe/gateway-rest/src/main/java/io/camunda/zeebe/gateway/rest/controller $PROJECT_ROOT/zeebe/gateway-protocol/src/main/proto/rest-api.yaml" -q

echo "✅ Analysis complete!"
