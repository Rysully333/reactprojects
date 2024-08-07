import { useState, useRef } from 'react'
import { Chess } from 'chess.js'

import Navbar from './components/Navbar'
import Board from './components/Board'
import ChatDisplay from './components/ChatDisplay'
import ChatInput from './components/ChatInput'
import Banner from './components/Banner'

function App() {
  const [messages, setMessages] = useState([{role: "assistant", content: "Let me know if you have any questions!"}])
  const [input, setInput] = useState('')
  const [game, setGame] = useState(new Chess())
  const [history, setHistory] = useState(game.history())
  const [position, setPosition] = useState('start')

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  console.log(`History: ${game.history()}`)
  
  //Splitter Logic
  const [split, setSplit] = useState(60);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
      isDragging.current = true;
  };

  const handleMouseUp = () => {
      isDragging.current = false;
  };

  const handleMouseMove = (e) => {
      if (isDragging.current) {
          const newSplit = (e.clientX / window.innerWidth) * 100;
          if (newSplit > 20 && newSplit < 80) {
              setSplit(newSplit);
          }
      }
  };

  console.log(`Split: ${split}`)

  const clearBoard = () => {
    const fenString = "4k3/8/8/8/8/8/8/4K3 w - - 0 1"
    game.load(fenString)
    setPosition(fenString)
  }

  const resetBoard = () => {
    game.reset()
    setPosition(game.fen())
  }

  return (
    <>
      <body onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <Navbar />
        <Banner history={history}/>
        <div id='main-content'>
          <div id='content'>
            <div id='chessboard-section' style={{ flex: split }}>
              <Board {... {game, setHistory, position, setPosition, editing, deleting}} />
              <div className='button-container'>
                {editing ? 
                  <div>
                    <button className='editButton' onClick={() => setDeleting(prevDelete => !prevDelete)}>
                      {deleting ? "Stop Deleting" : "Delete Pieces"}
                    </button>
                    <button className='editButton' onClick={clearBoard}>Clear</button>
                    <button className='editButton' onClick={resetBoard}>Reset</button>
                    <button className='editButton' onClick={() => setEditing(false)}>Done</button> 
                  </div> :
                  <button className='editButton' onClick={() => setEditing(true)}>Edit Board</button>
                }
              </div>
            </div>
            <div id="splitter" onMouseDown={handleMouseDown}></div>
            <ChatDisplay messages={messages} style={{ flex: 100 - split }}/>
          </div>
          <ChatInput {... {messages, setMessages, input, setInput}} />
        </div>
      </body>
    </>
  )
}

export default App
