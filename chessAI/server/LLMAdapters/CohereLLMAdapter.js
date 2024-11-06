// Cohere LLM Adapter
import { CohereClient } from 'cohere-ai';
import LLMAdapter from './LLMAdapter.js';

class CohereLLMAdapter extends LLMAdapter {
    constructor(apiKey) {
        super();
        this.cohere = new CohereClient({ token: apiKey });
        console.log('Initialized Cohere LLM Adapter');
    }

    initiate() {
        // Initialization logic for Cohere API (if needed)
        console.log('Initiating Cohere API...');
    }

    async generate(messages) {
        console.log('Generating response from Cohere API...');
        // Format the input as a string that the model can understand
        const formattedInput = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');

        try {
            const response = await this.cohere.chat({
                model: 'command-r-plus-08-2024',
                message: formattedInput,
                maxTokens: 500,
            });

            return response.text;
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Error generating response from Cohere');
        }
    }

    async *stream(messages) {
        console.log('Streaming from Cohere API...');
        // Format the input as a string that the model can understand
        const formattedInput = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');

        try {
            const response = await this.cohere.chatStream({
                model: 'command-r-plus-08-2024',
                message: formattedInput,
            });

            // Forward the response stream directly
            for await (const chunk of response) {
                if (chunk.eventType == 'text-generation') {
                    yield chunk.text;
                }
            }
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Error generating response from Cohere');
        }
    }

    shutdown() {
        // Shutdown logic for Cohere API (if needed)
        console.log('Shutting down Cohere API...');
    }
}

export default CohereLLMAdapter;