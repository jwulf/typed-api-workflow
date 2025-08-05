# Proof of concept of Generated SDKs

This directory contains the tooling for generated SDKs, using the openapi-generator-cli. Currently, the TypeScript generator builds a complete, type-safe core.

The layout: 

- `generated` - generated SDK code output
- `templates` - custom templates for code generation
- `tools` - SDK generation tool chain
- `  - enhancements` - generation post-processing tasks for SDKs
- `  - post-build` - post-generation build tasks for SDKs
- `tests` - acceptance tests for SDK builds