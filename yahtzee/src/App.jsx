import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

import Die from './components/Die'
import Navbar from './components/Navbar'
import Scorecard from './components/Scorecard'
import getPossibleScores from './getPossibleScores'
import categories from './categories'

function App() {

  const [onboarded, setOnboarded] = useState(false)

  const [dice, setDice] = useState(allNewDice())
  const [rollsLeft, setRollsLeft] = useState(3)

  const [players, setPlayers] = useState([])
  const [curPlayerIndex, setCurPlayerIndex] = useState(0)

  const [possibleScores, setPossibleScores] = useState([])
  const [winner, setWinner] = useState(null)
  
  //Set table to all blank
  const initializeScores = (players, categories) => {
    return categories.reduce((acc, category) => {
      acc[category] = Array(players.length).fill(null);
      return acc;
    }, {});
  };

  //use state for scores that will go in table, set to init scores (blank)
  const [scores, setScores] = useState({initialState: [null]})

  useEffect(() => {
    setScores(initializeScores(players, categories))
  }, [onboarded])
  
  useEffect(() => {
    setPossibleScores(getPossibleScores(dice.map(die => die.value)))
}, [dice])
  
  function newDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      // value: 6,
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i=0; i<5; ++i) {
      newDice.push({
        value: 1,
        isHeld: false,
        id: nanoid()
      })
    }
    return newDice
  }
  
  function holdDie(id) {
    if (rollsLeft < 3) {
      setDice(oldDice => oldDice.map(
        die => die.id == id ? 
        {...die, isHeld:!die.isHeld} :
        die
        ))
      }
    }
      
  function rollDice () {
    setRollsLeft(prevNum => prevNum - 1)
    setDice(prevDice => prevDice.map(
      die => die.isHeld ? die : newDie()
    ))
  }

  //maybe not needed as separate function?
  function resetDice () {
    setRollsLeft(3)
    setDice(allNewDice())
  }

  function nextTurn() {
    resetDice()
    setCurPlayerIndex(oldIndex => (oldIndex + 1) % players.length)
  }

  function newGame() {
    setWinner(null)
    setOnboarded(false)
    setScores(initializeScores(players, categories))
    resetDice()
    setCurPlayerIndex(0)
  }

  const diceElements = dice.map(die => 
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      hold={() => holdDie(die.id)}
    />
  )

  function removePlayer(index) {
    setPlayers(prevPlayers => [...prevPlayers.slice(0, index), ...prevPlayers.slice(index+1)])
  }

  const playerNames = players.map((player, index) => {
    return (
      <div className='playerName'>
        <p>{player}</p>
        <button onClick={() => removePlayer(index)}>x</button>
      </div>
    )
})

  const [inputValue, setInputValue] = useState('')

  function addPlayer() {
    setPlayers(prevPlayers => [...prevPlayers, inputValue])
    setInputValue('')
  }

  function endGame() {
    setScores(prevScores => {
      const filledScores = {}
      Object.entries(prevScores).forEach(([category, items]) => {
        filledScores[category] = items.map(rowval => rowval || 0)
      })
      return filledScores;
    })
  }

  console.log(`Winner: ${winner}`)

  return (
    <div className='container'>
      <Navbar />
      <h1>Yahtzee!</h1>

      {onboarded ? 
      <main>
        {!winner && <div className='roll-container'>
          <h2 className='turnAnnouncer'>{players[curPlayerIndex]}'s Turn!</h2>
          <div className='dice-container'>
            {diceElements}
          </div>
          <div>
            {
              rollsLeft ? 
              <button className="reroll-button" onClick={rollDice}>Roll</button> :
              <button className="dont-reroll-button">No more rolls</button>
            }
          </div>
          <button className='reroll-button' onClick={endGame}>End Game</button>
        </div>}
        {winner && 
          <div>
            <Confetti />
            <h2>{winner} won!</h2>
            <button className='reroll-button' onClick={newGame}>New Game</button>
          </div>}
        <Scorecard possibleScores={possibleScores} players={players} 
          nextTurn={nextTurn} scores={scores} setScores={setScores}
          curPlayerIndex={curPlayerIndex} activeRoll={rollsLeft < 3} setWinner={setWinner} />
      </main> :
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height:'80%'}}>
        <div>
          <h2>Players:</h2>
          {playerNames}
        </div>
        <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'bottom',
            }}>
          <input 
            type='text' 
            value={inputValue} 
            onChange={event => setInputValue(event.target.value)} 
            />
          <button className='reroll-button' onClick={addPlayer}>Add Player</button>
          {players.length ? 
            <button className='start-button' onClick={() => setOnboarded(true)}>Start Game</button> :
            <h3 className='warning'>Must have at least one player</h3>
          }
        </div>
      </div>
      }
    </div>
  )
}

export default App
