package io.camunda.tools.model;

public record OpenApiEndpoint(
    String path,
    String method,
    boolean hasEventuallyConsistentExtension,
    int lineNumber
) {

    public String getSignature() {
        return String.format("%s %s", method.toUpperCase(), path);
    }
}
