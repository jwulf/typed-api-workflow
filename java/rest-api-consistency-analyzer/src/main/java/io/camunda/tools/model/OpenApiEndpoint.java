package io.camunda.tools.model;

public record OpenApiEndpoint(
    String path,
    String method,
    Boolean eventuallyConsistentValue, // null = not present, true = eventual, false = strong
    int lineNumber
) {

    public String getSignature() {
        return String.format("%s %s", method.toUpperCase(), path);
    }

    public boolean hasEventuallyConsistentExtension() {
        return eventuallyConsistentValue != null && eventuallyConsistentValue;
    }

    public boolean hasConsistencyDeclaration() {
        return eventuallyConsistentValue != null;
    }

    public boolean isEventuallyConsistent() {
        return eventuallyConsistentValue != null && eventuallyConsistentValue;
    }

    public boolean isStronglyConsistent() {
        return eventuallyConsistentValue != null && !eventuallyConsistentValue;
    }
}
