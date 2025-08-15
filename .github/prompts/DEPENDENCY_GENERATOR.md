In the semantic-graph-extractor directory, we have a project that extracts the dependency graph from an OpenAPI specification.

The output of the extractor is in api-test/semantic-graph-extractor/dist/output/operation-dependency-graph.json

1. Write a TypeScript project in api-test/path-analyser.
2. This project will read the api-test/semantic-graph-extractor/dist/output/operation-dependency-graph.json file (Read the file to understand its structure, and take a look at the semantic-graph-extractor to understand how it is generated).
3. It will analyse the dependency graph and generate paths through the API. 
4. For any endpoint that takes a request with a semantic type (to understand what this is, examine the OpenAPI specification rest-api.domain.yaml), the analyser will traverse the operation dependency graph to find the operations that will provide the required values. "Required values" are semantic types, which are system generated values that cannot be generated outside the API. 
5.  We want all possible paths. Circular dependencies should be handled with a cyclic check to ensure that we don't get into infinite loops. Include one iteration of the cycle.
6. The output of this program will be a collection of JSON files, one for each endpoint, that contain `EndpointScenarioCollection`s. The files will be named with the convention `${endpoint}-scenarios.json`.
7. The endpoint scenario collection contains an array of end point scenarios.
8. An endpoint scenario describes the chain of operations required to call collect the required values, culminating in calling the endpoint with the values needed for the request. 
9. The scenarios should be ordered by chain length.
10. Required and optional semantic types should be treated the same for the path generation, but we should note which are required and which are optional.
