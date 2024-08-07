export default function Banner({history}) {

    const historyFormatted = history.map((move, index) => <p key={index} style={index % 2 ? {marginRight: '20px'} : {marginRight: '5px'}}>{index % 2 ? ` ${move}\t` : `${index / 2 + 1}. ${move}`}</p>)
    return (
        <div id='banner'>
            {historyFormatted}
        </div>
    )
}