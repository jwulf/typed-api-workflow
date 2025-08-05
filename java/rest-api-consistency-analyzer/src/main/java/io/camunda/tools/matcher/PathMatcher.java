package io.camunda.tools.matcher;

import io.camunda.tools.model.ControllerEndpoint;
import io.camunda.tools.model.OpenApiEndpoint;

import java.util.regex.Pattern;

public class PathMatcher {

    /**
     * Fuzzy match paths by normalizing path parameters to a generic form
     * e.g., /v2/jobs/{jobKey} matches /v2/jobs/{id}
     */
    public boolean pathsMatch(String controllerPath, String openApiPath) {
        return normalizePath(controllerPath).equals(normalizePath(openApiPath));
    }

    /**
     * Check if a controller endpoint matches an OpenAPI endpoint
     */
    public boolean endpointsMatch(ControllerEndpoint controllerEndpoint, OpenApiEndpoint openApiEndpoint) {
        return pathsMatch(controllerEndpoint.path(), openApiEndpoint.path()) &&
               methodsMatch(controllerEndpoint.httpMethod(), openApiEndpoint.method());
    }

    private boolean methodsMatch(String controllerMethod, String openApiMethod) {
        return controllerMethod.equalsIgnoreCase(openApiMethod);
    }

    /**
     * Normalize path by replacing all path parameters with a generic placeholder
     * e.g., /v2/jobs/{jobKey} becomes /v2/jobs/{param}
     *       /v2/jobs/{id} becomes /v2/jobs/{param}
     */
    private String normalizePath(String path) {
        // Replace all path parameters (anything between {}) with {param}
        Pattern pathParamPattern = Pattern.compile("\\{[^}]+\\}");
        return pathParamPattern.matcher(path).replaceAll("{param}");
    }
}
