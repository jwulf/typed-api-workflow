package io.camunda.openapi.scanner;

import io.camunda.openapi.scanner.model.MutualExclusivityPattern;
import io.camunda.openapi.scanner.model.ScanResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for the MutualExclusivityScanner.
 */
class MutualExclusiviyScannerTest {
    
    private MutualExclusivityScanner scanner;
    
    @TempDir
    Path tempDir;
    
    @BeforeEach
    void setUp() {
        scanner = new MutualExclusivityScanner();
    }
    
    @Test
    void shouldScanDirectoryWithValidatorFiles() throws IOException {
        // Create a test validator file with XOR pattern
        Path validatorFile = tempDir.resolve("TestValidator.java");
        String validatorContent = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_AT_LEAST_ONE_FIELD;
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_ONLY_ONE_FIELD;
            
            public class TestValidator {
                public static Optional<ProblemDetail> validateTestRequest(final TestRequest request) {
                    return validate(
                        violations -> {
                            if (request.getTestId() == null && request.getTestKey() == null) {
                                violations.add(
                                    ERROR_MESSAGE_AT_LEAST_ONE_FIELD.formatted(
                                        List.of("testId", "testKey")));
                            }
                            if (request.getTestId() != null && request.getTestKey() != null) {
                                violations.add(
                                    ERROR_MESSAGE_ONLY_ONE_FIELD.formatted(
                                        List.of("testId", "testKey")));
                            }
                        });
                }
            }
            """;
        Files.writeString(validatorFile, validatorContent);
        
        // Create a non-validator file that should be ignored
        Path nonValidatorFile = tempDir.resolve("SomeOtherClass.java");
        String nonValidatorContent = """
            package com.example;
            
            public class SomeOtherClass {
                public void doSomething() {
                    // This should be ignored
                }
            }
            """;
        Files.writeString(nonValidatorFile, nonValidatorContent);
        
        // Scan the directory
        ScanResult result = scanner.scan(tempDir.toString());
        
        // Verify results
        assertNotNull(result);
        assertEquals(1, result.getMetadata().getFilesScanned());
        assertEquals(1, result.getSummary().getTotalPatterns());
        assertEquals(1, result.getSummary().getHighConfidence());
        assertEquals(0, result.getSummary().getMediumConfidence());
        assertEquals(0, result.getSummary().getLowConfidence());
        
        MutualExclusivityPattern pattern = result.getPatterns().get(0);
        assertEquals("TestValidator.java", pattern.getFileName());
        assertEquals("TestValidator", pattern.getClassName());
        assertEquals("validateTestRequest", pattern.getMethodName());
        assertEquals(List.of("testId", "testKey"), pattern.getFieldNames());
        assertEquals(MutualExclusivityPattern.Confidence.HIGH, pattern.getConfidence());
    }
    
    @Test
    void shouldHandleEmptyDirectory() throws IOException {
        ScanResult result = scanner.scan(tempDir.toString());
        
        assertNotNull(result);
        assertEquals(0, result.getMetadata().getFilesScanned());
        assertEquals(0, result.getSummary().getTotalPatterns());
        assertTrue(result.getPatterns().isEmpty());
    }
    
    @Test
    void shouldHandleDirectoryWithNoValidatorFiles() throws IOException {
        // Create a regular Java file without validator patterns
        Path javaFile = tempDir.resolve("RegularClass.java");
        String content = """
            package com.example;
            
            public class RegularClass {
                private String field;
                
                public String getField() {
                    return field;
                }
            }
            """;
        Files.writeString(javaFile, content);
        
        ScanResult result = scanner.scan(tempDir.toString());
        
        assertNotNull(result);
        assertEquals(0, result.getMetadata().getFilesScanned());
        assertEquals(0, result.getSummary().getTotalPatterns());
    }
    
    @Test
    void shouldThrowExceptionForNonExistentDirectory() {
        assertThrows(IllegalArgumentException.class, () -> {
            scanner.scan("/non/existent/directory");
        });
    }
    
    @Test
    void shouldWriteAndReadResults() throws IOException {
        // Create test data
        Path validatorFile = tempDir.resolve("TestValidator.java");
        String validatorContent = """
            package io.camunda.zeebe.gateway.rest.validator;
            
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_AT_LEAST_ONE_FIELD;
            import static io.camunda.zeebe.gateway.rest.validator.ErrorMessages.ERROR_MESSAGE_ONLY_ONE_FIELD;
            
            public class TestValidator {
                public static Optional<ProblemDetail> validateTestRequest(final TestRequest request) {
                    return validate(
                        violations -> {
                            if (request.getFieldA() == null && request.getFieldB() == null) {
                                violations.add(
                                    ERROR_MESSAGE_AT_LEAST_ONE_FIELD.formatted(
                                        List.of("fieldA", "fieldB")));
                            }
                            if (request.getFieldA() != null && request.getFieldB() != null) {
                                violations.add(
                                    ERROR_MESSAGE_ONLY_ONE_FIELD.formatted(
                                        List.of("fieldA", "fieldB")));
                            }
                        });
                }
            }
            """;
        Files.writeString(validatorFile, validatorContent);
        
        // Scan and write results
        ScanResult result = scanner.scan(tempDir.toString());
        Path outputFile = tempDir.resolve("results.json");
        scanner.writeResults(result, outputFile.toString());
        
        // Verify file was created
        assertTrue(Files.exists(outputFile));
        assertTrue(Files.size(outputFile) > 0);
        
        // Verify JSON content contains expected data
        String jsonContent = Files.readString(outputFile);
        assertTrue(jsonContent.contains("TestValidator"));
        assertTrue(jsonContent.contains("fieldA"));
        assertTrue(jsonContent.contains("fieldB"));
        assertTrue(jsonContent.contains("HIGH"));
    }
}
