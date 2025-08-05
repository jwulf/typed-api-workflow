package io.camunda.tools.model;

import java.util.List;

public record AnalysisReport(
    List<ControllerEndpoint> controllerEndpoints,
    List<OpenApiEndpoint> openApiEndpoints,
    List<String> correctlyMarkedEndpoints,
    List<String> missingExtensionEndpoints,
    List<String> incorrectExtensionEndpoints,
    List<String> unmatchedControllerEndpoints,
    List<String> unmatchedOpenApiEndpoints
) {

    public void printReport() {
        System.out.println("=".repeat(80));
        System.out.println("REST API CONSISTENCY ANALYSIS REPORT");
        System.out.println("=".repeat(80));

        System.out.printf("📊 Summary:%n");
        System.out.printf("  • Controller v2 endpoints found: %d%n", controllerEndpoints.size());
        System.out.printf("  • OpenAPI v2 endpoints found: %d%n", openApiEndpoints.size());
        System.out.printf("  • Correctly marked endpoints: %d%n", correctlyMarkedEndpoints.size());
        System.out.printf("  • Missing x-eventually-consistent: %d%n", missingExtensionEndpoints.size());
        System.out.printf("  • Incorrect x-eventually-consistent: %d%n", incorrectExtensionEndpoints.size());
        System.out.printf("  • Unmatched controller endpoints: %d%n", unmatchedControllerEndpoints.size());
        System.out.printf("  • Unmatched OpenAPI endpoints: %d%n", unmatchedOpenApiEndpoints.size());
        System.out.println();

        if (!missingExtensionEndpoints.isEmpty()) {
            System.out.println("❌ Endpoints missing x-eventually-consistent extension:");
            missingExtensionEndpoints.forEach(endpoint ->
                System.out.printf("  • %s%n", endpoint));
            System.out.println();
        }

        if (!incorrectExtensionEndpoints.isEmpty()) {
            System.out.println("⚠️  Endpoints with incorrect x-eventually-consistent extension:");
            incorrectExtensionEndpoints.forEach(endpoint ->
                System.out.printf("  • %s%n", endpoint));
            System.out.println();
        }

        if (!unmatchedControllerEndpoints.isEmpty()) {
            System.out.println("🔍 Controller endpoints not found in OpenAPI spec:");
            unmatchedControllerEndpoints.forEach(endpoint ->
                System.out.printf("  • %s%n", endpoint));
            System.out.println();
        }

        if (!unmatchedOpenApiEndpoints.isEmpty()) {
            System.out.println("🔍 OpenAPI endpoints not found in controllers:");
            unmatchedOpenApiEndpoints.forEach(endpoint ->
                System.out.printf("  • %s%n", endpoint));
            System.out.println();
        }

        if (correctlyMarkedEndpoints.size() == controllerEndpoints.size() &&
            missingExtensionEndpoints.isEmpty() &&
            incorrectExtensionEndpoints.isEmpty()) {
            System.out.println("✅ All endpoints are correctly marked!");
        }

        System.out.println("=".repeat(80));
    }
}
