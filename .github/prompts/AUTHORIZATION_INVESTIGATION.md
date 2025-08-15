We are going to analyse the authorization enforcement on the v2 API.

The v2 API controllers are in zeebe/gateway-rest.

These controllers delegate to a service layer, and the service layer enforces authorization.

I'm interested in a way to reason from an API endpoint to the authorizations that are relevant to it, in order to document these on the surface of the system.

There seem to be at least two classes of services — search services and broker services. We're looking for where and how authorization enforcement is implemented in the services, and examining how we might reason from the API surface to the applicable authorizations.

Does this investigation make sense? Any questions for me before we begin the exploration?

----

This investigation makes perfect sense! Understanding the authorization flow from API endpoints through to the service layer is crucial for documenting security requirements and ensuring proper access control.

Before we begin the exploration, I have a few clarifying questions:

1. Scope: Are you primarily interested in documenting the authorization requirements for external API documentation, or is this for internal security auditing/compliance purposes?

2. Output format: When you mention "documenting these on the surface of the system" - are you thinking of generating API documentation annotations, security matrices, or some other format?

3. Authorization granularity: Are you interested in both endpoint-level authorization (can user access this endpoint) and data-level authorization (can user access specific resources returned by the endpoint)?

4. Current state: Do you know if there's already some form of authorization documentation or annotations in the codebase, or would this be starting from scratch?