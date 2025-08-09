We are working on a project that enhances an OpenAPI specification to add semantic type information and information about the eventual or strong consistency of the data behind endpoints.

The enhanced spec is rest-api.domain.yaml. 

We need to accomplish four goals: 

1. Enhance the specification. 
2. Generate accurate documentation from the specification using the generation in camunda/docs. (Run `npm docs:build` in the project root)
3. Generate a type-safe SDK in TypeScript using the script in sdks/tools (Run `npm run sdks:generate` in the project root)
4. Maintain a backwards-compatible version of the specification via transformation. The canonical legacy specification is `rest-api.yaml`. The transformer is in `java/openapi-camunda-key-flattener`. The output of this script is `rest-api.generated.yaml`. We generate and validate this format by running `npm run spec:go`. 

We must achieve all of these requirements simultaneously.