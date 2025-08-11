package io.camunda.openapi.scanner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.javaparser.JavaParser;
import com.github.javaparser.ParseResult;
import com.github.javaparser.ast.CompilationUnit;
import io.camunda.openapi.scanner.analyzer.MutualExclusivityAnalyzer;
import io.camunda.openapi.scanner.model.MutualExclusivityPattern;
import io.camunda.openapi.scanner.model.ScanResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

/**
 * Main scanner class for detecting runtime mutual exclusivity patterns in Java validator code.
 */
public class MutualExclusivityScanner {
    
    private static final Logger log = LoggerFactory.getLogger(MutualExclusivityScanner.class);
    private static final String SCANNER_VERSION = "1.0.0";
    
    private final MutualExclusivityAnalyzer analyzer;
    private final ObjectMapper objectMapper;
    
    public MutualExclusivityScanner() {
        this.analyzer = new MutualExclusivityAnalyzer();
        this.objectMapper = createObjectMapper();
    }
    
    private ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
    
    /**
     * Scans the specified directory for Java validator files and detects mutual exclusivity patterns.
     */
    public ScanResult scan(String targetDirectory) throws IOException {
        log.info("Starting scan of directory: {}", targetDirectory);
        
        long startTime = System.currentTimeMillis();
        LocalDateTime scanDate = LocalDateTime.now();
        
        Path targetPath = Paths.get(targetDirectory);
        if (!Files.exists(targetPath)) {
            throw new IllegalArgumentException("Target directory does not exist: " + targetDirectory);
        }
        
        List<MutualExclusivityPattern> allPatterns = new ArrayList<>();
        int filesScanned = 0;
        
        // Find all Java files in the target directory
        try (Stream<Path> paths = Files.walk(targetPath)) {
            List<Path> javaFiles = paths
                .filter(Files::isRegularFile)
                .filter(path -> path.toString().endsWith(".java"))
                .filter(this::isValidatorFile)
                .toList();
            
            log.info("Found {} Java validator files to scan", javaFiles.size());
            
            // Process each Java file
            for (Path javaFile : javaFiles) {
                try {
                    List<MutualExclusivityPattern> patterns = scanFile(javaFile);
                    allPatterns.addAll(patterns);
                    filesScanned++;
                    
                    if (!patterns.isEmpty()) {
                        log.info("Found {} patterns in file: {}", patterns.size(), javaFile.getFileName());
                    }
                } catch (Exception e) {
                    log.warn("Failed to scan file: {} - {}", javaFile, e.getMessage());
                }
            }
        }
        
        long duration = System.currentTimeMillis() - startTime;
        
        // Create metadata
        ScanResult.ScanMetadata metadata = new ScanResult.ScanMetadata(scanDate, SCANNER_VERSION, targetDirectory);
        metadata.setFilesScanned(filesScanned);
        metadata.setScanDurationMs(duration);
        
        ScanResult result = new ScanResult(metadata, allPatterns);
        
        log.info("Scan completed. Found {} patterns in {} files. Duration: {}ms", 
                allPatterns.size(), filesScanned, duration);
        
        return result;
    }
    
    private boolean isValidatorFile(Path path) {
        String fileName = path.getFileName().toString();
        return fileName.contains("Validator") || fileName.contains("RequestValidator");
    }
    
    private List<MutualExclusivityPattern> scanFile(Path javaFile) throws IOException {
        log.debug("Scanning file: {}", javaFile);
        
        JavaParser parser = new JavaParser();
        ParseResult<CompilationUnit> parseResult = parser.parse(javaFile);
        
        if (!parseResult.isSuccessful()) {
            log.warn("Failed to parse file: {} - {}", javaFile, parseResult.getProblems());
            return List.of();
        }
        
        CompilationUnit cu = parseResult.getResult().orElseThrow();
        String fileName = javaFile.getFileName().toString();
        
        return analyzer.analyze(cu, fileName);
    }
    
    /**
     * Writes scan results to a JSON file.
     */
    public void writeResults(ScanResult result, String outputFile) throws IOException {
        Path outputPath = Paths.get(outputFile);
        objectMapper.writeValue(outputPath.toFile(), result);
        log.info("Results written to: {}", outputPath.toAbsolutePath());
    }
    
    /**
     * Prints a human-readable summary of the scan results.
     */
    public void printSummary(ScanResult result) {
        ScanResult.ScanSummary summary = result.getSummary();
        ScanResult.ScanMetadata metadata = result.getMetadata();
        
        System.out.println("\n" + "=".repeat(80));
        System.out.println("MUTUAL EXCLUSIVITY SCAN RESULTS");
        System.out.println("=".repeat(80));
        System.out.printf("Scan Date: %s%n", metadata.getScanDate());
        System.out.printf("Target Directory: %s%n", metadata.getTargetDirectory());
        System.out.printf("Files Scanned: %d%n", metadata.getFilesScanned());
        System.out.printf("Scan Duration: %d ms%n", metadata.getScanDurationMs());
        System.out.println();
        
        System.out.printf("Total Patterns Found: %d%n", summary.getTotalPatterns());
        System.out.printf("  - High Confidence: %d%n", summary.getHighConfidence());
        System.out.printf("  - Medium Confidence: %d%n", summary.getMediumConfidence());
        System.out.printf("  - Low Confidence: %d%n", summary.getLowConfidence());
        System.out.printf("Unique Files: %d%n", summary.getUniqueFiles());
        System.out.printf("Unique Schemas: %d%n", summary.getUniqueSchemas());
        System.out.println();
        
        if (!result.getPatterns().isEmpty()) {
            System.out.println("DETECTED PATTERNS:");
            System.out.println("-".repeat(40));
            
            for (MutualExclusivityPattern pattern : result.getPatterns()) {
                System.out.printf("📁 %s:%d%n", pattern.getFileName(), pattern.getLineNumber());
                System.out.printf("   Method: %s.%s()%n", pattern.getClassName(), pattern.getMethodName());
                System.out.printf("   Fields: %s%n", pattern.getFieldNames());
                System.out.printf("   Schema: %s%n", pattern.getSchemaName());
                System.out.printf("   Confidence: %s%n", pattern.getConfidence());
                if (pattern.getErrorConstants() != null && !pattern.getErrorConstants().isEmpty()) {
                    System.out.printf("   Error Constants: %s%n", pattern.getErrorConstants());
                }
                System.out.println();
            }
        }
        
        System.out.println("=".repeat(80));
    }
    
    public static void main(String[] args) {
        if (args.length < 1) {
            System.err.println("Usage: java -jar mutual-exclusivity-scanner.jar <target-directory> [output-file]");
            System.err.println("  target-directory: Directory to scan for Java validator files");
            System.err.println("  output-file: Optional JSON output file (default: scan-results.json)");
            System.exit(1);
        }
        
        String targetDirectory = args[0];
        String outputFile = args.length > 1 ? args[1] : "scan-results.json";
        
        try {
            MutualExclusivityScanner scanner = new MutualExclusivityScanner();
            ScanResult result = scanner.scan(targetDirectory);
            
            scanner.printSummary(result);
            scanner.writeResults(result, outputFile);
            
            // Exit with appropriate code
            System.exit(result.getSummary().getTotalPatterns() > 0 ? 1 : 0);
            
        } catch (Exception e) {
            log.error("Scan failed", e);
            System.err.println("Scan failed: " + e.getMessage());
            System.exit(2);
        }
    }
}
