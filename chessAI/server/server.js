import express from 'express'
import { exec } from 'child_process'

import pkg from '@lmstudio/sdk';
const { LMStudioClient } = pkg;

const app = express();
const port = 5100;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/generate', async (req, res) => {
    const messages = req.body.messages
    // const position = req.body.position

    async function main(messages) {
        // Create a client to connect to LM Studio, then load a model
        const client = new LMStudioClient();
        const model = await client.llm.load("Meta/Llama/Meta-Llama-3.1-8B-Instruct-128k-Q4_0.gguf");
        
        // Predict!
        const prediction = model.respond([
            { role: "system", content: "You are a helpful AI assistant." },
            ...messages
        ]);

        let output = ''

        for await (const text of prediction) {
            output += text;
            console.log(text)
        }

        console.log(output)
        return output
    }
    const output = await main(messages)
    console.log(output)
    res.json({
        'response': output
    })
})

const server = app.listen(port, () => {
  exec('lms server start', (error, stdout, stderr) => {
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
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to run when server shuts down
function onShutdown() {
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

// Handle process termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Graceful shutdown');
  server.close(() => {
    console.log('HTTP server closed');
    onShutdown();
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Graceful shutdown');
  server.close(() => {
    console.log('HTTP server closed');
    onShutdown();
    process.exit(0);
  });
});

// Handle process exit
process.on('exit', () => {
  console.log('Process exiting');
  onShutdown();
});


// import express from 'express'
// import bodyParser from 'body-parser'
// import { exec } from 'child_process';

// const app = express();
// const port = 5100;

// app.use(bodyParser.json());

// app.post('/generate', (req, res) => {
//     const prompt = req.body.prompt;

//     exec(`python gpt4all_script.py "${prompt}"`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error: ${error.message}`);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }
//         if (stderr) {
//             console.error(`Stderr: ${stderr}`);
//             // return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         res.json({ response: stdout.trim() });
//     });
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });