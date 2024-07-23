export default function TableRow(props) {
    return (
        <tr>
            <td className="fit-content">{props.category}</td>
            {props.scores.map((score, index) => (
                index == props.curPlayerIndex && props.activeRoll && score===null ?
                <td key={index} className="scoreposs" onClick={props.addScore}>{props.possibleScores[props.category]}</td> :
                <td key={index} className="score">{score}</td>
            ))}
        </tr>
    )
}

//