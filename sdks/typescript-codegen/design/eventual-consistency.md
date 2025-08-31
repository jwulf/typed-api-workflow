PROMPT:

In the OpenAPI specification, operations have a vendor extension `x-eventually-consistent`. 

This is a statement of a behavioural characteristic of the endpoint. Endpoints marked `x-eventually-consistent: true` are backed by eventually consistent data. This means that calls to these endpoints may return a 404 (for a GET) or an empty or incomplete result set with a 200 (for a POST on a search endpoint), and return the expected entity on a subsequent call.

Users of the SDK need to be aware of this behaviour, and to manage the consistency expectation in their applications. 

The first thing we want to do is to add the consistency characteristic ("Strongly consistent" / "Eventually consistent") to the JSDoc comment for the SDK method, so that this is surfaced in the IDE. 

The second thing that we want to do is to enrich the method signature and behaviour of eventually consistent methods. 

We want to make these methods<T> take a mandatory additional parameter `{ waitUpToMs: number, pollIntervalMs = 500, predicate? T => boolean }`.

The method will be wrapped with a helper that calls the method, and if waitUpToMs > 0, the wrapper will transparently return the result. If the result is:
- 404 for a GET
- 200 and the response does not meet the predicate
Then the wrapper will retry the operation every pollIntervalMs until the predicate is met or waitUpToMs elapses.

The predicate by default is a 200 response for a GET operation, or a 200 response with an items field that is an array with length > 0. 

If the operation is not a GET and does not return `T extends { items: Array<V> }` and waitUpToMs > 0, then predicate needs to be required. 

The predicate function signature is T => boolean, where T is the response signature of the method. The user-supplied predicate function should inspect the result and then return true to return to the user, or false to keep polling. 

The wrapper polling mechanism should block concurrent polling, so that network latency does not lead to multiple concurrent requests. 

Do you have any questions about this feature?