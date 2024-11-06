// Base LLMAdapter class
class LLMAdapter {
    async initiate() {
        throw new Error('Method "initiate" must be implemented.');
    }

    async generate(input) {
        throw new Error('Method "generate" must be implemented.');
    }

    async stream(input) {
        throw new Error('Method "stream" must be implemented.');
    }

    async shutdown() {
        throw new Error('Method "shutdown" must be implemented.');
    }
}

export default LLMAdapter;