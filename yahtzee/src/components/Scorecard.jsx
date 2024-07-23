import { useEffect, useState } from "react"
import TableRow from "./TableRow";
import { nanoid } from "nanoid";
import categories from "../categories";

export default function Scorecard({players, curPlayerIndex, possibleScores, activeRoll, 
    nextTurn, setWinner, scores, setScores, onboarded}) {
    
    //headers of players and names up top
    const playerHeaders = players.map((player, index) => {
        const styles = {
            backgroundColor: index==curPlayerIndex ? '#B2FF59' : '#007bff',
            color: index==curPlayerIndex ? '#212121' : 'white'
        };
        return <th key={index} style={styles}>{player}</th>
    })

    console.log(`Player headers: ${playerHeaders}`)

    
    const updateScore = (category => {
        const newScore = possibleScores[category]
        console.log(`New score: ${newScore}, category: ${JSON.stringify(category)}, curPlayerIndex: ${curPlayerIndex}`)
        setScores(prevScores => ({
            ...prevScores,
            [category]: prevScores[category].map((score, index) => index==curPlayerIndex ? newScore : score)
        }))
        nextTurn()
    })
    
    //Stack tableRows for all categories
    const baseTable = categories.map(category => {
        console.log(category)
        return <TableRow 
        key={nanoid()} 
        category={category} 
        scores={scores[category]} 
        addScore={() => updateScore(category)}
        activeRoll={activeRoll} 
        possibleScores={possibleScores} 
        curPlayerIndex={curPlayerIndex}
        />
    })
    
    const upperCategories = baseTable.slice(0, 6)
    const lowerCategories = baseTable.slice(6)
    
    //calculate totals
    //each value in .values() is an array
    const upperTotals = Object.values(scores).slice(0, 6).reduce(
        (acc, scorerow) => scorerow.map((score, index) => acc[index] + score || 0))
    const bonus = upperTotals.map(upTotal => upTotal >= 63 ? 35 : 0)
    const upperTotals2 = upperTotals.map((upTotal, index) => upTotal + bonus[index])
    const lowerTotals = Object.values(scores).slice(6).reduce(
        (acc, scorerow) => scorerow.map((score, index) => acc[index] + score || 0))
        
    const finalTotals = upperTotals2.map(((upTotal2, index) => upTotal2 + lowerTotals[index]))
    
    const table = [
        ...upperCategories,
        <TableRow category="Total Score" scores={upperTotals} />,
        <TableRow category="Bonus" scores={bonus} />,
        <TableRow category="Upper Total" scores={upperTotals2} />,
        ...lowerCategories,
        <TableRow category="Lower Total" scores={lowerTotals} />,
        <TableRow category="Upper Score" scores={upperTotals2} />,
        <TableRow category="Final Score" scores={finalTotals} />
    ]
    
    //End Game / Decide Winner
    useEffect(() => {
        if (Number.isInteger(scores['Ones'][0]) &&!Object.values(scores).some(row => row.includes(null))){
            const winnerIdx = finalTotals.reduce((maxIdx, curValue, curIdx, arr) => {
                return curValue > arr[maxIdx] ? curIdx : maxIdx
            }, 0)
            console.log(`Scores: ${JSON.stringify(scores)}`)
            console.log(`Bool check: ${Number.isInteger(scores['Ones'][0])}`)
            setWinner(players[winnerIdx])
        }
        console.log(`Scores values: ${JSON.stringify(Object.values(scores))}`)
    }, [scores])
    
    return (
        <div className="scoreboard">
            <h2 style={{margin:'8px'}}>The scorecard!</h2>
            <table>
                <thead>
                    <tr>
                        <th style={{maxWidth: 'none'}}>Category</th>
                        {playerHeaders}
                    </tr>
                </thead>
                <tbody>
                    {table}
                </tbody>
            </table>
        </div>
    )
}

/**
 * Approach:
 * pass in a react use state that includes all the scores, and updates the table 
 * when they change
 * 
 * For scorecard, make a table row component that can be repeated in the scorecard.
  Somehow, embed in each table row the function for scoring based on the three dice
 * 
 * how to only call function once when it is correct, possibly useEffect or something?
 * 
 * Thought: do I want the function logic in the tablerow, or outside? Is there possibly
 * somewhere outside where I can calculate all the logic as soon as the roll occurs,
 * then just
 */