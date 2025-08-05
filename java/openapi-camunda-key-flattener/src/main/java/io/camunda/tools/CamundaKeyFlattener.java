package io.camunda.tools;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.databind.node.*;

import java.io.File;
import java.io.FileWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * This tool flattens the CamundaKey types in the OpenAPI spec to simple string types.
 */
public class CamundaKeyFlattener {

    // To easily comment out description removal if needed
    private static final boolean STRIP_DESCRIPTIONS = false;
    private static final String CANONICAL_SOURCE = "zeebe/gateway-protocol/src/main/proto/rest-api.yaml";
    private static final String INPUT_FILE = "../../rest-api.domain.yaml"; 
    private static final String OUTPUT_FILE = "../../rest-api.generated.yaml"; 
    
    // Generate header comment with current timestamp
    private static String generateHeaderComment() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return "# ⚠️ THIS IS A GENERATED FILE. DO NOT EDIT. ⚠️\n" +
                "# This file has been automatically transformed to remove complex CamundaKey types.\n" +
                "# All descendants of CamundaKey have been replaced with simple string types.\n" +
                "# This is for backward-compatibility with loosely typed components within the system.\n" +
                "# Canonical source: " + CANONICAL_SOURCE + "\n" +
                "# File generated at: " + timestamp + "\n\n";
    }

    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        mapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
        mapper.configure(SerializationFeature.INDENT_OUTPUT, true);

        File input = new File(INPUT_FILE );  
        File output = new File(OUTPUT_FILE); 

        JsonNode root = mapper.readTree(input);
        Set<String> camundaKeyDescendants = new HashSet<>();

        // Step 1: Find all descendants of CamundaKey
        JsonNode schemas = root.at("/components/schemas");
        if (schemas != null && schemas.isObject()) {
            for (Iterator<String> it = schemas.fieldNames(); it.hasNext(); ) {
                String name = it.next();
                if (isDescendantOfCamundaKey(name, schemas, new HashSet<>())) {
                    camundaKeyDescendants.add(name);
                }
            }
        }

        // Step 2: Flatten union schemas marked with x-flatten-union
        flattenUnionSchemas(schemas);

        // Step 3: Rewrite descendants as simple string type
        for (String keyName : camundaKeyDescendants) {
            ObjectNode schemaNode = (ObjectNode) schemas.get(keyName);
            retainDescriptionAndReplaceWithString(schemaNode);
        }

        // Step 4: Replace references and types throughout the spec
        replaceRefs(root, camundaKeyDescendants, root.at("/components/schemas"));

        // Step 5: Inject metadata
        injectMetadata(root);

        // Step 5: Write with dynamic header comment
        String headerComment = generateHeaderComment();
        try (FileWriter writer = new FileWriter(output)) {
            writer.write(headerComment);
            mapper.writeValue(writer, root);
        }

        System.out.println("Finished writing to " + OUTPUT_FILE);
    }

    /**
     * Flattens schemas marked with x-flatten-union vendor extension.
     * Merges all properties from oneOf variants into a single schema.
     */
    private static void flattenUnionSchemas(JsonNode schemas) {
        if (schemas == null || !schemas.isObject()) return;
        
        List<String> schemasToFlatten = new ArrayList<>();
        
        // Find all schemas with x-flatten-union extension
        for (Iterator<String> it = schemas.fieldNames(); it.hasNext(); ) {
            String schemaName = it.next();
            JsonNode schema = schemas.get(schemaName);
            if (schema.has("x-flatten-union") && schema.get("x-flatten-union").asBoolean()) {
                schemasToFlatten.add(schemaName);
            }
        }
        
        // Flatten each marked schema
        for (String schemaName : schemasToFlatten) {
            ObjectNode schema = (ObjectNode) schemas.get(schemaName);
            flattenUnionSchema(schema);
        }
    }

    /**
     * Flattens a single union schema by merging all oneOf variants.
     */
    private static void flattenUnionSchema(ObjectNode schema) {
        JsonNode oneOfNode = schema.get("oneOf");
        if (oneOfNode == null || !oneOfNode.isArray()) {
            throw new RuntimeException("Schema marked with x-flatten-union must have oneOf property");
        }
        
        ObjectNode flattenedProperties = schema.objectNode();
        Set<String> allPropertyNames = new HashSet<>();
        
        // Collect all properties from all variants
        for (JsonNode variant : oneOfNode) {
            if (!variant.has("properties")) continue;
            
            JsonNode properties = variant.get("properties");
            if (!properties.isObject()) continue;
            
            for (Iterator<String> it = properties.fieldNames(); it.hasNext(); ) {
                String propName = it.next();
                JsonNode propDef = properties.get(propName);
                
                // Check for property conflicts
                if (flattenedProperties.has(propName)) {
                    JsonNode existing = flattenedProperties.get(propName);
                    if (!arePropertyDefinitionsCompatible(existing, propDef)) {
                        throw new RuntimeException("Property conflict in union flattening: property '" + 
                            propName + "' has incompatible definitions across oneOf variants");
                    }
                }
                
                flattenedProperties.set(propName, propDef);
                allPropertyNames.add(propName);
            }
        }
        
        // Preserve description and type
        JsonNode description = schema.get("description");
        JsonNode type = schema.get("type");
        
        // Clear the schema and rebuild it
        schema.removeAll();
        
        if (type != null) {
            schema.set("type", type);
        } else {
            schema.put("type", "object");
        }
        
        if (description != null) {
            schema.set("description", description);
        }
        
        schema.set("properties", flattenedProperties);
        
        // Remove required arrays as per requirements (make all properties optional)
        // Note: We intentionally don't set any required properties
    }

    /**
     * Checks if two property definitions are compatible (same type, format, etc.)
     */
    private static boolean arePropertyDefinitionsCompatible(JsonNode prop1, JsonNode prop2) {
        // For this implementation, we require exact equality
        // You could make this more lenient by comparing only type, format, etc.
        return prop1.equals(prop2);
    }

     private static void replaceRefs(JsonNode node, Set<String> keyNames, JsonNode schemasRoot) {
        if (node.isObject()) {
            ObjectNode obj = (ObjectNode) node;

            // Direct $ref flattening
            if (obj.has("$ref")) {
                String ref = obj.get("$ref").asText();
                for (String keyName : keyNames) {
                    if (ref.equals("#/components/schemas/" + keyName)) {
                        JsonNode referencedSchema = schemasRoot != null ? schemasRoot.get(keyName) : null;
                        JsonNode description = referencedSchema != null ? referencedSchema.get("description") : null;

                        obj.removeAll();
                        obj.put("type", "string");
                        if (description != null && !STRIP_DESCRIPTIONS) {
                            obj.set("description", description);
                        }
                        return;
                    }
                }
            }

            // allOf / oneOf / anyOf flattening
            for (String composite : List.of("allOf", "oneOf", "anyOf")) {
                if (obj.has(composite)) {
                    ArrayNode arrayNode = (ArrayNode) obj.get(composite);

                    // Look for $ref in one item, and description in another
                    String matchedKey = null;
                    String descriptionText = null;

                    for (JsonNode item : arrayNode) {
                        if (item.has("$ref")) {
                            String ref = item.get("$ref").asText();
                            for (String keyName : keyNames) {
                                if (ref.equals("#/components/schemas/" + keyName)) {
                                    matchedKey = keyName;
                                }
                            }
                        } else if (item.has("description")) {
                            descriptionText = item.get("description").asText();
                        }
                    }

                    if (matchedKey != null) {
                        obj.remove(composite);
                        obj.put("type", "string");

                        if (descriptionText != null && !STRIP_DESCRIPTIONS) {
                            obj.put("description", descriptionText);
                        } else if (schemasRoot != null) {
                            JsonNode fallback = schemasRoot.get(matchedKey);
                            if (fallback != null && fallback.has("description") && !STRIP_DESCRIPTIONS) {
                                obj.set("description", fallback.get("description"));
                            }
                        }
                        return;
                    }
                }
            }

            // Recurse
            obj.fields().forEachRemaining(entry -> replaceRefs(entry.getValue(), keyNames, schemasRoot));

        } else if (node.isArray()) {
            for (JsonNode child : node) {
                replaceRefs(child, keyNames, schemasRoot);
            }
        }
    }

    private static JsonNode getSchemasRoot(JsonNode anyNode) {
        JsonNode current = anyNode;
        while (current != null && !current.isMissingNode()) {
            if (current.has("components") && current.get("components").has("schemas")) {
                return current.get("components").get("schemas");
            }
            current = current.get("parent"); // Will not work in Jackson — so instead:
            break; // This is a placeholder — see explanation below
        }
        return null; // fallback
    }

    private static void retainDescriptionAndReplaceWithString(ObjectNode node) {
        JsonNode description = node.get("description");
        ObjectNode newNode = node.removeAll();
        newNode.put("type", "string");
        if (description != null && !STRIP_DESCRIPTIONS) {
            newNode.set("description", description);
        }
    }

    private static boolean isDescendantOfCamundaKey(String name, JsonNode schemas, Set<String> visited) {
        if (visited.contains(name)) return false;
        visited.add(name);

        JsonNode schema = schemas.get(name);
        if (schema == null) return false;

        for (String composite : List.of("allOf", "oneOf", "anyOf")) {
            JsonNode items = schema.get(composite);
            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    if (item.has("$ref")) {
                        String ref = item.get("$ref").asText();
                        String refName = ref.substring(ref.lastIndexOf("/") + 1);
                        if (refName.equals("CamundaKey")) {
                            return true;
                        }
                        if (isDescendantOfCamundaKey(refName, schemas, visited)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    private static void injectMetadata(JsonNode root) {
        ObjectNode objRoot = (ObjectNode) root;
        ObjectNode info = (ObjectNode) objRoot.get("info");
        if (info == null) {
            info = objRoot.putObject("info");
        }

        // Append to description
        JsonNode descriptionNode = info.get("description");
        String description = descriptionNode != null ? descriptionNode.asText() : "";
        if (!description.contains("THIS IS A GENERATED SPEC")) {
            description += "\n\n⚠️ THIS IS A GENERATED SPEC ⚠️\n" +
                    "Do not edit manually. Canonical source: " + CANONICAL_SOURCE + "\n";
            info.put("description", description.trim());
        }

        // Add x-generated and x-canonical-source
        ObjectNode extensions = (ObjectNode) info.get("x-generated") == null ? info : (ObjectNode) info;
        extensions.put("x-generated", true);
        extensions.put("x-canonical-source", CANONICAL_SOURCE);
    }
}