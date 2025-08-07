import { eventuallyconsistent, EventuallyConsistentMethod } from "../../../../../generated/typescript/ergonomics/EventuallyConsistentDecorator";

export class Test {
    constructor(public times: number, public count = 0) {
    }
    @eventuallyconsistent
    async method(param: string) {
        console.log(param, this.count) 
        console.log(JSON.stringify(this.toString(), null, 2))
        this.count++;
        return this.count == this.times ? { items: [param] } : { items: [] };
    }
}
