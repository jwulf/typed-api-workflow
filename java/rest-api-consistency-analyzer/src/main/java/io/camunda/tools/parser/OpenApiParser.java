package io.camunda.tools.parser;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import io.camunda.tools.model.OpenApiEndpoint;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class OpenApiParser {

    private final ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
    private final List<String> pathLevelViolations = new ArrayList<>();

    public List<OpenApiEndpoint> parseOpenApiSpec(Path openApiFile) throws IOException {
        List<OpenApiEndpoint> endpoints = new ArrayList<>();

        String content = Files.readString(openApiFile);
        JsonNode root = yamlMapper.readTree(content);

        // Extract server base path
        String basePath = extractBasePath(root);

        JsonNode paths = root.get("paths");
        if (paths != null) {
            Iterator<String> pathNames = paths.fieldNames();

            while (pathNames.hasNext()) {
                String pathName = pathNames.next();

                // Combine server base path with the path
                String fullPath = combinePaths(basePath, pathName);

                // Only process v2 paths
                if (isV2Path(fullPath)) {
                    JsonNode pathNode = paths.get(pathName);
                    processPathNode(endpoints, fullPath, pathNode, content);
                }
            }
        }

        return endpoints;
    }

    public List<String> getPathLevelViolations() {
        return new ArrayList<>(pathLevelViolations);
    }

    private void processPathNode(List<OpenApiEndpoint> endpoints, String fullPathName,
                               JsonNode pathNode, String originalContent) {

        // FATAL: Check for x-eventually-consistent at path level (should only be at operation level)
        JsonNode pathLevelExtension = pathNode.get("x-eventually-consistent");
        if (pathLevelExtension != null) {
            String originalPathName = extractOriginalPathName(fullPathName);
            int lineNumber = findPathLineNumber(originalContent, originalPathName);
            pathLevelViolations.add(String.format("%s (OpenAPI line: %d) - x-eventually-consistent declared at path level", 
                fullPathName, lineNumber));
        }

        Iterator<String> methodNames = pathNode.fieldNames();

        while (methodNames.hasNext()) {
            String methodName = methodNames.next();

            // Skip non-HTTP methods (like parameters, etc.)
            if (isHttpMethod(methodName)) {
                JsonNode methodNode = pathNode.get(methodName);

                // Check for x-eventually-consistent extension
                Boolean eventuallyConsistentValue = null;
                JsonNode extension = methodNode.get("x-eventually-consistent");
                if (extension != null && extension.isBoolean()) {
                    eventuallyConsistentValue = extension.booleanValue();
                }

                // Try to find line number (this is approximate, using the original path name)
                String originalPathName = extractOriginalPathName(fullPathName);
                int lineNumber = findLineNumber(originalContent, originalPathName, methodName);

                OpenApiEndpoint endpoint = new OpenApiEndpoint(
                    fullPathName,
                    methodName,
                    eventuallyConsistentValue,
                    lineNumber
                );

                endpoints.add(endpoint);
            }
        }
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

    private int findLineNumber(String content, String pathName, String methodName) {
        String[] lines = content.split("\n");

        boolean foundPath = false;
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();

            // Look for the path
            if (!foundPath && line.startsWith(pathName + ":")) {
                foundPath = true;
                continue;
            }

            // If we found the path, look for the method
            if (foundPath && line.startsWith(methodName + ":")) {
                return i + 1; // Line numbers are 1-based
            }

            // If we hit another path, reset
            if (foundPath && line.endsWith(":") && !line.startsWith(" ") && !line.startsWith("\t")) {
                foundPath = false;
            }
        }

        return -1; // Not found
    }

    private int findPathLineNumber(String content, String pathName) {
        String[] lines = content.split("\n");
        
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            // Look for the path declaration
            if (line.startsWith(pathName + ":")) {
                return i + 1; // Line numbers are 1-based
            }
        }
        
        return -1; // Not found
    }

    private String extractBasePath(JsonNode root) {
        JsonNode servers = root.get("servers");
        if (servers != null && servers.isArray() && servers.size() > 0) {
            JsonNode firstServer = servers.get(0);
            JsonNode url = firstServer.get("url");
            if (url != null) {
                String serverUrl = url.asText();
                // Extract path part from URL template
                // Example: "{schema}://{host}:{port}/v2" -> "/v2"
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

    private String extractOriginalPathName(String fullPath) {
        // Remove the /v2 prefix to get the original path name from the spec
        if (fullPath.startsWith("/v2")) {
            String remaining = fullPath.substring(3);
            return remaining.isEmpty() ? "/" : remaining;
        }
        return fullPath;
    }
}
