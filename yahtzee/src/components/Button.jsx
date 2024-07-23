export default function Button (props) {
    return (
        <button className="reroll-button" onClick={props.roll}>
            Roll
        </button>
    )
}