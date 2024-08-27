import { useState } from "react";

export default function ChatInput({input, setInput, messages, setMessages, game}) {
    const handleGenerate = async (updatedMessages) => {
        // const url = 'http://localhost:5100/generate'
        const response = await fetch('http://localhost:5100/generate', {
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

        const eventSource = new EventSource('http://localhost:5100/stream');

        let returnMessage = ""

        eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
                eventSource.close();
            } else {
                returnMessage+=JSON.parse(event.data)
                console.log(`Char: ${event.data}`)
                console.log(`char parsed: ${JSON.parse(event.data)}`)
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

            // Simulate chatbot response (replace with actual chatbot logic)
            // setTimeout(() => {
            //     setMessages((prevMessages) => [
            //         ...prevMessages,
            //         { content: 'This is a simulated response.', role: 'assistant' },
            //     ]);
            // }, 500);

            // const url = "http://localhost:5100/generate"

            // let response = null

            // try {
            //     const result = await fetch(url, {
            //         method: "POST",
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             "messages": updatedMessages,
            //             "history": game.history(),
            //             "position": game.fen()
            //         })
            //     })

            //     const data = await result.json()
                
            //     response = data.response
            //     console.log("Fetch success!")
            //     console.log(response)
            // } catch (error) {
            //     console.error('Error fetching data:', error);
            // }

            // if (!response) {
            //     response = "Sorry, there was an error generating a response."
            // }

            // setMessages((prevMessages) => [
            //     ...updatedMessages,
            //     { content: response, role: 'assistant' },
            // ])
            
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