export interface SdkDefinition {
    name: string;
    path: string;
    generator: string;
    generatorOptions: string;
}
export type SupportedSdk = 'typescript' | 'csharp' | 'go' | 'python' | 'php';
export type SdkDefinitions = {
    [K in SupportedSdk]?: SdkDefinition;
};
export const sdks: SdkDefinitions = {
    typescript: { 
        name: 'typescript', 
        path: 'typescript', 
        generator: 'typescript-node', 
        generatorOptions: 'npmName=@camunda8/rest-api,npmVersion=1.0.0,typescriptThreePlus=true,withSeparateModelsAndApi=true,supportsES6=true' 
    },
    // csharp: { 
    //     name: 'csharp', 
    //     path: 'csharp', 
    //     generator: 'csharp', 
    //     generatorOptions: 'packageName=Camunda.RestApi,packageVersion=1.0.0,clientPackage=Camunda.RestApi.Client,packageCompany=Camunda,packageAuthors=YourTeam,packageDescription=SDK_for_Process_Management_API,targetFramework=netstandard2.0,generatePropertyDocumentation=true,hideGenerationTimestamp=true,useCollection=true,returnICollection=false' 
    // },
    // go: { 
    //     name: 'go', 
    //     path: 'go', 
    //     generator: 'go', 
    //     generatorOptions: 'packageName=camunda-client,packageVersion=1.0.0,generateInterfaces=true' 
    // },
    // python: { 
    //     name: 'python', 
    //     path: 'python', 
    //     generator: 'python', 
    //     generatorOptions: 'packageName=camunda-client,packageVersion=1.0.0,projectName=camunda-client,generateSourceCodeOnly=true' 
    // },
    // php: { 
    //     name: 'php', 
    //     path: 'php', 
    //     generator: 'php', 
    //     generatorOptions: 'composerVendorName=camunda,composerProjectName=rest-api,packageName=RestApi,invokerPackage=Camunda\\Client,modelPackage=Camunda\\Client\\Model,apiPackage=Camunda\\Client\\Api' 
    // },
}