package io.camunda.openapi.scanner.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents the complete scan results including metadata and all detected patterns.
 */
public class ScanResult {
    
    @JsonProperty("scan_metadata")
    private ScanMetadata metadata;
    
    @JsonProperty("patterns_found")
    private List<MutualExclusivityPattern> patterns;
    
    @JsonProperty("summary")
    private ScanSummary summary;
    
    public static class ScanMetadata {
        @JsonProperty("scan_date")
        private LocalDateTime scanDate;
        
        @JsonProperty("scanner_version")
        private String scannerVersion;
        
        @JsonProperty("target_directory")
        private String targetDirectory;
        
        @JsonProperty("files_scanned")
        private int filesScanned;
        
        @JsonProperty("scan_duration_ms")
        private long scanDurationMs;
        
        // Constructors, getters, setters
        public ScanMetadata() {}
        
        public ScanMetadata(LocalDateTime scanDate, String scannerVersion, String targetDirectory) {
            this.scanDate = scanDate;
            this.scannerVersion = scannerVersion;
            this.targetDirectory = targetDirectory;
        }
        
        public LocalDateTime getScanDate() { return scanDate; }
        public void setScanDate(LocalDateTime scanDate) { this.scanDate = scanDate; }
        
        public String getScannerVersion() { return scannerVersion; }
        public void setScannerVersion(String scannerVersion) { this.scannerVersion = scannerVersion; }
        
        public String getTargetDirectory() { return targetDirectory; }
        public void setTargetDirectory(String targetDirectory) { this.targetDirectory = targetDirectory; }
        
        public int getFilesScanned() { return filesScanned; }
        public void setFilesScanned(int filesScanned) { this.filesScanned = filesScanned; }
        
        public long getScanDurationMs() { return scanDurationMs; }
        public void setScanDurationMs(long scanDurationMs) { this.scanDurationMs = scanDurationMs; }
    }
    
    public static class ScanSummary {
        @JsonProperty("total_patterns")
        private int totalPatterns;
        
        @JsonProperty("high_confidence")
        private int highConfidence;
        
        @JsonProperty("medium_confidence") 
        private int mediumConfidence;
        
        @JsonProperty("low_confidence")
        private int lowConfidence;
        
        @JsonProperty("unique_files")
        private int uniqueFiles;
        
        @JsonProperty("unique_schemas")
        private int uniqueSchemas;
        
        // Constructors, getters, setters
        public ScanSummary() {}
        
        public int getTotalPatterns() { return totalPatterns; }
        public void setTotalPatterns(int totalPatterns) { this.totalPatterns = totalPatterns; }
        
        public int getHighConfidence() { return highConfidence; }
        public void setHighConfidence(int highConfidence) { this.highConfidence = highConfidence; }
        
        public int getMediumConfidence() { return mediumConfidence; }
        public void setMediumConfidence(int mediumConfidence) { this.mediumConfidence = mediumConfidence; }
        
        public int getLowConfidence() { return lowConfidence; }
        public void setLowConfidence(int lowConfidence) { this.lowConfidence = lowConfidence; }
        
        public int getUniqueFiles() { return uniqueFiles; }
        public void setUniqueFiles(int uniqueFiles) { this.uniqueFiles = uniqueFiles; }
        
        public int getUniqueSchemas() { return uniqueSchemas; }
        public void setUniqueSchemas(int uniqueSchemas) { this.uniqueSchemas = uniqueSchemas; }
    }
    
    // Constructors
    public ScanResult() {}
    
    public ScanResult(ScanMetadata metadata, List<MutualExclusivityPattern> patterns) {
        this.metadata = metadata;
        this.patterns = patterns;
        this.summary = createSummary(patterns);
    }
    
    private ScanSummary createSummary(List<MutualExclusivityPattern> patterns) {
        ScanSummary summary = new ScanSummary();
        summary.setTotalPatterns(patterns.size());
        
        long highCount = patterns.stream()
            .filter(p -> p.getConfidence() == MutualExclusivityPattern.Confidence.HIGH)
            .count();
        long mediumCount = patterns.stream()
            .filter(p -> p.getConfidence() == MutualExclusivityPattern.Confidence.MEDIUM)
            .count();
        long lowCount = patterns.stream()
            .filter(p -> p.getConfidence() == MutualExclusivityPattern.Confidence.LOW)
            .count();
            
        summary.setHighConfidence((int) highCount);
        summary.setMediumConfidence((int) mediumCount);
        summary.setLowConfidence((int) lowCount);
        
        long uniqueFiles = patterns.stream()
            .map(MutualExclusivityPattern::getFileName)
            .distinct()
            .count();
        summary.setUniqueFiles((int) uniqueFiles);
        
        long uniqueSchemas = patterns.stream()
            .map(MutualExclusivityPattern::getSchemaName)
            .filter(name -> name != null && !name.isEmpty())
            .distinct()
            .count();
        summary.setUniqueSchemas((int) uniqueSchemas);
        
        return summary;
    }
    
    // Getters and setters
    public ScanMetadata getMetadata() { return metadata; }
    public void setMetadata(ScanMetadata metadata) { this.metadata = metadata; }
    
    public List<MutualExclusivityPattern> getPatterns() { return patterns; }
    public void setPatterns(List<MutualExclusivityPattern> patterns) { 
        this.patterns = patterns;
        this.summary = createSummary(patterns);
    }
    
    public ScanSummary getSummary() { return summary; }
    public void setSummary(ScanSummary summary) { this.summary = summary; }
}
