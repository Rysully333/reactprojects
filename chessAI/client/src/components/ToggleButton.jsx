const ToggleButton = ({ isWhiteToMove, onToggle }) => {
    return (
        <div className="toggle-container">
            <button 
                className={`toggle-button ${isWhiteToMove ? 'white' : 'black'}`}
                onClick={onToggle}
            >
                {isWhiteToMove ? 'White to Move' : 'Black to Move'}
            </button>
        </div>
    );
};

export default ToggleButton;