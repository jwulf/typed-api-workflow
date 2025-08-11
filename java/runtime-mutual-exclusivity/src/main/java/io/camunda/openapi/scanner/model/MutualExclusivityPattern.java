package io.camunda.openapi.scanner.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Represents a detected mutual exclusivity pattern in validator code.
 */
public class MutualExclusivityPattern {
    
    @JsonProperty("file")
    private String fileName;
    
    @JsonProperty("class")
    private String className;
    
    @JsonProperty("method")
    private String methodName;
    
    @JsonProperty("fields")
    private List<String> fieldNames;
    
    @JsonProperty("validation_type")
    private String validationType;
    
    @JsonProperty("line_number")
    private int lineNumber;
    
    @JsonProperty("confidence")
    private Confidence confidence;
    
    @JsonProperty("error_constants")
    private List<String> errorConstants;
    
    @JsonProperty("code_snippet")
    private String codeSnippet;
    
    @JsonProperty("schema_name")
    private String schemaName;

    public enum Confidence {
        HIGH,    // Both error constants + XOR logic pattern
        MEDIUM,  // XOR logic pattern but different error messages
        LOW      // Partial pattern match
    }
    
    // Constructors
    public MutualExclusivityPattern() {}
    
    public MutualExclusivityPattern(String fileName, String className, String methodName, 
                                  List<String> fieldNames, String validationType, 
                                  int lineNumber, Confidence confidence) {
        this.fileName = fileName;
        this.className = className;
        this.methodName = methodName;
        this.fieldNames = fieldNames;
        this.validationType = validationType;
        this.lineNumber = lineNumber;
        this.confidence = confidence;
    }
    
    // Getters and setters
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    
    public String getMethodName() { return methodName; }
    public void setMethodName(String methodName) { this.methodName = methodName; }
    
    public List<String> getFieldNames() { return fieldNames; }
    public void setFieldNames(List<String> fieldNames) { this.fieldNames = fieldNames; }
    
    public String getValidationType() { return validationType; }
    public void setValidationType(String validationType) { this.validationType = validationType; }
    
    public int getLineNumber() { return lineNumber; }
    public void setLineNumber(int lineNumber) { this.lineNumber = lineNumber; }
    
    public Confidence getConfidence() { return confidence; }
    public void setConfidence(Confidence confidence) { this.confidence = confidence; }
    
    public List<String> getErrorConstants() { return errorConstants; }
    public void setErrorConstants(List<String> errorConstants) { this.errorConstants = errorConstants; }
    
    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }
    
    public String getSchemaName() { return schemaName; }
    public void setSchemaName(String schemaName) { this.schemaName = schemaName; }
    
    @Override
    public String toString() {
        return String.format("MutualExclusivityPattern{file='%s', method='%s', fields=%s, confidence=%s}", 
                           fileName, methodName, fieldNames, confidence);
    }
}
