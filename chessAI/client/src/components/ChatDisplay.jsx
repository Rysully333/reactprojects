const ChatDisplay = ({messages, style}) => {
    const messageElements = messages.map((message, index) => {
        return (
            <div
                key={index}
                className={`message ${message.sender}`}
            >
                {message.text}
            </div>
        )
    })

    return (
        <div id='chat-display-section' style={style}>
            {messageElements}
        </div>
    );
};

export default ChatDisplay;
