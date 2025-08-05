package io.camunda.tools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import io.camunda.tools.matcher.PathMatcher;
import io.camunda.tools.model.ControllerEndpoint;
import io.camunda.tools.model.OpenApiEndpoint;
import io.camunda.tools.parser.ControllerParser;
import io.camunda.tools.parser.OpenApiParser;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class OpenApiPatcher {

    private final ControllerParser controllerParser = new ControllerParser();
    private final OpenApiParser openApiParser = new OpenApiParser();
    private final PathMatcher pathMatcher = new PathMatcher();
    private final ObjectMapper yamlMapper;

    public OpenApiPatcher() {
        YAMLFactory yamlFactory = new YAMLFactory()
            .enable(YAMLGenerator.Feature.MINIMIZE_QUOTES)
            .disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER);
        this.yamlMapper = new ObjectMapper(yamlFactory);
    }

    public static void main(String[] args) {
        if (args.length < 2) {
            System.err.println("Usage: java -cp rest-api-consistency-analyzer.jar io.camunda.tools.OpenApiPatcher <controllers-dir> <openapi-spec>");
            System.err.println("Example: java -cp rest-api-consistency-analyzer.jar io.camunda.tools.OpenApiPatcher zeebe/gateway-rest/src/main/java/io/camunda/zeebe/gateway/rest/controller zeebe/gateway-protocol/src/main/proto/rest-api.yaml");
            System.exit(1);
        }

        String controllersDir = args[0];
        String openApiSpec = args[1];

        OpenApiPatcher patcher = new OpenApiPatcher();

        try {
            int patchedCount = patcher.patchOpenApiSpec(Paths.get(controllersDir), Paths.get(openApiSpec));
            if (patchedCount > 0) {
                System.out.printf("✅ Successfully patched %d endpoints with x-eventually-consistent extension%n", patchedCount);
            } else {
                System.out.println("ℹ️ No patches needed - all endpoints are already correctly marked");
            }
        } catch (Exception e) {
            System.err.printf("Patching failed: %s%n", e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    public int patchOpenApiSpec(Path controllersDirectory, Path openApiSpecFile) throws Exception {

        System.out.println("🔍 Parsing controller files...");
        List<ControllerEndpoint> controllerEndpoints = controllerParser.parseControllers(controllersDirectory);

        System.out.println("📄 Loading OpenAPI specification...");
        String yamlContent = Files.readString(openApiSpecFile);
        JsonNode root = yamlMapper.readTree(yamlContent);

        if (!(root instanceof ObjectNode)) {
            throw new RuntimeException("OpenAPI root is not an object");
        }

        ObjectNode rootNode = (ObjectNode) root;
        final int[] patchedCount = {0}; // Use array to make it effectively final

        System.out.println("🔄 Applying patches...");

        // Extract server base path
        String basePath = extractBasePath(root);

        JsonNode paths = root.get("paths");
        if (paths instanceof ObjectNode) {
            ObjectNode pathsNode = (ObjectNode) paths;

            pathsNode.fieldNames().forEachRemaining(pathName -> {
                String fullPath = combinePaths(basePath, pathName);

                if (isV2Path(fullPath)) {
                    JsonNode pathNode = pathsNode.get(pathName);
                    if (pathNode instanceof ObjectNode) {
                        ObjectNode pathObjectNode = (ObjectNode) pathNode;

                        pathObjectNode.fieldNames().forEachRemaining(methodName -> {
                            if (isHttpMethod(methodName)) {
                                JsonNode methodNode = pathObjectNode.get(methodName);
                                if (methodNode instanceof ObjectNode) {
                                    ObjectNode methodObjectNode = (ObjectNode) methodNode;

                                    // Find matching controller endpoint
                                    ControllerEndpoint matchingController = findMatchingControllerEndpoint(
                                        fullPath, methodName, controllerEndpoints);

                                    if (matchingController != null &&
                                        matchingController.hasRequiresSecondaryStorage() &&
                                        !hasEventuallyConsistentExtension(methodObjectNode)) {

                                        // Add the extension
                                        methodObjectNode.put("x-eventually-consistent", true);
                                        patchedCount[0]++;
                                        System.out.printf("  ✅ Added x-eventually-consistent to %s %s%n",
                                            methodName.toUpperCase(), fullPath);
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }

        // Write back the modified YAML
        if (patchedCount[0] > 0) {
            System.out.println("💾 Writing patched OpenAPI specification...");
            String patchedYaml = yamlMapper.writeValueAsString(rootNode);
            Files.writeString(openApiSpecFile, patchedYaml);
        }

        return patchedCount[0];
    }

    private String extractBasePath(JsonNode root) {
        JsonNode servers = root.get("servers");
        if (servers != null && servers.isArray() && servers.size() > 0) {
            JsonNode firstServer = servers.get(0);
            JsonNode url = firstServer.get("url");
            if (url != null) {
                String serverUrl = url.asText();
                int lastSlashIndex = serverUrl.lastIndexOf('/');
                if (lastSlashIndex > serverUrl.lastIndexOf('}')) {
                    return serverUrl.substring(lastSlashIndex);
                }
            }
        }
        return "";
    }

    private String combinePaths(String basePath, String pathName) {
        if (basePath.isEmpty()) {
            return pathName;
        }

        String cleanBasePath = basePath.endsWith("/") ? basePath.substring(0, basePath.length() - 1) : basePath;
        String cleanPathName = pathName.startsWith("/") ? pathName : "/" + pathName;

        return cleanBasePath + cleanPathName;
    }

    private boolean isV2Path(String path) {
        return path.startsWith("/") && path.contains("v2");
    }

    private boolean isHttpMethod(String methodName) {
        return methodName.equals("get") ||
               methodName.equals("post") ||
               methodName.equals("put") ||
               methodName.equals("delete") ||
               methodName.equals("patch") ||
               methodName.equals("head") ||
               methodName.equals("options");
    }

    private ControllerEndpoint findMatchingControllerEndpoint(String openApiPath, String openApiMethod,
                                                            List<ControllerEndpoint> controllerEndpoints) {
        return controllerEndpoints.stream()
            .filter(endpoint -> pathMatcher.pathsMatch(endpoint.path(), openApiPath) &&
                              endpoint.httpMethod().equalsIgnoreCase(openApiMethod))
            .findFirst()
            .orElse(null);
    }

    private boolean hasEventuallyConsistentExtension(ObjectNode methodNode) {
        JsonNode extension = methodNode.get("x-eventually-consistent");
        return extension != null && extension.isBoolean() && extension.booleanValue();
    }
}
