import { eventuallyconsistent } from '../../tools/enhancements/typescript/ergonomics/EventuallyConsistentDecorator';

// DO NOT MODIFY - This is the acceptance criteria for the feature
test('Eventually consistent decorator works', async () => {
    class Test {
        constructor(public times: number, public count = 0) {
        }
        @eventuallyconsistent
        async method() {
            console.log('method', this.count) // logs NaN
            console.log(JSON.stringify(this.toString(), null, 2))
            this.count++;
            return this.count == this.times ? {items: [1, 2, 3]} : {items: []};
        }
    }    
    const test = new Test(2)
    console.log('test.method:', test.method);
    console.log('test.method.eventually:', (test.method as any).eventually);
    console.log('typeof test.method.eventually:', typeof (test.method as any).eventually);
    const res = await (test.method as any).eventually({timeout: 5000})
    console.log(res)
    expect(res.items?.length).toBe(3)
    expect(test.count).toBe(2)
})