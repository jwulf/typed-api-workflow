#!/bin/bash

set -e  # Exit on any error

# Detect if we're running from root or tools directory
if [ -f "rest-api.domain.yaml" ]; then
    # Running from root via npm script
    SPEC_FILE="rest-api.domain.yaml"
    SDKS_DIR="./sdks/generated"
    TOOLS_DIR="./sdks/tools"
elif [ -f "../../rest-api.domain.yaml" ]; then
    # Running directly from tools directory
    SPEC_FILE="../../rest-api.domain.yaml"
    SDKS_DIR="../generated"
    TOOLS_DIR="."
else
    echo "❌ Error: Cannot find rest-api.domain.yaml"
    echo "Run this script from project root (via npm run build:sdks) or from sdks/tools directory"
    exit 1
fi

echo "🚀 Generating all SDKs from $SPEC_FILE"
echo "📁 Output directory: $SDKS_DIR"
echo ""

# Check if spec file exists
if [ ! -f "$SPEC_FILE" ]; then
    echo "❌ Error: Spec file not found: $SPEC_FILE"
    exit 1
fi

# Create SDKs directory
mkdir -p "$SDKS_DIR"

# Function to generate SDK with error handling
generate_sdk() {
    local generator=$1
    local output_dir=$2
    local additional_props=$3
    
    echo "🔨 Generating $generator SDK..."
    
    if [ -n "$additional_props" ]; then
        openapi-generator-cli generate \
            -i "$SPEC_FILE" \
            -g "$generator" \
            -o "$SDKS_DIR/$output_dir" \
            --additional-properties="$additional_props" \
            --skip-validate-spec \
            || { echo "❌ Failed to generate $generator SDK"; exit 1; }
    else
        openapi-generator-cli generate \
            -i "$SPEC_FILE" \
            -g "$generator" \
            -o "$SDKS_DIR/$output_dir" \
            --skip-validate-spec \
            || { echo "❌ Failed to generate $generator SDK"; exit 1; }
    fi
    
    echo "✅ $generator SDK generated successfully"
}

# Generate TypeScript SDK
generate_sdk "typescript-node" "typescript" \
    "npmName=@camunda8/rest-api,npmVersion=1.0.0,typescriptThreePlus=true,withSeparateModelsAndApi=true,supportsES6=true"

# Generate C# SDK  
generate_sdk "csharp" "csharp" \
    "packageName=Camunda.RestApi,packageVersion=1.0.0,clientPackage=Camunda.RestApi.Client,packageCompany=Camunda,packageAuthors=YourTeam,packageDescription=SDK_for_Process_Management_API,targetFramework=netstandard2.0,generatePropertyDocumentation=true,hideGenerationTimestamp=true,useCollection=true,returnICollection=false"

# Generate Go SDK
generate_sdk "go" "go" \
    "packageName=camunda-client,packageVersion=1.0.0,generateInterfaces=true"

# Generate Python SDK
generate_sdk "python" "python" \
    "packageName=camunda-client,packageVersion=1.0.0,projectName=camunda-client,generateSourceCodeOnly=true"

# Generate PHP SDK
generate_sdk "php" "php" \
    "composerVendorName=camunda,composerProjectName=rest-api,packageName=RestApi,invokerPackage=Camunda\\Client,modelPackage=Camunda\\Client\\Model,apiPackage=Camunda\\Client\\Api"

echo ""
echo "🎯 All SDKs generated successfully!"
echo ""

# Check if Node.js is available for enhancement
if command -v node &> /dev/null; then
    echo "✨ Enhancing SDKs with semantic types and documentation..."
    
    # Use the correct paths based on where we're running from
    if [ -f "rest-api.domain.yaml" ]; then
        # Running from root
        cd "$TOOLS_DIR"
        node enhance-all-sdks.js "../../rest-api.domain.yaml" "../"  # <-- Orchestrator
        cd - > /dev/null
    else
        # Running from tools directory
        node enhance-all-sdks.js "$SPEC_FILE" "$SDKS_DIR"  # <-- Orchestrator
    fi
    
    echo ""
    echo "🎉 All SDKs enhanced with semantic types and documentation!"
else
    echo "⚠️  Node.js not found. Skipping semantic type enhancement."
    echo "   Install Node.js and run: npm run sdks:enhance"
fi

echo ""
echo "📦 Generated SDKs:"
echo "  📁 TypeScript: $SDKS_DIR/typescript"
echo "  📁 C#:         $SDKS_DIR/csharp"  
echo "  📁 Go:         $SDKS_DIR/go"
echo "  📁 Python:     $SDKS_DIR/python"
echo "  📁 PHP:        $SDKS_DIR/php"
echo ""
echo "🎯 Setup complete! Your strongly-typed SDKs are ready to use."