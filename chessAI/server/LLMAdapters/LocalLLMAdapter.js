// Purpose: Implementation of the Local LLM Adapter class.
import pkg from '@lmstudio/sdk';
const { LMStudioClient } = pkg;
import LLMAdapter from './LLMAdapter.js';

import util from 'util'
import { exec } from 'child_process'
const execPromise = util.promisify(exec);


// Local LLM Adapter
class LocalLLMAdapter extends LLMAdapter {
    constructor() {
        super();
        console.log('Initialized Local LLM Adapter');
    }

    async initiate() {
        // Initialization logic for the local model
        console.log('Initiating local model...');
        //Start up the LMS server
        try {
            console.log('Starting LMS server...');
            const { stdout, stderr } = await execPromise('lms server start --cors=true');
            
            if (stderr) {
                console.error(`Error: ${stderr}`);
            }
            
            console.log(`LMS server started successfully: ${stdout}`);
        } catch (error) {
            console.error(`Error starting LMS server: ${error.message}`);
        }

        console.log("Done Trying");

        // Create a client to connect to LM Studio, then load a model
        const client = new LMStudioClient();
        console.log("Client created");
        try {
            this.model = await client.llm.load(process.env.MODEL_PATH);
            console.log('Model loaded successfully');
        } catch (error) {
            console.error(`Error loading model: ${error.message}`);
        }
    }

    async generate(input) {
        // Replace this with actual logic for generating response from the local LLM
        console.log('Generating response from local model...');
        const response = await this.model.generate(input); // Assume this returns a string
        return response;
    }

    async *stream(input) {
        // Replace this with actual logic for streaming response from the local LLM
        console.log('Streaming from local model...');
        const responseStream = this.model.respond(input); // Assume this returns an async iterable

        // Forward the response stream directly
        for await (const chunk of responseStream) {
            yield chunk;
        }
    }

    async shutdown() {
        console.log('Shutting down server...');
        exec('lms server stop', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error stopping LMS server: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error: ${stderr}`);
                return;
            }
            console.log(`LMS server stopped successfully: ${stdout}`);
        });
    }
}

export default LocalLLMAdapter;