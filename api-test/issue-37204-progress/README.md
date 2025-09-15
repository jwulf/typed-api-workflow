# Issue 37204 Progress Tool

Retrieves GitHub issue `camunda/camunda#37204` (or override via env) and reports checklist completion in the "Test Scope & Checklist" section.

## Usage

Install deps (first time):
```
npm install
```

Run:
```
npm start
```

Output format:
```
<checked>/<total> <percent>%
```
Example:
```
7/12 58%
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| ISSUE_REPO | camunda/camunda | owner/repo of the issue |
| ISSUE_NUMBER | 37204 | issue number |
| ISSUE_PROGRESS_VERBOSE | (unset) | set to 1 for extra logs |

## Notes
- Falls back to scanning entire issue body if the section heading `### Test Scope & Checklist` is absent.
- Counts `- [ ]` unchecked and `- [x]` / `- [X]` checked items.
- No GitHub auth; for private or high‑rate usage add a token header extension.
