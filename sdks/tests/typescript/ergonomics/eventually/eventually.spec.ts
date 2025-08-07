import { Test } from './TestClass/TestClass';

// DO NOT MODIFY - This is the acceptance criteria for the feature
test('Eventually consistent decorator works', async () => {
    const test = new Test(2)
    const res = await (test.method as any).eventually('my-parameter', {timeout: 5000})
    expect(res.items?.length).toBe(1)
    expect(test.count).toBe(2)
    expect(res.items[0]).toBe('my-parameter')
})

