import { eventuallyconsistent } from '../../ergonomics/typescript/EventuallyConsistentDecorator';

// DO NOT MODIFY - This is the acceptance criteria for the feature
test('Eventually consistent decorator works', async () => {
    class Test {
        constructor(public times: number, public count = 0) {
        }
        @eventuallyconsistent
        async method(param: string) {
            console.log(param, this.count) 
            console.log(JSON.stringify(this.toString(), null, 2))
            this.count++;
            return this.count == this.times ? {items: [param]} : {items: []};
        }
    }    
    const test = new Test(2)
    const res = await (test.method as any).eventually('my-parameter', {timeout: 5000})
    console.log(res)
    expect(res.items?.length).toBe(1)
    expect(test.count).toBe(2)
    expect(res.items[0]).toBe('my-parameter')
})