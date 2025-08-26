# Correlations

These are information that needed to extract from the codebase for the specification. 

We need to figure out how we prevent drift - whether through static analysis, or by lifting these characteristics to deterministic surfaces.

## Eventual Consistency

We scan controllers for `@RequiresSecondaryStorage` and assert that its presence is directly correlated with eventual consistency and its absence is correlated with strong consistency. 

## Max length of tenantId 

Extracted from current gateway validator. Not able to trace to engine yet.

## Authorizations

Cannot extract.