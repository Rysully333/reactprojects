import { Chess } from 'chess.js';
import Chessboard from 'chessboardjsx'
import { useState } from 'react'

const boardToPosition = (board) => {
    const position = {};
    board.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (piece) {
                const file = String.fromCharCode(97 + colIndex);
                const rank = 8 - rowIndex;
                const square = `${file}${rank}`;
                position[square] = `${piece.color}${piece.type.toUpperCase()}`;
            }
        });
    });
    return position;
};

const boardToFen = (board, color) => {
    let fen = '';
    for (let i = 0; i < board.length; i++) {
        let empty = 0;
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === null) {
                empty++;
            } else {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                const piece = board[i][j];
                fen += piece.color === 'w' ? piece.type.toUpperCase() : piece.type;
            }
        }
        if (empty > 0) {
            fen += empty;
        }
        if (i < board.length - 1) {
            fen += '/';
        }
    }
    // Simplified FEN ending, may need to adjust based on your requirements
    fen += ` ${color} KQkq - 0 1`
    return fen;
};


export default function Board({game, setHistory, position, setPosition, editing, deleting}) {

    const onSquareClick = (square) => {
        if (editing && deleting) {
            removePiece(square);
        }
    };

    const removePiece = (square) => {
        const board = game.board();
        board[8 - parseInt(square[1], 10)][square.charCodeAt(0) - 97] = null;
        game.load(boardToFen(board));
        setPosition(game.fen());
    };

    function onDrop({sourceSquare, targetSquare, piece}) {
        console.log("Piece drop")
        if (editing) {
            console.log(`SS: ${sourceSquare}, TS: ${targetSquare}, P: ${piece}`)
            console.log(game.board())
            
            const newBoard = game.board()
            if (sourceSquare != 'spare')
                newBoard[8 - parseInt(sourceSquare[1])][sourceSquare.charCodeAt(0) - 97] = null;
            newBoard[8 - parseInt(targetSquare[1])][targetSquare.charCodeAt(0) - 97] = 
                {square: targetSquare, type: piece.toLowerCase()[1], color: piece[0]}
            console.log(`newBoard: ${newBoard}`)

            const newPosition = boardToFen(newBoard)
            game.load(newPosition)
            console.log(game.ascii())
            console.log(game.fen())
            setPosition(newPosition)
        } else {
            try {
                let move = game.move({
                    to: targetSquare,
                    from: sourceSquare,
                    promotion: 'q'
                })
                console.log(move)
            } catch (err) {
                console.log(err)
            }
            
            setPosition(game.fen())
            setHistory(game.history())

        }

    }

    return (
        <div>
            <Chessboard width={`400`} position={position} onDrop={onDrop} sparePieces={editing} onSquareClick={onSquareClick} />
        </div>
    )
}