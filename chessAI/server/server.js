import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'

import LLMAdapter from './LLMAdapters/LLMAdapter.js'
import CohereLLMAdapter from './LLMAdapters/CohereLLMAdapter.js'
import LocalLLMAdapter from './LLMAdapters/LocalLLMAdapter.js'

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const app = express();

// Needed state variables
let currentBody = {}
let server;

app.use(cors())

app.use(express.json());

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('local', {
        type: 'boolean',
        description: 'Use the local LLM',
        default: false
    })
    .argv;

const useLocalModel = argv.local;

console.log(`Using ${useLocalModel ? 'local' : 'Cohere'} LLM`);

const model = useLocalModel ? new LocalLLMAdapter() : new CohereLLMAdapter(process.env.COHERE_API_KEY);


const initializeApp = async () => {
    await model.initiate();

    server = app.listen(process.env.PORT, async () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
};

const gatherInfo = async (position) => {
    try {
        const response = await fetch(`https://explorer.lichess.ovh/masters?fen=${position}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json(); // Parse the JSON response
        console.log('Opening data:', data); // Log or handle the JSON data
        return data;
    } catch (error) {
        console.error('Error fetching opening data:', error);
    }
}


app.get('/', (req, res) => {
    res.send('Server is running');
});

//Start the generation process
app.post('/generate', async (req, res) => {
    // update the currentBody with the new messages
    currentBody = req.body
    currentBody.openingData = await gatherInfo(currentBody.position)
    currentBody.opening = currentBody.openingData.opening
    currentBody.backgroundInfo = `Here is your Background information: the current position of the chess board in FEN string: ${currentBody.position}\nCurrent opening: ${JSON.stringify(currentBody.opening)}
    \nHere is the opening game data, where the "white", "black", and "draw" fields are the number of games won by white, black, and drawn, respectively: ${JSON.stringify(currentBody.openingData)}\n\nThe moves played to get here are: ${currentBody.history}`

    console.log("Messages:")
    console.log(currentBody.messages)

    // Instruct the LLM to decide if they should make a move or not
    const systemPrompt = "You are a part of a larger helpful chess AI assistant. Your job is to tend to the board. Your output should stricly be a json, sending information about if moves are necessary. As a rule, do the least possible to achieve the result (ie if possible, **don't reset the board every time**, the board will keep its state). Based on message history, the position, and the expected agent response, you have three options:\n\n1. Play a sequence of moves (FEWER MOVES IS BETTER) from the current position (e.g., when the user wants to go move by move, explore a line, or references a common opening or board position, respond with a sequence of moves that will reach that position).\n2. Go to a new position (e.g. when the user asks to explore a new position, like the sicilian defense) **again, this is ONLY for entirely new positions**. This is done by resetting the board, and then doing the necessary moves (make sure not to carry moves from the old position). 3. Do nothing (the user still wants to look at the current board while conversing).\n\nWhen a sequence of moves should be made, respond with a JSON object formatted as follows:\n- **moveMade**: a boolean, set to 'true' if moves are being suggested, otherwise 'false'.\n- **moves**: an array of move strings in the format '<from_square><to_square>' (e.g., 'e2e4', 'g8f6'). If moveMade is 'false', set moves to 'null'.\n- **resetBoard**: a boolean, set to 'true' if the board should be reset before executing the moves, otherwise 'false'.\n\nExamples:\n1. {moveMade: true, moves: ['e2e4', 'd7d5', 'c2c4'], resetBoard: false}\n2. User: Can we explore the sicilian defense? {moveMade: true, moves: ['e2e4', 'c7c5'], resetBoard: true}\n3. {moveMade: false, moves: null, resetBoard: false}\n\nMoves should be determined based on the user's input, the current board position, and logical responses to the user's requests. Ensure that the moves suggested are legal from the current position."


    let moves = await model.generate([
        { role: "system", content: systemPrompt },
        { role: "context", content: currentBody.backgroundInfo },
        ...currentBody.messages
    ]);

    // If the response is ok, send the moves instruction back to the client
    let successfulGeneration = false
    let parsedMoves = null
    while (!successfulGeneration) {
        console.log(moves)
        try {
            // Attempt the operation that may fail
            parsedMoves = JSON.parse(moves);
            successfulGeneration = true;  // If the operation succeeds, set the flag to exit the loop
        } catch (error) {
            console.log("Operation failed, retrying...");
            moves = await model.generate([
                { role: "system", content: systemPrompt },
                { role: "context", content: currentBody.backgroundInfo },
                ...currentBody.messages
            ]);
        }
    }
    

    console.log(`Move: ${moves}`)
    currentBody.moves = moves

    res.status(200).json({ message: 'Prompt received', moveInstruction: parsedMoves });
})

app.get('/stream', async (req, res) => {
    console.log('Received stream request');
    async function main(body) {
        const { messages, position, moves, backgroundInfo } = body

        console.log(position)
        let data = ""

        const systemPrompt = `You are a helpful chess AI assistant. There is another section of the assistant that is executing moves on the chessboard, and has just executed the moves ${moves}. Your job is to respond to the end user.`

        // Predict!
        const prediction = model.stream([
            { role: "system", content: systemPrompt },
            { role: "context", content: backgroundInfo },
            ...messages
        ]);


        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const text of prediction) {
            if (text == "") console.log("BLANK");
            // console.log(`Sending: ${JSON.stringify(text)}\n\n`)
            res.write(`data: ${JSON.stringify(text)}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
    }
    main(currentBody).catch(error => {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
})

//automatically run when the server starts
await initializeApp();

// Handle process termination signals
process.on('SIGINT', () => {
    console.log('Received SIGINT. Graceful shutdown');
    server.close(async () => {
        console.log('HTTP server closed');
        await model.shutdown();
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Graceful shutdown');
    server.close(async () => {
        console.log('HTTP server closed');
        await model.shutdown();
        process.exit(0);
    });
});

// Handle process exit
process.on('exit', () => {
    console.log('Process exiting');
    model.shutdown();
});