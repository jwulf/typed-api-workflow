package io.camunda.tools;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.databind.node.*;

import java.io.File;
import java.io.FileWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.Map;

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
                    // Exclude filter properties from being treated as CamundaKey descendants
                    // They will be handled separately in the filter transformation
                    if (!isFilterPropertySchema(name)) {
                        camundaKeyDescendants.add(name);
                    } else {
                        System.out.println("Excluding filter property schema: " + name);
                    }
                }
            }
        }

        System.out.println("Found CamundaKey descendants: " + camundaKeyDescendants);

        // Step 2: Transform filter properties BEFORE flattening semantic types
        transformFilterProperties(root, camundaKeyDescendants, schemas);

        // Step 3: Flatten union schemas marked with x-polymorphic-schema
        flattenUnionSchemas(schemas);

        // Step 4: Rewrite descendants as simple string type
        for (String keyName : camundaKeyDescendants) {
            ObjectNode schemaNode = (ObjectNode) schemas.get(keyName);
            retainDescriptionAndReplaceWithString(schemaNode);
        }

        // Step 5: Replace references and types throughout the spec
        Set<String> removedFilterSchemas = getRemovedFilterSchemaNames(schemas);
        replaceRefs(root, camundaKeyDescendants, removedFilterSchemas, root.at("/components/schemas"));

        // Step 6: Clean up orphaned filter schemas
        cleanupOrphanedFilterSchemas(schemas, camundaKeyDescendants);

        // Step 7: Inject metadata
        injectMetadata(root);

        // Step 8: Write with dynamic header comment
        String headerComment = generateHeaderComment();
        try (FileWriter writer = new FileWriter(output)) {
            writer.write(headerComment);
            mapper.writeValue(writer, root);
        }

        System.out.println("Finished writing to " + OUTPUT_FILE);
    }

    /**
     * Transforms filter properties that combine semantic keys with filter capabilities.
     * Converts oneOf structures like [ProcessInstanceKey, ProcessInstanceKeyFilterProperty] 
     * to allOf structures with backward-compatible filter types.
     */
    private static void transformFilterProperties(JsonNode root, Set<String> keyNames, JsonNode schemas) {
        System.out.println("Starting filter property transformation...");
        System.out.println("CamundaKey descendants: " + keyNames);
        transformFilterPropertiesRecursive(root, keyNames, schemas);
        System.out.println("Finished filter property transformation");
    }

    private static void transformFilterPropertiesRecursive(JsonNode node, Set<String> keyNames, JsonNode schemas) {
        if (node.isObject()) {
            ObjectNode obj = (ObjectNode) node;
            
            // Check for oneOf with filter property pattern
            if (obj.has("oneOf")) {
                ArrayNode oneOfArray = (ArrayNode) obj.get("oneOf");
                String semanticKeyRef = null;
                String filterPropertyRef = null;
                JsonNode preservedDescription = obj.get("description");
                
                // Analyze oneOf variants
                for (JsonNode variant : oneOfArray) {
                    if (variant.has("$ref")) {
                        String ref = variant.get("$ref").asText();
                        String refName = extractSchemaName(ref);
                        
                        if (keyNames.contains(refName)) {
                            semanticKeyRef = refName;
                        } else if (refName.endsWith("FilterProperty")) {
                            filterPropertyRef = refName;
                        }
                    }
                }
                
                // If we found both semantic key and filter property
                if (semanticKeyRef != null && filterPropertyRef != null) {
                    String backwardCompatibleFilter = mapToBackwardCompatibleFilter(filterPropertyRef);
                    
                    if (backwardCompatibleFilter != null) {
                        System.out.println("Transforming filter property: " + semanticKeyRef + " + " + filterPropertyRef + " -> " + backwardCompatibleFilter);
                        
                        // Replace with allOf structure
                        obj.remove("oneOf");
                        ArrayNode allOfArray = obj.putArray("allOf");
                        ObjectNode refNode = allOfArray.addObject();
                        refNode.put("$ref", "#/components/schemas/" + backwardCompatibleFilter);
                        
                        // Preserve description if it exists
                        if (preservedDescription != null) {
                            obj.set("description", preservedDescription);
                        }
                        return;
                    }
                }
            }
        }
        
        // Recurse into child nodes
        if (node.isObject()) {
            node.fields().forEachRemaining(entry -> 
                transformFilterPropertiesRecursive(entry.getValue(), keyNames, schemas));
        } else if (node.isArray()) {
            for (JsonNode child : node) {
                transformFilterPropertiesRecursive(child, keyNames, schemas);
            }
        }
    }

    /**
     * Extracts schema name from a $ref string like "#/components/schemas/ProcessInstanceKey"
     */
    private static String extractSchemaName(String ref) {
        if (ref.startsWith("#/components/schemas/")) {
            return ref.substring("#/components/schemas/".length());
        }
        return ref;
    }

    /**
     * Maps semantic key filter properties to their backward-compatible equivalents
     */
    private static String mapToBackwardCompatibleFilter(String filterPropertyName) {
        Map<String, String> filterMapping = Map.of(
            "ProcessInstanceKeyFilterProperty", "BasicStringFilterProperty",
            "ProcessDefinitionKeyFilterProperty", "BasicStringFilterProperty", 
            "ElementInstanceKeyFilterProperty", "BasicStringFilterProperty",
            "VariableKeyFilterProperty", "StringFilterProperty",
            "ScopeKeyFilterProperty", "StringFilterProperty",
            "MessageSubscriptionKeyFilterProperty", "StringFilterProperty",
            "JobKeyFilterProperty", "StringFilterProperty",
            "UserTaskKeyFilterProperty", "StringFilterProperty",
            "FormKeyFilterProperty", "StringFilterProperty",
            "IncidentKeyFilterProperty", "StringFilterProperty"
        );
        
        return filterMapping.get(filterPropertyName);
    }

    /**
     * Removes orphaned filter property schemas that are no longer needed after transformation
     */
    private static void cleanupOrphanedFilterSchemas(JsonNode schemas, Set<String> keyNames) {
        if (schemas == null || !schemas.isObject()) return;
        
        List<String> schemasToRemove = new ArrayList<>();
        
        for (Iterator<String> it = schemas.fieldNames(); it.hasNext(); ) {
            String schemaName = it.next();
            
            // Remove only semantic key filter property schemas
            if (isSemanticKeyFilterProperty(schemaName)) {
                schemasToRemove.add(schemaName);
                System.out.println("Marking for removal: " + schemaName);
            }
        }
        
        // Remove orphaned schemas
        ObjectNode schemasObj = (ObjectNode) schemas;
        for (String schemaName : schemasToRemove) {
            schemasObj.remove(schemaName);
            System.out.println("Removed orphaned schema: " + schemaName);
        }
    }

    /**
     * Flattens schemas marked with x-polymorphic-schema vendor extension.
     * Merges all properties from oneOf variants into a single schema.
     */
    private static void flattenUnionSchemas(JsonNode schemas) {
        if (schemas == null || !schemas.isObject()) return;
        
        List<String> schemasToFlatten = new ArrayList<>();
        
        // Find all schemas with x-polymorphic-schema extension
        for (Iterator<String> it = schemas.fieldNames(); it.hasNext(); ) {
            String schemaName = it.next();
            JsonNode schema = schemas.get(schemaName);
            if (schema.has("x-polymorphic-schema") && schema.get("x-polymorphic-schema").asBoolean()) {
                schemasToFlatten.add(schemaName);
            }
        }
        
        // Flatten each marked schema
        for (String schemaName : schemasToFlatten) {
            ObjectNode schema = (ObjectNode) schemas.get(schemaName);
            flattenUnionSchema(schema, schemas);
        }
    }

    /**
     * Flattens a single union schema by merging all oneOf variants.
     */
    private static void flattenUnionSchema(ObjectNode schema, JsonNode allSchemas) {
        JsonNode oneOfNode = schema.get("oneOf");
        if (oneOfNode == null || !oneOfNode.isArray()) {
            throw new RuntimeException("Schema marked with x-polymorphic-schema must have oneOf property");
        }
        
        ObjectNode flattenedProperties = schema.objectNode();
        Set<String> allPropertyNames = new HashSet<>();
        
        // Collect all properties from all variants
        for (JsonNode variant : oneOfNode) {
            JsonNode variantSchema = resolveSchemaReference(variant, allSchemas);
            if (variantSchema == null || !variantSchema.has("properties")) continue;
            
            JsonNode properties = variantSchema.get("properties");
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
     * Resolves a schema reference (either $ref or direct schema)
     */
    private static JsonNode resolveSchemaReference(JsonNode schema, JsonNode allSchemas) {
        if (schema.has("$ref")) {
            String ref = schema.get("$ref").asText();
            if (ref.startsWith("#/components/schemas/")) {
                String schemaName = ref.substring("#/components/schemas/".length());
                return allSchemas.get(schemaName);
            }
        }
        return schema; // Direct schema, not a reference
    }

    /**
     * Checks if two property definitions are compatible (same type, format, etc.)
     */
    private static boolean arePropertyDefinitionsCompatible(JsonNode prop1, JsonNode prop2) {
        // For this implementation, we require exact equality
        // You could make this more lenient by comparing only type, format, etc.
        return prop1.equals(prop2);
    }

     private static void replaceRefs(JsonNode node, Set<String> keyNames, Set<String> removedFilterSchemas, JsonNode schemasRoot) {
        if (node.isObject()) {
            ObjectNode obj = (ObjectNode) node;

            // Direct $ref flattening
            if (obj.has("$ref")) {
                String ref = obj.get("$ref").asText();
                
                // Check for CamundaKey descendants
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
                
                // Check for removed filter property schemas
                for (String filterSchema : removedFilterSchemas) {
                    if (ref.equals("#/components/schemas/" + filterSchema)) {
                        obj.removeAll();
                        obj.put("type", "string");
                        obj.put("description", "Filter property reference (removed during transformation)");
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
                            // Also check for removed filter schemas
                            for (String filterSchema : removedFilterSchemas) {
                                if (ref.equals("#/components/schemas/" + filterSchema)) {
                                    matchedKey = filterSchema;
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
            obj.fields().forEachRemaining(entry -> replaceRefs(entry.getValue(), keyNames, removedFilterSchemas, schemasRoot));

        } else if (node.isArray()) {
            for (JsonNode child : node) {
                replaceRefs(child, keyNames, removedFilterSchemas, schemasRoot);
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

    /**
     * Gets the list of filter property schema names that will be removed
     */
    private static Set<String> getRemovedFilterSchemaNames(JsonNode schemas) {
        Set<String> removedSchemas = new HashSet<>();
        if (schemas == null || !schemas.isObject()) return removedSchemas;
        
        for (Iterator<String> it = schemas.fieldNames(); it.hasNext(); ) {
            String schemaName = it.next();
            // Only include semantic key filter properties for removal
            if (isSemanticKeyFilterProperty(schemaName)) {
                removedSchemas.add(schemaName);
            }
        }
        return removedSchemas;
    }

    /**
     * Checks if a schema name represents a semantic key filter property that should be removed
     */
    private static boolean isSemanticKeyFilterProperty(String name) {
        return name.endsWith("KeyFilterProperty") ||
               (name.startsWith("Advanced") && name.contains("KeyFilter"));
    }

    /**
     * Checks if a schema name represents a filter property that should be handled separately
     */
    private static boolean isFilterPropertySchema(String name) {
        return isSemanticKeyFilterProperty(name);
    }
}