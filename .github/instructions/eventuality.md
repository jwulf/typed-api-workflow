Eventuality

We are going to keep the generated code without adding eventually support to it. 

What we want to achieve is this: 

The generated SDK exports a `WithEventuality` function. 
This function takes one of the SDK API classes and returns a class with `eventually` methods added to the eventually consistent endpoints.
These enhanced methods should have the `T & EventuallyConsistentOperation<T>` signature, and the run-time behaviour of our working decorator. So a user can call either the direct method or `${method}.eventually`.
We probably need to still decorate the eventually consistent methods during generation, to add metadata to them so that `WithEventuality` can identify which methods need the enhancement. 
A challenge may be how we make the enhanced signature derived from the earlier decorator. Reason about the TypeScript type system, method decorators, and such a class factory as `WithEventuality` to see if it is possible.
Do NOT write any code yet, just work through the problem using logic. Consult whatever external resources you need to about the TypeScript type system.