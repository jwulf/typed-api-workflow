const { ProcessInstanceApi, WithEventuality, WithTracing } = require('../../../generated/typescript');

console.log('Testing eventually property preservation...\n');

// Test 1: Basic API
const processInstanceApi = new ProcessInstanceApi();
console.log('1. Basic API methods:');
console.log('   searchProcessInstanceIncidents exists:', typeof processInstanceApi.searchProcessInstanceIncidents);
console.log('   searchProcessInstanceIncidents.eventually exists:', typeof processInstanceApi.searchProcessInstanceIncidents?.eventually);
console.log('');

// Test 2: WithEventuality only
const eventualApi = WithEventuality(processInstanceApi);
console.log('2. WithEventuality enhanced API:');
console.log('   searchProcessInstanceIncidents exists:', typeof eventualApi.searchProcessInstanceIncidents);
console.log('   searchProcessInstanceIncidents.eventually exists:', typeof eventualApi.searchProcessInstanceIncidents?.eventually);
console.log('');

// Test 3: WithTracing only  
const tracingApi = WithTracing(processInstanceApi);
console.log('3. WithTracing enhanced API:');
console.log('   searchProcessInstanceIncidents exists:', typeof tracingApi.searchProcessInstanceIncidents);
console.log('   searchProcessInstanceIncidents.eventually exists:', typeof tracingApi.searchProcessInstanceIncidents?.eventually);
console.log('');

// Test 4: Both wrappers
const bothApi = WithTracing(WithEventuality(processInstanceApi));
console.log('4. Both WithEventuality and WithTracing:');
console.log('   searchProcessInstanceIncidents exists:', typeof bothApi.searchProcessInstanceIncidents);
console.log('   searchProcessInstanceIncidents.eventually exists:', typeof bothApi.searchProcessInstanceIncidents?.eventually);
console.log('');

// Test 5: Properties inspection
console.log('5. Property inspection:');
if (eventualApi.searchProcessInstanceIncidents) {
    const method = eventualApi.searchProcessInstanceIncidents;
    console.log('   WithEventuality method keys:', Object.keys(method));
    console.log('   WithEventuality method props:', Object.getOwnPropertyNames(method));
    console.log('   WithEventuality method descriptors:', Object.getOwnPropertyDescriptors(method));
}
