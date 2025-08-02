# Domain-typed REST API for Camunda POC development workflow

This repository contains the source, tools, and development workflow for developing the proof-of-concept for a [domain typed REST API for Camunda 8](https://github.com/camunda/camunda/issues/36026).

This workflow is designed to ensure that the domain typed REST API is kept up-to-date with the latest version of the REST API, while also ensuring that the generated files are valid and do not break the build or change the behaviour of the API.

It uses camunda/camunda, camunda/camunda-8-js-sdk, and camunda/camunda-docs.

## Structure

- `rest-api.yml` - This file contains the latest version of the REST API specification. It is used as the source for generating the domain file and the generated file.
- `rest-api.domain.yaml` - This file contains the domain typed REST API specification. It is hand made from the `rest-api.yaml` file and contains additional domain information.
- `rest-api.generated.yaml` - This file is generated from the `rest-api.domain.yaml` file. It contains a generated REST API specification compatible with the Camunda codebase.
- `src/` - This directory contains the source code for the transformation from the domain file to the generated file.
- `vaccum` - Vacuum linting for the generated spec
- `functions` - Spectral functions for linting the domain spec
- `camunda` - checkout camunda/camunda here for scripts to fetch the upstream rest-api.yaml
- `camunda-docs` - checkout camunda/camunda-docs here for script to interact with documentation generation

## Setup

To set up the development environment for the domain typed REST API for Camunda, follow these steps:
1. Clone the `camunda/camunda`, `camunda/camunda-docs`, and `camunda/camunda-8-js-sdk` repositories.
2. Clone this repository.
3. Ensure you have Node.js and npm installed.
4. Install the necessary Node.js dependencies by running `npm install` in the root directory of this repository.
5. Install the Spectral CLI globally by running `npm install -g @stoplight/spectral-cli`.
6. Install the Vacuum CLI globally by running `npm install -g @stoplight/vacuum-cli`.
7. Install the Spectral VSCode extension for live linting of the domain file.
8. Install the Vacuum VSCode extension for live linting of the generated file.
9. Ensure you have Maven installed and configured on your system.
10. Ensure you have Docker installed and running, as it will be used to run Elasticsearch for testing purposes.
11. Ensure you have a Java Development Kit (JDK) installed, as it is required to build and run Camunda.

## Workflow

These are the steps to follow when working on the domain typed REST API for Camunda. 
The process involves generating a domain file from the latest version of the REST API, transforming it, and ensuring that the generated files are valid and do not break the build or change the behaviour of the API.

## Establish a green baseline

- Pull the latest changes from main and build Camunda: 

```bash
npm run spec:update
npm run spec:build
npm run spec:verify
```

- Start Camunda following the instructions in the [Running Camunda](#running-camunda) section.
- Run the Node.js SDK tests against the started Camunda instance to ensure everything works as expected.

This gives us a green baseline to work from. You can stop Camunda now.

## Update the domain typed REST API

When updating the domain typed REST API, follow these steps to ensure that the changes are valid and do not break the build or change the behaviour of the API.

Read the scripts in package.json if you want to know what they do. 

1. You got the latest version of `zeebe/gateway-protocol/src/main/proto/rest-api.yaml` by running `npm run spec:update`.
2. Use the git status diff to see what has changed.
3. Copy the changes to `rest-api.domain.yaml`, adding domain information.
4. Run `npm run lint:domain` to ensure the domain file is valid. (You can use the Spectral plugin in VSCode for live linting.)
5. Run `npm run spec:generate` - this will generate the `rest-api.generated.yaml` file.
6. Run `npm run lint:generated` to lint the generated files= with Vacuum.

This ensures that the generated files are valid and follow the expected structure.

## Verify the generated file

1. Run `npm run spec:install` to copy the generated file to the `zeebe/gateway-protocol/src/main/proto/rest-api.yaml` directory of camunda/camunda.
2. Run `npm run spec:build` to build with the generated file.
3. Run `npm run spec:verify` to verify the build.

This ensures that the generated file does not contain any changes that would break the build of Camunda 8.

## Verify the API behaviour

1. Run Camunda, following the instructions in the [Running Camunda](#running-camunda) section.
2. Run the Node.js SDK tests against the started Camunda instance to ensure the API behaves as expected.

## Inspect the impact of the changes on documentation

1. Run `npm run docs:generate` to regenerate API docs in camunda/camunda-docs.
2. Run `npm run docs:start` to start the live docs server.

You will now be able to inspect the impact of the changes on the documentation by navigating to `http://localhost:3000/`.

## Everything looks good?

Congratulations! You have successfully updated the domain typed REST API for Camunda.

- Commit the changes to the `rest-api.domain.yaml` and `rest-api.yaml` files.

## Running Camunda

- Run `npm run camunda:es:stop` to stop any running Elasticsearch Docker container.
- Run `npm run camunda:es:start` to start an ES container. (Alternative: open the file `operate/docker-compose.yml` in IntelliJ and click the green arrow next to the elasticsearch service to start it).
- Run `npm run silence:elastic` to suppress deprecation warnings in the logs.

- Run `npm run camunda:clean` to delete the data directory from any previous run of Camunda.
- Open the file `src/main/java/io/camunda/application/StandaloneCamunda.java` from camunda/camunda in IntelliJ.
- Ensure that the class run configuration has the following environment variables set:
```CAMUNDA_SECURITY_AUTHENTICATION_UNPROTECTEDAPI=true;CAMUNDA_SECURITY_AUTHORIZATIONS_ENABLED=false;ZEEBE_BROKER_EXPORTERS_CAMUNDAEXPORTER_CLASSNAME=io.camunda.exporter.CamundaExporter```
- Click the green arrow next to the `class` declaration to run Camunda.

## Running the Node.js SDK tests

These test function as behavioural tests for the REST API. They ensure that the API behaves as expected and that the generated files are correct.

In the SDK, source the local configuration:

```bash
source env/c8run
```

Run the 8.8 integration tests:

```bash
npm run test:local-integration:8.8
```

