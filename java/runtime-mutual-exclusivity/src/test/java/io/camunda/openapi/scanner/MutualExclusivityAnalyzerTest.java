package io.camunda.openapi.scanner;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import io.camunda.openapi.scanner.analyzer.MutualExclusivityAnalyzer;
import io.camunda.openapi.scanner.model.MutualExclusivityPattern;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the MutualExclusivityAnalyzer to ensure it correctly detects XOR patterns.
 */
class MutualExclusivityAnalyzerTest {
    
    private MutualExclusivityAnalyzer analyzer;
    private JavaParser parser;
    
    @BeforeEach
    void setUp() {
        analyzer = new MutualExclusivityAnalyzer();
        parser = new JavaParser();
    }
    
    @Test
    void shouldDetectDecisionEvaluationPattern() {
        String code = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_AT_LEAST_ONE_FIELD;
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_ONLY_ONE_FIELD;
            
            public class EvaluateDecisionRequestValidator {
                public static Optional<ProblemDetail> validateEvaluateDecisionRequest(
                    final DecisionEvaluationInstruction request) {
                    return validate(
                        violations -> {
                            if (request.getDecisionDefinitionId() == null
                                && request.getDecisionDefinitionKey() == null) {
                                violations.add(
                                    ERROR_MESSAGE_AT_LEAST_ONE_FIELD.formatted(
                                        List.of("decisionDefinitionId", "decisionDefinitionKey")));
                            }
                            if (request.getDecisionDefinitionId() != null
                                && request.getDecisionDefinitionKey() != null) {
                                violations.add(
                                    ERROR_MESSAGE_ONLY_ONE_FIELD.formatted(
                                        List.of("decisionDefinitionId", "decisionDefinitionKey")));
                            }
                        });
                }
            }
            """;
        
        CompilationUnit cu = parser.parse(code).getResult().orElseThrow();
        List<MutualExclusivityPattern> patterns = analyzer.analyze(cu, "EvaluateDecisionRequestValidator.java");
        
        assertEquals(1, patterns.size());
        
        MutualExclusivityPattern pattern = patterns.get(0);
        assertEquals("EvaluateDecisionRequestValidator.java", pattern.getFileName());
        assertEquals("EvaluateDecisionRequestValidator", pattern.getClassName());
        assertEquals("validateEvaluateDecisionRequest", pattern.getMethodName());
        assertEquals(List.of("decisionDefinitionId", "decisionDefinitionKey"), pattern.getFieldNames());
        assertEquals("XOR", pattern.getValidationType());
        assertEquals(MutualExclusivityPattern.Confidence.HIGH, pattern.getConfidence());
        assertTrue(pattern.getErrorConstants().contains("ERROR_MESSAGE_AT_LEAST_ONE_FIELD"));
        assertTrue(pattern.getErrorConstants().contains("ERROR_MESSAGE_ONLY_ONE_FIELD"));
    }
    
    @Test
    void shouldDetectProcessInstancePattern() {
        String code = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_AT_LEAST_ONE_FIELD;
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_ONLY_ONE_FIELD;
            
            public class ProcessInstanceRequestValidator {
                public static Optional<ProblemDetail> validateCreateProcessInstanceRequest(
                    final ProcessInstanceCreationInstruction request) {
                    return validate(
                        violations -> {
                            if (request.getProcessDefinitionId() == null
                                && request.getProcessDefinitionKey() == null) {
                                violations.add(
                                    ERROR_MESSAGE_AT_LEAST_ONE_FIELD.formatted(
                                        List.of("processDefinitionId", "processDefinitionKey")));
                            }
                            if (request.getProcessDefinitionId() != null
                                && request.getProcessDefinitionKey() != null) {
                                violations.add(
                                    ERROR_MESSAGE_ONLY_ONE_FIELD.formatted(
                                        List.of("processDefinitionId", "processDefinitionKey")));
                            }
                        });
                }
            }
            """;
        
        CompilationUnit cu = parser.parse(code).getResult().orElseThrow();
        List<MutualExclusivityPattern> patterns = analyzer.analyze(cu, "ProcessInstanceRequestValidator.java");
        
        assertEquals(1, patterns.size());
        
        MutualExclusivityPattern pattern = patterns.get(0);
        assertEquals("ProcessInstanceRequestValidator.java", pattern.getFileName());
        assertEquals("ProcessInstanceRequestValidator", pattern.getClassName());
        assertEquals("validateCreateProcessInstanceRequest", pattern.getMethodName());
        assertEquals(List.of("processDefinitionId", "processDefinitionKey"), pattern.getFieldNames());
        assertEquals("XOR", pattern.getValidationType());
        assertEquals(MutualExclusivityPattern.Confidence.HIGH, pattern.getConfidence());
    }
    
    @Test
    void shouldNotDetectAtLeastOnePattern() {
        String code = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_AT_LEAST_ONE_FIELD;
            
            public class JobRequestValidator {
                public static Optional<ProblemDetail> validateJobUpdateRequest(
                    final JobUpdateRequest updateRequest) {
                    return validate(
                        violations -> {
                            final JobChangeset changeset = updateRequest.getChangeset();
                            if (changeset == null
                                || (changeset.getRetries() == null && changeset.getTimeout() == null)) {
                                violations.add(
                                    ERROR_MESSAGE_AT_LEAST_ONE_FIELD.formatted(List.of("retries", "timeout")));
                            }
                        });
                }
            }
            """;
        
        CompilationUnit cu = parser.parse(code).getResult().orElseThrow();
        List<MutualExclusivityPattern> patterns = analyzer.analyze(cu, "JobRequestValidator.java");
        
        // Should not detect this as XOR pattern since there's no "both not null" check
        assertEquals(0, patterns.size());
    }
    
    @Test
    void shouldDetectMediumConfidencePattern() {
        String code = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            public class SomeValidator {
                public static Optional<ProblemDetail> validateSomeRequest(final SomeRequest request) {
                    return validate(
                        violations -> {
                            if (request.getFieldA() == null && request.getFieldB() == null) {
                                violations.add("At least one field is required");
                            }
                            if (request.getFieldA() != null && request.getFieldB() != null) {
                                violations.add("Only one field is allowed");
                            }
                        });
                }
            }
            """;
        
        CompilationUnit cu = parser.parse(code).getResult().orElseThrow();
        List<MutualExclusivityPattern> patterns = analyzer.analyze(cu, "SomeValidator.java");
        
        assertEquals(1, patterns.size());
        
        MutualExclusivityPattern pattern = patterns.get(0);
        assertEquals(MutualExclusivityPattern.Confidence.LOW, pattern.getConfidence());
        assertEquals(List.of("fieldA", "fieldB"), pattern.getFieldNames());
    }
    
    @Test
    void shouldNotDetectSingleFieldValidation() {
        String code = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            public class SimpleValidator {
                public static Optional<ProblemDetail> validateSimpleRequest(final SimpleRequest request) {
                    return validate(
                        violations -> {
                            if (request.getFieldA() == null) {
                                violations.add("Field A is required");
                            }
                            if (request.getFieldB() == null) {
                                violations.add("Field B is required");
                            }
                        });
                }
            }
            """;
        
        CompilationUnit cu = parser.parse(code).getResult().orElseThrow();
        List<MutualExclusivityPattern> patterns = analyzer.analyze(cu, "SimpleValidator.java");
        
        assertEquals(0, patterns.size());
    }
    
    @Test
    void shouldHandleEmptyClass() {
        String code = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            public class EmptyValidator {
            }
            """;
        
        CompilationUnit cu = parser.parse(code).getResult().orElseThrow();
        List<MutualExclusivityPattern> patterns = analyzer.analyze(cu, "EmptyValidator.java");
        
        assertEquals(0, patterns.size());
    }
}
