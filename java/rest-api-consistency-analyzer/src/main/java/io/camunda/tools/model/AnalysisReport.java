package io.camunda.tools.model;

import java.util.List;

public record AnalysisReport(
    List<ControllerEndpoint> controllerEndpoints,
    List<OpenApiEndpoint> openApiEndpoints,
    List<String> correctlyMarkedEndpoints,
    List<String> missingExtensionEndpoints,
    List<String> incorrectExtensionEndpoints,
    List<String> unmatchedControllerEndpoints,
    List<String> unmatchedOpenApiEndpoints,
    List<String> endpointsMissingConsistencyDeclaration,
    List<String> hiddenEndpoints,
    List<String> hiddenEndpointsInSpec,
    List<String> pathLevelExtensionViolations
) {

    /**
     * Check if there are any fatal errors that should cause the analyzer to fail.
     * Fatal errors include:
     * - Controller endpoints not found in OpenAPI spec (excluding hidden endpoints)
     * - Mismatched consistency annotations between controller and spec
     * - OpenAPI endpoints missing consistency declarations
     * - Hidden endpoints found in OpenAPI spec (should not be documented)
     * - x-eventually-consistent declared at path level (should be operation-level only)
     */
    public boolean hasFatalErrors() {
        return !unmatchedControllerEndpoints.isEmpty() ||
               !missingExtensionEndpoints.isEmpty() ||
               !incorrectExtensionEndpoints.isEmpty() ||
               !endpointsMissingConsistencyDeclaration.isEmpty() ||
               !hiddenEndpointsInSpec.isEmpty() ||
               !pathLevelExtensionViolations.isEmpty();
    }

    /**
     * Check if there are any warnings.
     * Warnings include:
     * - OpenAPI endpoints not yet implemented in controllers
     */
    public boolean hasWarnings() {
        return !unmatchedOpenApiEndpoints.isEmpty();
    }

    public void printReport() {
        System.out.println("=".repeat(80));
        System.out.println("REST API CONSISTENCY ANALYSIS REPORT");
        System.out.println("=".repeat(80));

        System.out.printf("📊 Summary:%n");
        System.out.printf("  • Controller v2 endpoints found: %d%n", controllerEndpoints.size());
        System.out.printf("  • OpenAPI v2 endpoints found: %d%n", openApiEndpoints.size());
        System.out.printf("  • Correctly documented endpoints: %d%n", correctlyMarkedEndpoints.size());
        System.out.printf("  • Hidden endpoints (excluded from spec): %d%n", hiddenEndpoints.size());
        System.out.println();
        // Early indicator only; detailed fatal errors moved to end for easier visibility
        if (hasFatalErrors()) {
            System.out.println("❌ Fatal errors detected (see detailed list at end of report).\n");
        }

        // Warnings
        if (hasWarnings()) {
            System.out.println("⚠️  WARNINGS:");
            
            if (!unmatchedOpenApiEndpoints.isEmpty()) {
                System.out.printf("  • OpenAPI endpoints not yet implemented: %d%n", unmatchedOpenApiEndpoints.size());
                unmatchedOpenApiEndpoints.forEach(endpoint ->
                    System.out.printf("    - %s%n", endpoint));
                System.out.println();
            }
        }

        // Success summary
        if (!hasFatalErrors() && !hasWarnings()) {
            System.out.println("✅ Perfect! All endpoints are correctly documented and implemented.");
        } else if (!hasFatalErrors()) {
            System.out.println("✅ All implemented endpoints are correctly documented.");
            System.out.println("   (Some endpoints in spec are not yet implemented - see warnings above)");
        }

        // Detailed breakdown of correctly marked endpoints
        if (!correctlyMarkedEndpoints.isEmpty()) {
            System.out.println("📋 Correctly documented endpoints:");
            correctlyMarkedEndpoints.forEach(endpoint ->
                System.out.printf("  %s%n", endpoint));
            System.out.println();
        }

        // Show hidden endpoints that are correctly excluded from spec
        if (!hiddenEndpoints.isEmpty()) {
            System.out.println("🔒 Hidden endpoints (correctly excluded from OpenAPI spec):");
            hiddenEndpoints.forEach(endpoint ->
                System.out.printf("  %s%n", endpoint));
            System.out.println();
        }

        // Detailed Fatal Errors (moved to end)
        if (hasFatalErrors()) {
            System.out.println("❌ FATAL ERRORS (detailed):");

            if (!unmatchedControllerEndpoints.isEmpty()) {
                System.out.printf("  • Controller endpoints missing from OpenAPI spec: %d%n", unmatchedControllerEndpoints.size());
                unmatchedControllerEndpoints.forEach(endpoint ->
                    System.out.printf("    - %s%n", endpoint));
                System.out.println();
            }

            if (!missingExtensionEndpoints.isEmpty()) {
                System.out.printf("  • Controller annotated eventual, but spec has NO consistency declaration (spec canonical): %d%n", missingExtensionEndpoints.size());
                System.out.println("    (Remove controller annotation or add explicit declaration to spec; spec is treated as source of truth)");
                missingExtensionEndpoints.forEach(endpoint ->
                    System.out.printf("    - %s%n", endpoint));
                System.out.println();
            }

            if (!incorrectExtensionEndpoints.isEmpty()) {
                System.out.printf("  • Controller consistency annotation disagrees with spec (spec canonical): %d%n", incorrectExtensionEndpoints.size());
                System.out.println("    (Update controller annotation to match the spec's declared consistency)");
                incorrectExtensionEndpoints.forEach(endpoint ->
                    System.out.printf("    - %s%n", endpoint));
                System.out.println();
            }

            if (!endpointsMissingConsistencyDeclaration.isEmpty()) {
                System.out.printf("  • OpenAPI endpoints missing consistency declaration: %d%n", endpointsMissingConsistencyDeclaration.size());
                System.out.println("    (All endpoints must have either x-eventually-consistent: true or x-eventually-consistent: false)");
                endpointsMissingConsistencyDeclaration.forEach(endpoint ->
                    System.out.printf("    - %s%n", endpoint));
                System.out.println();
            }

            if (!hiddenEndpointsInSpec.isEmpty()) {
                System.out.printf("  • Hidden endpoints incorrectly documented in spec: %d%n", hiddenEndpointsInSpec.size());
                System.out.println("    (Endpoints annotated with @Hidden should NOT appear in OpenAPI spec)");
                hiddenEndpointsInSpec.forEach(endpoint ->
                    System.out.printf("    - %s%n", endpoint));
                System.out.println();
            }

            if (!pathLevelExtensionViolations.isEmpty()) {
                System.out.printf("  • Paths with x-eventually-consistent declared at path level: %d%n", pathLevelExtensionViolations.size());
                System.out.println("    (x-eventually-consistent should only be declared at operation/method level for proper granularity)");
                pathLevelExtensionViolations.forEach(violation ->
                    System.out.printf("    - %s%n", violation));
                System.out.println();
            }
        }

        System.out.println("=".repeat(80));
    }
}
