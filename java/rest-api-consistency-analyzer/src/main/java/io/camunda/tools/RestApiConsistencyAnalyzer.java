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

            // Exit with error code if there are issues
            if (!report.missingExtensionEndpoints().isEmpty() ||
                !report.incorrectExtensionEndpoints().isEmpty()) {
                System.exit(1);
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
        return performAnalysis(controllerEndpoints, openApiEndpoints);
    }

    private AnalysisReport performAnalysis(List<ControllerEndpoint> controllerEndpoints,
                                         List<OpenApiEndpoint> openApiEndpoints) {

        List<String> correctlyMarkedEndpoints = new ArrayList<>();
        List<String> missingExtensionEndpoints = new ArrayList<>();
        List<String> incorrectExtensionEndpoints = new ArrayList<>();
        List<String> unmatchedControllerEndpoints = new ArrayList<>();
        List<String> unmatchedOpenApiEndpoints = new ArrayList<>();

        // Check each controller endpoint
        for (ControllerEndpoint controllerEndpoint : controllerEndpoints) {
            OpenApiEndpoint matchingOpenApiEndpoint = findMatchingOpenApiEndpoint(
                controllerEndpoint, openApiEndpoints);

            if (matchingOpenApiEndpoint != null) {
                // Found matching endpoint, check consistency
                boolean controllerHasAnnotation = controllerEndpoint.hasRequiresSecondaryStorage();
                boolean openApiHasExtension = matchingOpenApiEndpoint.hasEventuallyConsistentExtension();

                if (controllerHasAnnotation && openApiHasExtension) {
                    correctlyMarkedEndpoints.add(formatEndpoint(controllerEndpoint, "✅"));
                } else if (controllerHasAnnotation && !openApiHasExtension) {
                    String details = String.format("%s (Controller: %s.%s:%d, OpenAPI line: %d)",
                        controllerEndpoint.getSignature(),
                        controllerEndpoint.className(),
                        controllerEndpoint.methodName(),
                        controllerEndpoint.lineNumber(),
                        matchingOpenApiEndpoint.lineNumber());
                    missingExtensionEndpoints.add(details);
                } else if (!controllerHasAnnotation && openApiHasExtension) {
                    String details = String.format("%s (OpenAPI line: %d)",
                        controllerEndpoint.getSignature(),
                        matchingOpenApiEndpoint.lineNumber());
                    incorrectExtensionEndpoints.add(details);
                } else {
                    // Both false - correctly not marked
                    correctlyMarkedEndpoints.add(formatEndpoint(controllerEndpoint, "✅"));
                }
            } else {
                // No matching OpenAPI endpoint found
                unmatchedControllerEndpoints.add(formatEndpoint(controllerEndpoint, "❓"));
            }
        }

        // Check for OpenAPI endpoints not found in controllers
        for (OpenApiEndpoint openApiEndpoint : openApiEndpoints) {
            ControllerEndpoint matchingControllerEndpoint = findMatchingControllerEndpoint(
                openApiEndpoint, controllerEndpoints);

            if (matchingControllerEndpoint == null) {
                unmatchedOpenApiEndpoints.add(String.format("%s (OpenAPI line: %d)",
                    openApiEndpoint.getSignature(), openApiEndpoint.lineNumber()));
            }
        }

        return new AnalysisReport(
            controllerEndpoints,
            openApiEndpoints,
            correctlyMarkedEndpoints,
            missingExtensionEndpoints,
            incorrectExtensionEndpoints,
            unmatchedControllerEndpoints,
            unmatchedOpenApiEndpoints
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
