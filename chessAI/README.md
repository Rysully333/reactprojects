# Chess AI Tutor

Hello!

This is a personal project, with the goal to combine chess concepts with Generative AI. The chessboard is fully functional, with the ability to edit to reach desired positions. The agent is able to see the board, and thus provide insights based on the current positions. In addition, the agent is able to enact moves if appropriate.

### Implementation
This project is built with React and Express.

The chess interface uses Chessboard.jsx, a chessboard.js inspired React component library, for the chessboard interface. It also uses chess.js for implementing chess logic, such as if attempted moves are legal chess moves.

The default LLM agent is Cohere AI, accessible from the npm package cohere-ai (with a free tier). This was originally built around a local instance of Llama 3.1 with LM Studio, and is still available with the --local flag while running the server.js file. However, the LLM instance is around 4GB, so the switch to Cohere was meant to facilitate sharing of the application.

In addition, information from the Lichess database is used to augment user and board information.

### Instuctions to run
Install packages - "npm i"
To run the frontend, "npm run dev".
To run the backend, navigate to the server.js file, and run "node server.js"

### Example Use Cases
Ask for information about a current position:
User: "What can you tell me about my current position?"
Agent: responds with the opening name (if applicable), common or advisable next moves, possibly some games that have reached that position, and any theory surrounding the position.

Ask to explore a specific position:
User: "Can we explore the sicilian defense?"
Agent: Will first, through a board reset and a series of moves, will bring the board to the Sicilian Defense setup. Then, will describe theory about the position, and possible lines. Can enact any of those moves at the user's request

### Limitations
As I have discovered, LLMs are fundamentally bad at chess (which makes sense). Given free reign, it will hallucinate board positions, remove pieces from existence, try illegal moves, etc. I have attempted to mitigate this by letting the Lichess database provide as much of the analysis as possible, leaving the LLM to only interact with the user to explain the analysis handed to it. Upon giving the agent the ability to manipulate the board, there were significantly more impactful hallucinations. I have tried to reduce these with move validation combined with repeated model prompting if invalid moves were made, but it is not yet perfect. Be warned.
