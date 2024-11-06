import ReactMarkdown from 'react-markdown';

const ChatDisplay = ({messages, style}) => {
    const messageElements = messages.map((message, index) => {
        return (
            <div
                key={index}
                className={`message ${message.role}`}
            >
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
        )
    })

    // console.log(messageElements)

    return (
        <div id='chat-display-section' style={style}>
            {messageElements}
        </div>
    );
};

export default ChatDisplay;
