package io.camunda.tools.model;

import java.util.List;

public record ControllerEndpoint(
    String className,
    String methodName,
    String httpMethod,
    String path,
    boolean hasRequiresSecondaryStorage,
    boolean inheritedFromClass,
    int lineNumber
) {

    public String getFullPath() {
        return path;
    }

    public String getSignature() {
        return String.format("%s %s", httpMethod, path);
    }
}
