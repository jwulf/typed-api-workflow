# OpenAPI Spec transformation tool

This tool transforms the canonical OpenAPI spec for the Camunda 8 Orchestration Cluster API, containing semantic domain types and discriminated request types, into the legacy untyped format expected by the code generation pipeline for the Zeebe REST Gateway and the Java client.

It removes all type information for `CamundaKey` and any schemas that extend it (mapping them to `string`), and flattens all complex unions marked with `x-polymorphic-schema` to a simple flat type with all fields. 

