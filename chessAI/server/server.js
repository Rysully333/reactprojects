import express from 'express'
import { exec } from 'child_process'
import cors from 'cors'
import ChessEcoCodes from 'chess-eco-codes'

import pkg from '@lmstudio/sdk';
const { LMStudioClient } = pkg;

const app = express();
const port = 5100;
let currentBody = {}

app.use(cors())

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/generate', async (req, res) => {
    currentBody = req.body
    console.log("Messages:")
    console.log(currentBody.messages)
    res.status(200).json({ message: 'Prompt received' });
    // const position = req.body.position
})

app.get('/stream', async (req, res) => {
    async function main(body) {
        // Create a client to connect to LM Studio, then load a model
        const client = new LMStudioClient();
        const model = await client.llm.load("Meta/Llama/Meta-Llama-3.1-8B-Instruct-128k-Q4_0.gguf");

        const { messages, position } = body

        console.log(position)
        console.log(ChessEcoCodes(position))

        const queensGambitPos = "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2"
        console.log(`Position: ${queensGambitPos}`)
        console.log(ChessEcoCodes(queensGambitPos))

        const stringOpening = JSON.stringify(ChessEcoCodes(queensGambitPos))
        
        // Predict!
        const prediction = model.respond([
            { role: "system", content: "You are a helpful chess AI assistant." },
            // { role: "system", content: `Here is the current position of the chess board in FEN string: ${position}\nCurrent opening: ${ChessEcoCodes(position).name}`},
            { role: "user", content: `Here is the current position of the chess board in FEN string: ${queensGambitPos}\nCurrent opening: ${stringOpening}`},
            ...messages
        ]);

        console.log(`Current opening: ${stringOpening}`)

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const text of prediction) {
          if (text == "") console.log("BLANK");
          console.log(`Sending: ${JSON.stringify(text)}\n\n`)
          res.write(`data: ${JSON.stringify(text)}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();

        // console.log(`Posiiton: ${position}`)

        // let output = ''

        // for await (const text of prediction) {
        //     output += text;
        //     console.log(text)
        // }

        // console.log(output)
        // return output
    }
    // const outmessage = await main(body)
    // console.log("Output from server:")
    // console.log(outmessage)
    // return res.json({
    //     'response': outmessage
    // })
    main(currentBody).catch(error => {
      console.error('Error generating response:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})

const server = app.listen(port, () => {
  exec('lms server start --cors=true', (error, stdout, stderr) => {
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