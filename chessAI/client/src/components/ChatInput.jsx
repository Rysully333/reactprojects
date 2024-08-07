export default function ChatInput({input, setInput, messages, setMessages}) {
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            // Add user message to the chat
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');

            // Simulate chatbot response (replace with actual chatbot logic)
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'This is a simulated response.', sender: 'bot' },
                ]);
            }, 500);
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