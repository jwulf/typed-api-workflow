# OpenAPI Spec transformation tool

This tool transforms the canonical OpenAPI spec for the Camunda 8 Orchestration Cluster API, containing semantic domain types and discriminated request types, into the legacy untyped format expected by the code generation pipeline for the Zeebe REST Gateway and the Java client.

It removes all type information for `CamundaKey` and any schemas that extend it (mapping them to `string`), and flattens all complex unions marked with `x-polymorphic-schema` to a simple flat type with all fields. 

TODO: 

1. Refactor this class into a modular pipeline to allow the transforms to be selectively turned off, so that the schema changes can be selectively absorbed by the controller and client code.

2. Make the input and output files configurable.

3. We need to put this as a task in a maven build pipeline. 