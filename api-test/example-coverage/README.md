# Example Coverage Tool

CLI to measure example coverage in an OpenAPI spec.

## Usage

```
pnpm --filter example-coverage start ../../rest-api.domain.yaml
```

Options:
- `--format console|json` (default console)
- `--out <file>` when format=json
- `--fail-under <percent>` exit code 2 if coverage below threshold

## Field Semantics
A field = leaf schema node (non-object, non-array container). Arrays recurse into their `items`.

## Next Steps
- Add inherited example detection through $ref resolution
- Add markdown exporter
- Add ignore configuration
