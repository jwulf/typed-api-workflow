# Camunda TypeScript SDK Reference

Generated: 2025-08-31T10:53:29.136Z
## Configuration

| Key | Type | Default | Required | Flags | Status | Description |
|-----|------|---------|----------|-------|--------|-------------|
| `CAMUNDA_REST_ADDRESS` | string | `http://localhost:8080` | No |  |  | Base REST endpoint address. |
| `CAMUNDA_TOKEN_AUDIENCE` | string | `zeebe.camunda.io` | No |  |  | Token audience for OAuth flows. |
| `CAMUNDA_CLIENT_ID` | string | — | Required when CAMUNDA_AUTH_STRATEGY=OAUTH |  |  | OAuth client id (required when CAMUNDA_AUTH_STRATEGY=OAUTH). |
| `CAMUNDA_CLIENT_SECRET` | string | — | Required when CAMUNDA_AUTH_STRATEGY=OAUTH | secret |  | OAuth client secret (required when CAMUNDA_AUTH_STRATEGY=OAUTH). |
| `CAMUNDA_OAUTH_URL` | string | `https://login.cloud.camunda.io/oauth/token` | No |  |  | OAuth token URL. |
| `CAMUNDA_AUTH_STRATEGY` | enum(NONE | OAUTH | BASIC) | `NONE` | No |  |  | Authentication strategy. |
| `CAMUNDA_BASIC_AUTH_USERNAME` | string | — | Required when CAMUNDA_AUTH_STRATEGY=BASIC |  |  | Basic auth username (required when CAMUNDA_AUTH_STRATEGY=BASIC). |
| `CAMUNDA_BASIC_AUTH_PASSWORD` | string | — | Required when CAMUNDA_AUTH_STRATEGY=BASIC | secret |  | Basic auth password (required when CAMUNDA_AUTH_STRATEGY=BASIC). |
| `CAMUNDA_SDK_VALIDATION` | string | `req:none,res:none` | No |  |  | Validation mini-language controlling req/res modes. |
| `CAMUNDA_SDK_VALIDATION_VERBOSE` | boolean | — | Yes* (no default) |  |  | Verbose validation output flag. |

