package io.camunda.openapi.scanner.analyzer;

import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.expr.*;
import com.github.javaparser.ast.stmt.IfStmt;
import com.github.javaparser.ast.body.MethodDeclaration;
import io.camunda.openapi.scanner.model.MutualExclusivityPattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Analyzes Java AST to detect mutual exclusivity validation patterns.
 */
public class MutualExclusivityAnalyzer {
    
    private static final Logger log = LoggerFactory.getLogger(MutualExclusivityAnalyzer.class);
    
    // Known error constants that indicate XOR validation
    private static final Set<String> XOR_ERROR_CONSTANTS = Set.of(
        "ERROR_MESSAGE_AT_LEAST_ONE_FIELD",
        "ERROR_MESSAGE_ONLY_ONE_FIELD"
    );
    
    // Patterns for field access
    private static final Pattern GETTER_PATTERN = Pattern.compile("get([A-Z][a-zA-Z0-9]*)\\(\\)");
    private static final Pattern DEFINITION_ID_KEY_PATTERN = Pattern.compile("(\\w+)(?:Definition)?(?:Id|Key)");
    
    /**
     * Analyzes a compilation unit to find mutual exclusivity patterns.
     */
    public List<MutualExclusivityPattern> analyze(CompilationUnit cu, String fileName) {
        List<MutualExclusivityPattern> patterns = new ArrayList<>();
        
        // Find all method declarations
        cu.findAll(MethodDeclaration.class).forEach(method -> {
            patterns.addAll(analyzeMethod(method, fileName, cu));
        });
        
        return patterns;
    }
    
    private List<MutualExclusivityPattern> analyzeMethod(MethodDeclaration method, String fileName, CompilationUnit cu) {
        List<MutualExclusivityPattern> patterns = new ArrayList<>();
        
        // Look for if statements that might contain XOR validation
        method.findAll(IfStmt.class).forEach(ifStmt -> {
            Optional<MutualExclusivityPattern> pattern = analyzeIfStatement(ifStmt, method, fileName, cu);
            pattern.ifPresent(patterns::add);
        });
        
        return patterns;
    }
    
    private Optional<MutualExclusivityPattern> analyzeIfStatement(IfStmt ifStmt, MethodDeclaration method, String fileName, CompilationUnit cu) {
        Expression condition = ifStmt.getCondition();
        
        log.debug("Analyzing if statement: {}", condition);
        
        // Look for the XOR pattern: (fieldA == null && fieldB == null)
        if (isBothNullCheck(condition)) {
            log.debug("Found both null check pattern");
            // Check if there's a corresponding "both not null" check nearby
            Optional<IfStmt> bothNotNullCheck = findCorrespondingBothNotNullCheck(method, condition);
            
            if (bothNotNullCheck.isPresent()) {
                log.debug("Found corresponding both not null check");
                return createMutualExclusivityPattern(ifStmt, bothNotNullCheck.get(), method, fileName, cu);
            } else {
                log.debug("No corresponding both not null check found");
            }
        }
        
        return Optional.empty();
    }
    
    private boolean isBothNullCheck(Expression condition) {
        if (!(condition instanceof BinaryExpr)) {
            return false;
        }
        
        BinaryExpr binaryExpr = (BinaryExpr) condition;
        if (binaryExpr.getOperator() != BinaryExpr.Operator.AND) {
            return false;
        }
        
        // Check if both sides are null equality checks
        return isNullEqualityCheck(binaryExpr.getLeft()) && isNullEqualityCheck(binaryExpr.getRight());
    }
    
    private boolean isNullEqualityCheck(Expression expr) {
        if (!(expr instanceof BinaryExpr)) {
            return false;
        }
        
        BinaryExpr binaryExpr = (BinaryExpr) expr;
        if (binaryExpr.getOperator() != BinaryExpr.Operator.EQUALS) {
            return false;
        }
        
        // Check if one side is null and the other is a method call
        return (isNullLiteral(binaryExpr.getLeft()) && isMethodCall(binaryExpr.getRight())) ||
               (isNullLiteral(binaryExpr.getRight()) && isMethodCall(binaryExpr.getLeft()));
    }
    
    private boolean isNullLiteral(Expression expr) {
        return expr instanceof NullLiteralExpr;
    }
    
    private boolean isMethodCall(Expression expr) {
        return expr instanceof MethodCallExpr;
    }
    
    private Optional<IfStmt> findCorrespondingBothNotNullCheck(MethodDeclaration method, Expression bothNullCondition) {
        List<String> fieldNames = extractFieldNamesFromBothNullCheck(bothNullCondition);
        
        return method.findAll(IfStmt.class).stream()
            .filter(ifStmt -> isBothNotNullCheckForFields(ifStmt.getCondition(), fieldNames))
            .findFirst();
    }
    
    private List<String> extractFieldNamesFromBothNullCheck(Expression condition) {
        List<String> fieldNames = new ArrayList<>();
        
        if (condition instanceof BinaryExpr) {
            BinaryExpr binaryExpr = (BinaryExpr) condition;
            
            fieldNames.addAll(extractFieldNamesFromNullCheck(binaryExpr.getLeft()));
            fieldNames.addAll(extractFieldNamesFromNullCheck(binaryExpr.getRight()));
        }
        
        return fieldNames;
    }
    
    private List<String> extractFieldNamesFromNullCheck(Expression expr) {
        List<String> fieldNames = new ArrayList<>();
        
        if (expr instanceof BinaryExpr) {
            BinaryExpr binaryExpr = (BinaryExpr) expr;
            
            // Find the method call side
            Expression methodCall = null;
            if (isMethodCall(binaryExpr.getLeft())) {
                methodCall = binaryExpr.getLeft();
            } else if (isMethodCall(binaryExpr.getRight())) {
                methodCall = binaryExpr.getRight();
            }
            
            if (methodCall instanceof MethodCallExpr) {
                MethodCallExpr methodCallExpr = (MethodCallExpr) methodCall;
                String methodName = methodCallExpr.getNameAsString();
                
                // Extract field name from getter method
                if (methodName.startsWith("get") && methodName.length() > 3) {
                    String fieldName = Character.toLowerCase(methodName.charAt(3)) + methodName.substring(4);
                    fieldNames.add(fieldName);
                    log.debug("Extracted field name: {} from method: {}", fieldName, methodName);
                }
            }
        }
        
        return fieldNames;
    }
    
    private boolean isBothNotNullCheckForFields(Expression condition, List<String> fieldNames) {
        if (!(condition instanceof BinaryExpr)) {
            return false;
        }
        
        BinaryExpr binaryExpr = (BinaryExpr) condition;
        if (binaryExpr.getOperator() != BinaryExpr.Operator.AND) {
            return false;
        }
        
        List<String> conditionFieldNames = extractFieldNamesFromBothNotNullCheck(condition);
        
        // Check if the field names match (order doesn't matter)
        return new HashSet<>(conditionFieldNames).equals(new HashSet<>(fieldNames)) && 
               conditionFieldNames.size() == fieldNames.size();
    }
    
    private List<String> extractFieldNamesFromBothNotNullCheck(Expression condition) {
        List<String> fieldNames = new ArrayList<>();
        
        if (condition instanceof BinaryExpr) {
            BinaryExpr binaryExpr = (BinaryExpr) condition;
            
            fieldNames.addAll(extractFieldNamesFromNotNullCheck(binaryExpr.getLeft()));
            fieldNames.addAll(extractFieldNamesFromNotNullCheck(binaryExpr.getRight()));
        }
        
        return fieldNames;
    }
    
    private List<String> extractFieldNamesFromNotNullCheck(Expression expr) {
        List<String> fieldNames = new ArrayList<>();
        
        if (expr instanceof BinaryExpr) {
            BinaryExpr binaryExpr = (BinaryExpr) expr;
            
            if (binaryExpr.getOperator() == BinaryExpr.Operator.NOT_EQUALS) {
                // Find the method call side
                Expression methodCall = null;
                if (isMethodCall(binaryExpr.getLeft())) {
                    methodCall = binaryExpr.getLeft();
                } else if (isMethodCall(binaryExpr.getRight())) {
                    methodCall = binaryExpr.getRight();
                }
                
                if (methodCall instanceof MethodCallExpr) {
                    MethodCallExpr methodCallExpr = (MethodCallExpr) methodCall;
                    String methodName = methodCallExpr.getNameAsString();
                    
                    // Extract field name from getter method
                    if (methodName.startsWith("get") && methodName.length() > 3) {
                        String fieldName = Character.toLowerCase(methodName.charAt(3)) + methodName.substring(4);
                        fieldNames.add(fieldName);
                    }
                }
            }
        }
        
        return fieldNames;
    }
    
    private Optional<MutualExclusivityPattern> createMutualExclusivityPattern(
            IfStmt bothNullCheck, IfStmt bothNotNullCheck, MethodDeclaration method, String fileName, CompilationUnit cu) {
        
        List<String> fieldNames = extractFieldNamesFromBothNullCheck(bothNullCheck.getCondition());
        
        if (fieldNames.size() != 2) {
            return Optional.empty(); // We're looking for exactly 2 fields in XOR relationship
        }
        
        // Determine confidence based on error constants used
        MutualExclusivityPattern.Confidence confidence = determineConfidence(bothNullCheck, bothNotNullCheck);
        
        // Extract class name - try multiple approaches
        String className = "Unknown";
        if (cu.getPrimaryTypeName().isPresent()) {
            className = cu.getPrimaryTypeName().get();
        } else if (cu.getPrimaryType().isPresent()) {
            className = cu.getPrimaryType().get().getNameAsString();
        } else {
            // Try to extract from file name
            if (fileName.endsWith(".java")) {
                className = fileName.substring(0, fileName.length() - 5);
            }
        }
        
        // Create pattern
        MutualExclusivityPattern pattern = new MutualExclusivityPattern(
            fileName,
            className,
            method.getNameAsString(),
            fieldNames,
            "XOR",
            bothNullCheck.getBegin().map(pos -> pos.line).orElse(0),
            confidence
        );
        
        // Extract error constants
        pattern.setErrorConstants(extractErrorConstants(bothNullCheck, bothNotNullCheck));
        
        // Extract code snippet
        pattern.setCodeSnippet(extractCodeSnippet(bothNullCheck, bothNotNullCheck));
        
        // Try to infer schema name from method parameter or field names
        pattern.setSchemaName(inferSchemaName(fieldNames, method));
        
        log.debug("Found mutual exclusivity pattern: {}", pattern);
        
        return Optional.of(pattern);
    }
    
    private MutualExclusivityPattern.Confidence determineConfidence(IfStmt bothNullCheck, IfStmt bothNotNullCheck) {
        Set<String> errorConstants = new HashSet<>();
        errorConstants.addAll(extractErrorConstants(bothNullCheck, bothNotNullCheck));
        
        // High confidence if we find both expected error constants
        if (errorConstants.containsAll(XOR_ERROR_CONSTANTS)) {
            return MutualExclusivityPattern.Confidence.HIGH;
        }
        
        // Medium confidence if we find at least one expected error constant
        if (errorConstants.stream().anyMatch(XOR_ERROR_CONSTANTS::contains)) {
            return MutualExclusivityPattern.Confidence.MEDIUM;
        }
        
        // Low confidence for pattern match without expected error constants
        return MutualExclusivityPattern.Confidence.LOW;
    }
    
    private List<String> extractErrorConstants(IfStmt bothNullCheck, IfStmt bothNotNullCheck) {
        List<String> constants = new ArrayList<>();
        
        // Extract from both if statements
        constants.addAll(extractErrorConstantsFromStatement(bothNullCheck));
        constants.addAll(extractErrorConstantsFromStatement(bothNotNullCheck));
        
        return constants;
    }
    
    private List<String> extractErrorConstantsFromStatement(IfStmt ifStmt) {
        List<String> constants = new ArrayList<>();
        
        // Look for method calls that might contain error constants
        ifStmt.getThenStmt().findAll(MethodCallExpr.class).forEach(methodCall -> {
            methodCall.getArguments().forEach(arg -> {
                if (arg instanceof FieldAccessExpr) {
                    FieldAccessExpr fieldAccess = (FieldAccessExpr) arg;
                    constants.add(fieldAccess.getNameAsString());
                } else if (arg instanceof NameExpr) {
                    NameExpr nameExpr = (NameExpr) arg;
                    constants.add(nameExpr.getNameAsString());
                }
            });
        });
        
        return constants;
    }
    
    private String extractCodeSnippet(IfStmt bothNullCheck, IfStmt bothNotNullCheck) {
        StringBuilder snippet = new StringBuilder();
        
        snippet.append("// Both null check\n");
        snippet.append(bothNullCheck.toString());
        snippet.append("\n\n");
        snippet.append("// Both not null check\n");
        snippet.append(bothNotNullCheck.toString());
        
        return snippet.toString();
    }
    
    private String inferSchemaName(List<String> fieldNames, MethodDeclaration method) {
        // Try to infer schema name from field names
        for (String fieldName : fieldNames) {
            if (fieldName.endsWith("Id") || fieldName.endsWith("Key")) {
                String baseName = fieldName.replaceAll("(?:Definition)?(?:Id|Key)$", "");
                if (!baseName.isEmpty()) {
                    return Character.toUpperCase(baseName.charAt(0)) + baseName.substring(1) + "Instruction";
                }
            }
        }
        
        // Try to infer from method name
        String methodName = method.getNameAsString();
        if (methodName.startsWith("validate")) {
            String remaining = methodName.substring(8); // Remove "validate"
            if (remaining.endsWith("Request")) {
                return remaining.replaceAll("Request$", "Instruction");
            }
        }
        
        return "Unknown";
    }
}
