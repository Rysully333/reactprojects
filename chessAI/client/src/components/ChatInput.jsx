import { useState } from "react";

export default function ChatInput({input, setInput, messages, setMessages, game, setHistory, setPosition}) {
    const handleGenerate = async (updatedMessages) => {
        let success = false
        let response = null
        let failCounter = 0

        // Generate, making sure any moves are valid and retrying if they are not
        while (!success && failCounter < 10) {
            response = await fetch('http://localhost:5100/generate', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "messages": updatedMessages,
                    "history": game.history(),
                    "position": game.fen()
                })
            })

            if (!response.ok) {
                console.error('Failed to start the generation process');
                return;
            }
            const data = await response.json()
            console.log(data)

            try {
                // Check if the response dictates a move
                if (data.moveInstruction.moveMade) {
                    if (data.moveInstruction.resetBoard) {
                        game.reset()
                    }
                    const moves = data.moveInstruction.moves
                    for (let i = 0; i < moves.length; i++) {
                        game.move(moves[i])
                    }
                    setPosition(game.fen())
                    setHistory(game.history())
                }
                success = true
            } catch (error) {
                // Retry if the move was invalid
                console.error('Error generating response:', error);
                failCounter++;
            }
        }

        if (failCounter >= 10) {
            console.error('Failed to generate a valid move after 10 attempts');
        }

        const eventSource = new EventSource('http://localhost:5100/stream');

        let returnMessage = ""

        eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
                eventSource.close();
            } else {
                returnMessage+=JSON.parse(event.data)
                // console.log(`Char: ${event.data}`)
                // console.log(`char parsed: ${JSON.parse(event.data)}`)
                setMessages([...updatedMessages, {content: returnMessage, role: "assistant"}]);
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
            eventSource.close();
        };
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            // Add user message to the chat
            const updatedMessages = [...messages, { content: input, role: 'user' }]
            setMessages(updatedMessages)
            setInput('');

            await handleGenerate(updatedMessages)
            
        }
    };

    return (
        <form id="input-area" onSubmit={handleSubmit}>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
            />
            <button type="submit">Send</button>
        </form>
    )
}