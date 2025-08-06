package io.camunda.tools.parser;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.expr.AnnotationExpr;
import com.github.javaparser.ast.expr.MemberValuePair;
import com.github.javaparser.ast.expr.NormalAnnotationExpr;
import com.github.javaparser.ast.expr.SingleMemberAnnotationExpr;
import com.github.javaparser.ast.expr.StringLiteralExpr;
import io.camunda.tools.model.ControllerEndpoint;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public class ControllerParser {

    private final JavaParser javaParser = new JavaParser();

    public List<ControllerEndpoint> parseControllers(Path controllersDirectory) throws IOException {
        List<ControllerEndpoint> endpoints = new ArrayList<>();

        try (Stream<Path> paths = Files.walk(controllersDirectory)) {
            paths.filter(path -> path.toString().endsWith(".java"))
                 .forEach(javaFile -> {
                     try {
                         endpoints.addAll(parseControllerFile(javaFile));
                     } catch (Exception e) {
                         System.err.printf("Error parsing %s: %s%n", javaFile, e.getMessage());
                     }
                 });
        }

        return endpoints;
    }

    private List<ControllerEndpoint> parseControllerFile(Path javaFile) throws IOException {
        List<ControllerEndpoint> endpoints = new ArrayList<>();

        CompilationUnit cu = javaParser.parse(javaFile).getResult()
            .orElseThrow(() -> new RuntimeException("Failed to parse " + javaFile));

        cu.findAll(ClassOrInterfaceDeclaration.class).forEach(classDecl -> {
            String className = classDecl.getNameAsString();

            // Check for @RequestMapping at class level
            List<String> classBasePaths = getRequestMappingPaths(classDecl.getAnnotations());

            // Check if class has @RequiresSecondaryStorage
            boolean classHasRequiresSecondaryStorage = hasRequiresSecondaryStorageAnnotation(classDecl.getAnnotations());
            
            // Check if class has @Hidden
            boolean classHasHiddenAnnotation = hasHiddenAnnotation(classDecl.getAnnotations());

            // Process each base path that contains v2
            for (String classBasePath : classBasePaths) {
                if (isV2Path(classBasePath)) {
                    // Normalize path to ensure leading slash
                    String normalizedBasePath = classBasePath.startsWith("/") ? classBasePath : "/" + classBasePath;

                    // Process each method in the class
                    classDecl.findAll(MethodDeclaration.class).forEach(method -> {
                        processMethod(endpoints, className, method, normalizedBasePath, classHasRequiresSecondaryStorage, classHasHiddenAnnotation);
                    });
                }
            }
        });

        return endpoints;
    }

    private void processMethod(List<ControllerEndpoint> endpoints, String className,
                             MethodDeclaration method, String classBasePath,
                             boolean classHasRequiresSecondaryStorage, boolean classHasHiddenAnnotation) {

        List<AnnotationExpr> methodAnnotations = method.getAnnotations();

        // Check for HTTP method annotations (CamundaGetMapping, CamundaPostMapping, etc.)
        for (AnnotationExpr annotation : methodAnnotations) {
            String annotationName = annotation.getNameAsString();

            if (isHttpMethodAnnotation(annotationName)) {
                String httpMethod = extractHttpMethod(annotationName);
                String methodPath = getMethodPath(annotation);
                String fullPath = combinePaths(classBasePath, methodPath);

                // Check if method has @RequiresSecondaryStorage
                boolean methodHasRequiresSecondaryStorage = hasRequiresSecondaryStorageAnnotation(methodAnnotations);
                
                // Check if method has @Hidden
                boolean methodHasHiddenAnnotation = hasHiddenAnnotation(methodAnnotations);

                // Determine if this endpoint requires secondary storage
                boolean hasRequiresSecondaryStorage = classHasRequiresSecondaryStorage || methodHasRequiresSecondaryStorage;
                boolean inheritedFromClass = classHasRequiresSecondaryStorage && !methodHasRequiresSecondaryStorage;
                
                // Determine if this endpoint is hidden
                boolean hasHidden = classHasHiddenAnnotation || methodHasHiddenAnnotation;

                ControllerEndpoint endpoint = new ControllerEndpoint(
                    className,
                    method.getNameAsString(),
                    httpMethod,
                    fullPath,
                    hasRequiresSecondaryStorage,
                    inheritedFromClass,
                    hasHidden,
                    method.getBegin().map(pos -> pos.line).orElse(-1)
                );

                endpoints.add(endpoint);
            }
        }
    }

    private List<String> getRequestMappingPaths(List<AnnotationExpr> annotations) {
        List<String> paths = new ArrayList<>();

        Optional<AnnotationExpr> requestMappingOpt = annotations.stream()
            .filter(ann -> ann.getNameAsString().equals("RequestMapping"))
            .findFirst();

        if (requestMappingOpt.isPresent()) {
            AnnotationExpr annotation = requestMappingOpt.get();

            if (annotation instanceof SingleMemberAnnotationExpr) {
                SingleMemberAnnotationExpr singleMember = (SingleMemberAnnotationExpr) annotation;
                String rawValue = singleMember.getMemberValue().toString();
                paths.addAll(parsePathValues(rawValue));
            } else if (annotation instanceof NormalAnnotationExpr) {
                NormalAnnotationExpr normalAnnotation = (NormalAnnotationExpr) annotation;
                String rawValue = normalAnnotation.getPairs().stream()
                    .filter(pair -> "path".equals(pair.getNameAsString()) || "value".equals(pair.getNameAsString()))
                    .findFirst()
                    .map(pair -> pair.getValue().toString())
                    .orElse("");
                paths.addAll(parsePathValues(rawValue));
            }
        }

        return paths;
    }

    private List<String> parsePathValues(String rawValue) {
        List<String> paths = new ArrayList<>();

        if (rawValue.startsWith("{") && rawValue.endsWith("}")) {
            // Handle array: {"path1", "path2"}
            String arrayContent = rawValue.substring(1, rawValue.length() - 1);
            String[] values = arrayContent.split(",");

            for (String val : values) {
                String cleanVal = val.trim();
                if (cleanVal.startsWith("\"") && cleanVal.endsWith("\"")) {
                    cleanVal = cleanVal.substring(1, cleanVal.length() - 1);
                }
                paths.add(cleanVal);
            }
        } else {
            // Handle single value
            String cleanVal = rawValue.trim();
            if (cleanVal.startsWith("\"") && cleanVal.endsWith("\"")) {
                cleanVal = cleanVal.substring(1, cleanVal.length() - 1);
            }
            paths.add(cleanVal);
        }

        return paths;
    }

    private String extractPathFromAnnotation(AnnotationExpr annotation) {
        if (annotation instanceof SingleMemberAnnotationExpr) {
            SingleMemberAnnotationExpr singleMember = (SingleMemberAnnotationExpr) annotation;
            return extractStringValue(singleMember.getMemberValue().toString());
        } else if (annotation instanceof NormalAnnotationExpr) {
            NormalAnnotationExpr normalAnnotation = (NormalAnnotationExpr) annotation;
            return normalAnnotation.getPairs().stream()
                .filter(pair -> "path".equals(pair.getNameAsString()) || "value".equals(pair.getNameAsString()))
                .findFirst()
                .map(pair -> extractStringValue(pair.getValue().toString()))
                .orElse("");
        }
        return "";
    }

    private String getMethodPath(AnnotationExpr annotation) {
        String pathValue = "";

        if (annotation instanceof SingleMemberAnnotationExpr) {
            SingleMemberAnnotationExpr singleMember = (SingleMemberAnnotationExpr) annotation;
            pathValue = extractStringValue(singleMember.getMemberValue().toString());
        } else if (annotation instanceof NormalAnnotationExpr) {
            NormalAnnotationExpr normalAnnotation = (NormalAnnotationExpr) annotation;
            pathValue = normalAnnotation.getPairs().stream()
                .filter(pair -> "path".equals(pair.getNameAsString()) || "value".equals(pair.getNameAsString()))
                .findFirst()
                .map(pair -> extractStringValue(pair.getValue().toString()))
                .orElse("");
        }

        return pathValue;
    }

    private String extractStringValue(String value) {
        // Remove quotes and handle arrays
        if (value.startsWith("[") && value.endsWith("]")) {
            // Handle array - extract all values and filter for v2
            String arrayContent = value.substring(1, value.length() - 1);
            String[] values = arrayContent.split(",");

            for (String val : values) {
                String cleanVal = val.trim();
                if (cleanVal.startsWith("\"") && cleanVal.endsWith("\"")) {
                    cleanVal = cleanVal.substring(1, cleanVal.length() - 1);
                }
                // Return the first v2 path found, or v1 if no v2 (we'll filter later)
                if (cleanVal.contains("/v2")) {
                    return cleanVal;
                }
            }

            // If no v2 found, return first value (will be filtered out later if not v2)
            if (values.length > 0) {
                String firstVal = values[0].trim();
                if (firstVal.startsWith("\"") && firstVal.endsWith("\"")) {
                    return firstVal.substring(1, firstVal.length() - 1);
                }
                return firstVal;
            }
        }

        if (value.startsWith("\"") && value.endsWith("\"")) {
            return value.substring(1, value.length() - 1);
        }
        return value;
    }

    private boolean hasRequiresSecondaryStorageAnnotation(List<AnnotationExpr> annotations) {
        return annotations.stream()
            .anyMatch(ann -> ann.getNameAsString().equals("RequiresSecondaryStorage"));
    }

    private boolean hasHiddenAnnotation(List<AnnotationExpr> annotations) {
        return annotations.stream()
            .anyMatch(ann -> ann.getNameAsString().equals("Hidden"));
    }

    private boolean isHttpMethodAnnotation(String annotationName) {
        return annotationName.startsWith("Camunda") &&
               (annotationName.contains("GetMapping") ||
                annotationName.contains("PostMapping") ||
                annotationName.contains("PutMapping") ||
                annotationName.contains("DeleteMapping") ||
                annotationName.contains("PatchMapping"));
    }

    private String extractHttpMethod(String annotationName) {
        if (annotationName.contains("GetMapping")) return "GET";
        if (annotationName.contains("PostMapping")) return "POST";
        if (annotationName.contains("PutMapping")) return "PUT";
        if (annotationName.contains("DeleteMapping")) return "DELETE";
        if (annotationName.contains("PatchMapping")) return "PATCH";
        return "UNKNOWN";
    }

    private String combinePaths(String basePath, String methodPath) {
        if (methodPath.isEmpty()) {
            return basePath;
        }

        String cleanBasePath = basePath.endsWith("/") ? basePath.substring(0, basePath.length() - 1) : basePath;
        String cleanMethodPath = methodPath.startsWith("/") ? methodPath : "/" + methodPath;

        return cleanBasePath + cleanMethodPath;
    }

    private boolean isV2Path(String path) {
        return path.contains("/v2") || path.contains("v2/");
    }
}
