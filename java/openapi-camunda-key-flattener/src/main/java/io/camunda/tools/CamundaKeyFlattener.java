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
                    camundaKeyDescendants.add(name);
                }
            }
        }

        System.out.println("Found CamundaKey descendants: " + camundaKeyDescendants);

        // Step 2: Flatten union schemas marked with x-polymorphic-schema
        flattenUnionSchemas(schemas);

        // Step 3: Rewrite descendants as simple string type
        for (String keyName : camundaKeyDescendants) {
            ObjectNode schemaNode = (ObjectNode) schemas.get(keyName);
            retainDescriptionAndReplaceWithString(schemaNode);
        }

        // Step 4: Replace references and types throughout the spec
        replaceRefs(root, camundaKeyDescendants, new HashSet<>(), root.at("/components/schemas"));

        // Step 4.5: Fix Advanced Key Filter descriptions
        fixAdvancedKeyFilterDescriptions(root.at("/components/schemas"));

        // Step 5: Inject metadata
        injectMetadata(root);

    // Step 6: Sanitize domain-only operational metadata (remove from generated spec)
    removeOperationMetadata(root);

    // Step 7: Write with dynamic header comment
        String headerComment = generateHeaderComment();
        try (FileWriter writer = new FileWriter(output)) {
            writer.write(headerComment);
            mapper.writeValue(writer, root);
        }

        System.out.println("Finished writing to " + OUTPUT_FILE);
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

    /**
     * Checks if a oneOf array represents a CamundaKey filter pattern:
     * oneOf: [$ref to CamundaKey descendant, AdvancedXxxKeyFilter] where XxxKeyFilter matches the CamundaKey type
     */
    private static boolean isKeyFilterOneOfPattern(ArrayNode oneOfArray, Set<String> keyNames) {
        if (oneOfArray.size() != 2) return false;
        
        String keyTypeName = null;
        boolean hasAdvancedKeyFilter = false;
        
        for (JsonNode item : oneOfArray) {
            // Check for reference to CamundaKey descendant (e.g., $ref: "#/components/schemas/VariableKey")
            if (item.has("$ref")) {
                String ref = item.get("$ref").asText();
                if (ref.startsWith("#/components/schemas/")) {
                    String referencedType = ref.substring("#/components/schemas/".length());
                    
                    // Check if this is a CamundaKey descendant
                    if (keyNames.contains(referencedType)) {
                        keyTypeName = referencedType;
                    }
                    // Check if this is an AdvancedXxxKeyFilter
                    else if (ref.startsWith("#/components/schemas/Advanced") && ref.endsWith("KeyFilter")) {
                        String filterKeyType = ref.substring("#/components/schemas/Advanced".length(), 
                                                           ref.length() - "Filter".length());
                        if (keyNames.contains(filterKeyType)) {
                            hasAdvancedKeyFilter = true;
                        }
                    }
                }
            }
        }
        
        return keyTypeName != null && hasAdvancedKeyFilter;
    }

    /**
     * Checks if an allOf array represents a CamundaKey filter pattern:
     * allOf: [AdvancedXxxKeyFilter] where XxxKeyFilter matches a CamundaKey descendant type
     */
    private static boolean isKeyFilterAllOfPattern(ArrayNode allOfArray, Set<String> keyNames) {
        if (allOfArray.size() != 1) return false;
        
        JsonNode item = allOfArray.get(0);
        if (item.has("$ref")) {
            String ref = item.get("$ref").asText();
            if (ref.startsWith("#/components/schemas/Advanced") && ref.endsWith("KeyFilter")) {
                String filterKeyType = ref.substring("#/components/schemas/Advanced".length(), 
                                                   ref.length() - "Filter".length());
                return keyNames.contains(filterKeyType);
            }
        }
        
        return false;
    }

    /**
     * Checks if a oneOf array represents a string default with CamundaKey pattern:
     * oneOf: [string with default, CamundaKey descendant reference]
     */
    private static boolean isStringDefaultWithCamundaKeyPattern(ArrayNode oneOfArray, Set<String> keyNames) {
        if (oneOfArray.size() != 2) return false;
        
        boolean hasStringWithDefault = false;
        boolean hasCamundaKeyRef = false;
        
        for (JsonNode item : oneOfArray) {
            // Check for string type with default
            if (item.has("type") && "string".equals(item.get("type").asText()) && item.has("default")) {
                hasStringWithDefault = true;
            }
            // Check for reference to CamundaKey descendant
            else if (item.has("$ref")) {
                String ref = item.get("$ref").asText();
                if (ref.startsWith("#/components/schemas/")) {
                    String referencedType = ref.substring("#/components/schemas/".length());
                    if (keyNames.contains(referencedType)) {
                        hasCamundaKeyRef = true;
                    }
                }
            }
        }
        
        return hasStringWithDefault && hasCamundaKeyRef;
    }

    /**
     * Checks if a oneOf array consists exclusively of references to CamundaKey descendants.
     * In such cases we can safely collapse the union to a plain string for backward compatibility.
     */
    private static boolean isOneOfAllCamundaKeyRefs(ArrayNode oneOfArray, Set<String> keyNames) {
        if (oneOfArray == null || oneOfArray.isEmpty()) return false;
        for (JsonNode item : oneOfArray) {
            // Only allow $ref items that point to a CamundaKey descendant
            if (!item.has("$ref")) {
                return false;
            }
            String ref = item.get("$ref").asText("");
            if (!ref.startsWith("#/components/schemas/")) {
                return false;
            }
            String referencedType = ref.substring("#/components/schemas/".length());
            if (!keyNames.contains(referencedType)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Finds the string option in a oneOf array
     */
    private static JsonNode findStringOptionInOneOf(ArrayNode oneOfArray) {
        for (JsonNode item : oneOfArray) {
            if (item.has("type") && "string".equals(item.get("type").asText())) {
                return item;
            }
        }
        return null;
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
                        JsonNode description = extractDescriptionFromSchema(referencedSchema);

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

            // Handle oneOf patterns for CamundaKey filter properties
            if (obj.has("oneOf")) {
                ArrayNode oneOfArray = (ArrayNode) obj.get("oneOf");
                // General rule: if all oneOf entries are CamundaKey descendants, collapse to plain string
                if (isOneOfAllCamundaKeyRefs(oneOfArray, keyNames)) {
                    JsonNode description = obj.get("description");
                    obj.remove("oneOf");
                    obj.put("type", "string");
                    if (description != null && !STRIP_DESCRIPTIONS) {
                        obj.set("description", description);
                    }
                    return;
                }
                if (isKeyFilterOneOfPattern(oneOfArray, keyNames)) {
                    // Transform oneOf [CamundaKey descendant, AdvancedXxxKeyFilter] to allOf [BasicStringFilterProperty]
                    JsonNode description = obj.get("description");
                    obj.removeAll();
                    if (description != null && !STRIP_DESCRIPTIONS) {
                        obj.set("description", description);
                    }
                    ArrayNode allOfArray = obj.putArray("allOf");
                    ObjectNode ref = allOfArray.addObject();
                    ref.put("$ref", "#/components/schemas/BasicStringFilterProperty");
                    return;
                } else if (isStringDefaultWithCamundaKeyPattern(oneOfArray, keyNames)) {
                    // Transform oneOf [string with default, CamundaKey descendant] to just the string option
                    JsonNode description = obj.get("description");
                    JsonNode stringOption = findStringOptionInOneOf(oneOfArray);
                    
                    obj.removeAll();
                    if (description != null && !STRIP_DESCRIPTIONS) {
                        obj.set("description", description);
                    }
                    
                    // Copy the string option properties
                    if (stringOption != null) {
                        Iterator<Map.Entry<String, JsonNode>> fields = stringOption.fields();
                        while (fields.hasNext()) {
                            Map.Entry<String, JsonNode> field = fields.next();
                            obj.set(field.getKey(), field.getValue());
                        }
                    } else {
                        // Fallback to simple string
                        obj.put("type", "string");
                    }
                    return;
                }
            }

            // Handle allOf patterns that reference AdvancedXxxKeyFilter for CamundaKey properties
            if (obj.has("allOf")) {
                ArrayNode allOfArray = (ArrayNode) obj.get("allOf");
                if (isKeyFilterAllOfPattern(allOfArray, keyNames)) {
                    // Transform allOf [AdvancedXxxKeyFilter] to allOf [BasicStringFilterProperty]
                    JsonNode description = obj.get("description");
                    obj.removeAll();
                    if (description != null && !STRIP_DESCRIPTIONS) {
                        obj.set("description", description);
                    }
                    ArrayNode newAllOfArray = obj.putArray("allOf");
                    ObjectNode ref = newAllOfArray.addObject();
                    ref.put("$ref", "#/components/schemas/BasicStringFilterProperty");
                    return;
                }
            }

            // allOf / anyOf flattening - only flatten if entire structure is CamundaKey
            for (String composite : List.of("allOf", "anyOf")) {
                if (obj.has(composite)) {
                    ArrayNode arrayNode = (ArrayNode) obj.get(composite);

                    // Skip allOf patterns that are already handled by key filter transformation
                    if ("allOf".equals(composite) && isKeyFilterAllOfPattern(arrayNode, keyNames)) {
                        continue;
                    }

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
        JsonNode description = extractDescriptionFromSchema(node);
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
     * Extracts description from a schema, handling both direct description and allOf structure
     */
    private static JsonNode extractDescriptionFromSchema(JsonNode schema) {
        if (schema == null) return null;
        
        // Check for direct description
        JsonNode directDescription = schema.get("description");
        if (directDescription != null) {
            return directDescription;
        }
        
        // Check for description in allOf structure
        JsonNode allOf = schema.get("allOf");
        if (allOf != null && allOf.isArray()) {
            for (JsonNode item : allOf) {
                JsonNode description = item.get("description");
                if (description != null) {
                    return description;
                }
            }
        }
        
        return null;
    }

    /**
     * Fixes Advanced Key Filter schemas by adding missing descriptions to array properties
     */
    private static void fixAdvancedKeyFilterDescriptions(JsonNode schemas) {
        if (schemas == null || !schemas.isObject()) return;
        
        for (Iterator<String> it = schemas.fieldNames(); it.hasNext(); ) {
            String schemaName = it.next();
            
            // Check if this is an Advanced Key Filter schema
            if (schemaName.startsWith("Advanced") && schemaName.endsWith("KeyFilter")) {
                JsonNode schema = schemas.get(schemaName);
                if (schema.has("properties")) {
                    ObjectNode properties = (ObjectNode) schema.get("properties");
                    
                    // Fix $in property description
                    if (properties.has("$in")) {
                        ObjectNode inProperty = (ObjectNode) properties.get("$in");
                        if (!inProperty.has("description") && inProperty.has("type") && 
                            "array".equals(inProperty.get("type").asText())) {
                            inProperty.put("description", "Checks if the property matches any of the provided values.");
                        }
                    }
                    
                    // Fix $notIn property description
                    if (properties.has("$notIn")) {
                        ObjectNode notInProperty = (ObjectNode) properties.get("$notIn");
                        if (!notInProperty.has("description") && notInProperty.has("type") && 
                            "array".equals(notInProperty.get("type").asText())) {
                            notInProperty.put("description", "Checks if the property matches none of the provided values.");
                        }
                    }
                }
            }
        }
    }

    /**
     * Removes OperationMetadata schemas (and their variants) plus any x-operation-kind vendor extensions
     * from the generated specification so that downstream linters (Vacuum) see a simplified spec.
     */
    private static void removeOperationMetadata(JsonNode root) {
        if (!(root instanceof ObjectNode)) return;
        ObjectNode objRoot = (ObjectNode) root;
        JsonNode schemasNode = root.at("/components/schemas");
        if (schemasNode != null && schemasNode.isObject()) {
            ObjectNode schemasObj = (ObjectNode) schemasNode;
            // Names to remove
            List<String> toRemove = Arrays.asList(
                "OperationMetadata",
                "CommandOperation",
                "QueryOperation",
                "CreateOperation",
                "PatchOperation",
                "DeleteOperation",
                "EventOperation",
                "UpdateOperation",
                "BatchCommandOperation"
            );
            for (String name : toRemove) {
                if (schemasObj.has(name)) {
                    schemasObj.remove(name);
                }
            }
        }

        // Traverse paths -> operations and remove x-operation-kind vendor extension
        JsonNode paths = objRoot.get("paths");
        if (paths != null && paths.isObject()) {
            for (Iterator<String> pit = paths.fieldNames(); pit.hasNext(); ) {
                String pName = pit.next();
                JsonNode pathItem = paths.get(pName);
                if (pathItem != null && pathItem.isObject()) {
                    ObjectNode pathObj = (ObjectNode) pathItem;
                    for (String method : Arrays.asList("get","post","put","patch","delete","head","options","trace")) {
                        JsonNode op = pathObj.get(method);
                        if (op != null && op.isObject()) {
                            ((ObjectNode) op).remove("x-operation-kind");
                        }
                    }
                }
            }
        }
    }

}