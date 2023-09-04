// 
class Parser {
    constructor() {
        this.parser = null;
    }

    parse() {
        throw new Error("parse abstract method is not implemented");
    }

    standardize(data) {
        throw new Error("standardize abstract method is not implemented");
    }

}

export default Parser;