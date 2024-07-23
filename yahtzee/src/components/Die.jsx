export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? '#fffec8' : 'white'
    }
    return (
        <div className="dice" onClick={props.hold} style={styles}>
            <h2>{props.value}</h2>
        </div>
    )
}