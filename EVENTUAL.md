## Eventual Consistency

This core issue: [Mark C8 API as eventually consistent](https://github.com/camunda/camunda/issues/26297)

Some REST endpoints are eventually consistent. They are backed by secondary storage and are not guaranteed to be strongly consistent. 

We want to mark those APIs as such to give documentation, IDE hints, and tooling ergonomics in SDKs.

We achieve this by adding the vendor extension `x-eventually-consistent` to the methods in the spec that are eventually consistent.

To do this, we reason over the codebase with `java/rest-api-consistency-analyzer`. Methods annotated with `@RequiresSecondaryStorage` are eventually consistent. The tool analyses the controllers and the spec, and asserts the completeness of coverage in the spec of the vendor extension.

Methods annotated with this vendor extension are enriched for documentation by the patch in `docs-patch`, which is compatible with the existing docs pre-processing pipeline.