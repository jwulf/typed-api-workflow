package io.camunda.tools;

import io.camunda.tools.matcher.PathMatcher;
import io.camunda.tools.model.AnalysisReport;
import io.camunda.tools.model.ControllerEndpoint;
import io.camunda.tools.model.OpenApiEndpoint;
import io.camunda.tools.parser.ControllerParser;
import io.camunda.tools.parser.OpenApiParser;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class RestApiConsistencyAnalyzer {

    private final ControllerParser controllerParser = new ControllerParser();
    private final OpenApiParser openApiParser = new OpenApiParser();
    private final PathMatcher pathMatcher = new PathMatcher();

    public static void main(String[] args) {
        if (args.length < 2) {
            System.err.println("Usage: java -jar rest-api-consistency-analyzer.jar <controllers-dir> <openapi-spec>");
            System.err.println("Example: java -jar rest-api-consistency-analyzer.jar zeebe/gateway-rest/src/main/java/io/camunda/zeebe/gateway/rest/controller zeebe/gateway-protocol/src/main/proto/rest-api.yaml");
            System.exit(1);
        }

        String controllersDir = args[0];
        String openApiSpec = args[1];

        RestApiConsistencyAnalyzer analyzer = new RestApiConsistencyAnalyzer();

        try {
            AnalysisReport report = analyzer.analyze(Paths.get(controllersDir), Paths.get(openApiSpec));
            report.printReport();

            // Exit with error code if there are fatal issues
            if (report.hasFatalErrors()) {
                System.err.println("❌ Fatal errors detected. Analysis failed.");
                System.exit(1);
            }

            // Print warnings but don't exit
            if (report.hasWarnings()) {
                System.out.println("⚠️  Warnings detected but analysis passed.");
            }

            if (!report.hasFatalErrors() && !report.hasWarnings()) {
                System.out.println("✅ Analysis passed with no issues!");
            }

        } catch (Exception e) {
            System.err.printf("Analysis failed: %s%n", e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    public AnalysisReport analyze(Path controllersDirectory, Path openApiSpecFile) throws Exception {

        System.out.println("🔍 Parsing controller files...");
        List<ControllerEndpoint> controllerEndpoints = controllerParser.parseControllers(controllersDirectory);

        System.out.println("📄 Parsing OpenAPI specification...");
        List<OpenApiEndpoint> openApiEndpoints = openApiParser.parseOpenApiSpec(openApiSpecFile);

        System.out.println("🔄 Analyzing consistency...");
        return performAnalysis(controllerEndpoints, openApiEndpoints, openApiParser.getPathLevelViolations());
    }

    private AnalysisReport performAnalysis(List<ControllerEndpoint> controllerEndpoints,
                                         List<OpenApiEndpoint> openApiEndpoints,
                                         List<String> pathLevelViolations) {

        List<String> correctlyMarkedEndpoints = new ArrayList<>();
        List<String> missingExtensionEndpoints = new ArrayList<>();
        List<String> incorrectExtensionEndpoints = new ArrayList<>();
        List<String> unmatchedControllerEndpoints = new ArrayList<>();
        List<String> unmatchedOpenApiEndpoints = new ArrayList<>();
        List<String> endpointsMissingConsistencyDeclaration = new ArrayList<>();
        List<String> hiddenEndpoints = new ArrayList<>();
        List<String> hiddenEndpointsInSpec = new ArrayList<>();

        System.out.println("🔍 Validating controller-to-spec mapping...");

        // FATAL: Check each controller endpoint has matching OpenAPI endpoint
        for (ControllerEndpoint controllerEndpoint : controllerEndpoints) {
            // Skip hidden endpoints - they should NOT be in the spec
            if (controllerEndpoint.hasHiddenAnnotation()) {
                hiddenEndpoints.add(formatEndpoint(controllerEndpoint, "🔒 Hidden"));
                continue;
            }

            OpenApiEndpoint matchingOpenApiEndpoint = findMatchingOpenApiEndpoint(
                controllerEndpoint, openApiEndpoints);

            if (matchingOpenApiEndpoint == null) {
                // FATAL: Controller endpoint not found in spec
                unmatchedControllerEndpoints.add(formatEndpoint(controllerEndpoint, "❌ FATAL"));
                continue;
            }

            // FATAL: Check consistency annotation matches extension
            boolean controllerHasAnnotation = controllerEndpoint.hasRequiresSecondaryStorage();
            boolean openApiHasExtension = matchingOpenApiEndpoint.hasEventuallyConsistentExtension();

            if (controllerHasAnnotation && openApiHasExtension) {
                correctlyMarkedEndpoints.add(formatEndpoint(controllerEndpoint, "✅ Eventually Consistent"));
            } else if (!controllerHasAnnotation && matchingOpenApiEndpoint.isStronglyConsistent()) {
                correctlyMarkedEndpoints.add(formatEndpoint(controllerEndpoint, "✅ Strongly Consistent"));
            } else if (controllerHasAnnotation && !openApiHasExtension) {
                // FATAL: Controller says eventually consistent, but spec doesn't declare it
                String details = String.format("%s (Controller: %s.%s:%d, OpenAPI line: %d)",
                    controllerEndpoint.getSignature(),
                    controllerEndpoint.className(),
                    controllerEndpoint.methodName(),
                    controllerEndpoint.lineNumber(),
                    matchingOpenApiEndpoint.lineNumber());
                missingExtensionEndpoints.add(details);
            } else {
                // FATAL: Controller says strongly consistent, but spec says eventually consistent
                String details = String.format("%s (OpenAPI line: %d)",
                    controllerEndpoint.getSignature(),
                    matchingOpenApiEndpoint.lineNumber());
                incorrectExtensionEndpoints.add(details);
            }
        }

        System.out.println("📋 Validating spec completeness...");

        // Check for OpenAPI endpoints not found in controllers + require consistency declaration
        for (OpenApiEndpoint openApiEndpoint : openApiEndpoints) {
            ControllerEndpoint matchingControllerEndpoint = findMatchingControllerEndpoint(
                openApiEndpoint, controllerEndpoints);

            // FATAL: Every OpenAPI endpoint MUST have x-eventually-consistent declaration
            // This extension should be present with either true or false value
            if (!openApiEndpoint.hasConsistencyDeclaration()) {
                endpointsMissingConsistencyDeclaration.add(String.format("%s (OpenAPI line: %d)",
                    openApiEndpoint.getSignature(), openApiEndpoint.lineNumber()));
            }

            if (matchingControllerEndpoint == null) {
                // WARNING: OpenAPI endpoint not implemented yet
                unmatchedOpenApiEndpoints.add(String.format("%s (OpenAPI line: %d)",
                    openApiEndpoint.getSignature(), openApiEndpoint.lineNumber()));
            } else if (matchingControllerEndpoint.hasHiddenAnnotation()) {
                // FATAL: Hidden endpoint should NOT be in OpenAPI spec
                hiddenEndpointsInSpec.add(String.format("%s (OpenAPI line: %d, Controller: %s.%s:%d)",
                    openApiEndpoint.getSignature(), 
                    openApiEndpoint.lineNumber(),
                    matchingControllerEndpoint.className(),
                    matchingControllerEndpoint.methodName(),
                    matchingControllerEndpoint.lineNumber()));
            }
        }

        return new AnalysisReport(
            controllerEndpoints,
            openApiEndpoints,
            correctlyMarkedEndpoints,
            missingExtensionEndpoints,
            incorrectExtensionEndpoints,
            unmatchedControllerEndpoints,
            unmatchedOpenApiEndpoints,
            endpointsMissingConsistencyDeclaration,
            hiddenEndpoints,
            hiddenEndpointsInSpec,
            pathLevelViolations
        );
    }

    private OpenApiEndpoint findMatchingOpenApiEndpoint(ControllerEndpoint controllerEndpoint,
                                                       List<OpenApiEndpoint> openApiEndpoints) {
        return openApiEndpoints.stream()
            .filter(openApiEndpoint -> pathMatcher.endpointsMatch(controllerEndpoint, openApiEndpoint))
            .findFirst()
            .orElse(null);
    }

    private ControllerEndpoint findMatchingControllerEndpoint(OpenApiEndpoint openApiEndpoint,
                                                            List<ControllerEndpoint> controllerEndpoints) {
        return controllerEndpoints.stream()
            .filter(controllerEndpoint -> pathMatcher.endpointsMatch(controllerEndpoint, openApiEndpoint))
            .findFirst()
            .orElse(null);
    }

    /**
     * Check if OpenAPI endpoint has x-strongly-consistent extension.
     * For now, we assume absence of x-eventually-consistent means strongly consistent,
     * but this could be enhanced to check for explicit x-strongly-consistent extension.
     */
    private boolean hasStronglyConsistentExtension(OpenApiEndpoint openApiEndpoint) {
        // For now, we consider an endpoint strongly consistent if it doesn't have 
        // x-eventually-consistent extension. In the future, we might want to require
        // an explicit x-strongly-consistent extension.
        return !openApiEndpoint.hasEventuallyConsistentExtension();
    }

    private String formatEndpoint(ControllerEndpoint endpoint, String prefix) {
        String source = endpoint.inheritedFromClass() ? " (inherited)" : "";
        return String.format("%s %s%s (%s.%s:%d)",
            prefix,
            endpoint.getSignature(),
            source,
            endpoint.className(),
            endpoint.methodName(),
            endpoint.lineNumber());
    }
}
