const ChatDisplay = ({messages, style}) => {
    const messageElements = messages.map((message, index) => {
        return (
            <div
                key={index}
                className={`message ${message.role}`}
            >
                {message.content}
            </div>
        )
    })

    console.log("Hello")
    console.log(messageElements)

    return (
        <div id='chat-display-section' style={style}>
            {messageElements}
        </div>
    );
};

export default ChatDisplay;
