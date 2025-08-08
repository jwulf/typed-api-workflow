import { eventuallyconsistent  } from "../../../../../ergonomics/typescript/EventuallyConsistentDecorator";

export class Test {
    constructor(public times: number, public count = 0) {
    }
    @eventuallyconsistent
    async method(param: string) {
        this.count++;
        return this.count == this.times ? { body: { items: [param] } } : { body: { items: [] } };
    }
}
