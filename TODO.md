## Eventual consistency annotation

Currently we use a single method to assert this. See [java/rest-api-consistency-analyzer]
(java/rest-api-consistency-analyzer).

We need to add cross-validation. We should run a string grepping strategy over the code to generate the same information using a different method, and compare the output. 

-----

We still need to assert the required nature of response fields in the spec. 


ProcessDefinitionId 

 - we lift the type
 - but for advanced filter searches, we want to allow partial matching on free strings