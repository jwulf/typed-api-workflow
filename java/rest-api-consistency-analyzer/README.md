## Rest Endpoint Consistency Analyzer

This tool statically analyzes the REST Gateway controllers to determine if an endpoint is eventually consistent.

This is done by examining the methods for the `@RequiresSecondaryStorage` annotation. According to [this comment](https://github.com/camunda/camunda/issues/26297#issuecomment-3150357867), this is the surface signal that an endpoint is eventually consistent. 

We notate this in the specification using the vendor extension `x-eventually-consistent: true`. This can be consumed by generated SDKs, and generates an admonition in documentation (see [`docs-patch/README.md`](../../docs-patch/README.md) in this repo).

This tool compares the controller endpoints with the paths in the OpenAPI spec to assert the completeness of its reasoning. It turns out that this reveals other issues as a side-effect, such as [this one](https://github.com/camunda/camunda/issues/36404).

This approach can be used to implement static analysis of controller correctness - see [#36458](https://github.com/camunda/camunda/issues/36458).