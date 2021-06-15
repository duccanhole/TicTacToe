import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

function Square(props) {
    //make square on board
    return (
        <div className="square" onClick={props.onClick}>{props.value}</div>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        //render square
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />);
    }
    render() {
        //render board
        return (
            <div>
                <div className="row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
function findWinner(squares) {
    const lines = [
        //check posion
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8],
    ];
    for (let x of lines) {
        const [a, b, c] = x;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            //return winner if 3 positon of lines are same value
            return squares[a];
        }
    }
    return null;
}

//=======================================================================

//Game will control Board component 
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squares: Array(9).fill(null), }
            ],
            xNext: true,
            stepNum: 0,
        }
    }
    //--------------- !? --------------------
    jumpTo(step){
        this.setState({
            stepNum: step,
            xNext: (step%2)===0,
        });
    }
    //add click event
    handleClick(i) {
        //add history off move
        const history = this.state.history.slice(0,this.state.stepNum+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        //stop move when one player win or all square are filled
        if (findWinner(squares) || squares[i]) return;
        //check next move is X or O
        squares[i] = this.state.xNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNum: history.length,
            //set check function
            xNext: !this.state.xNext,

        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNum];
        const winner = findWinner(current.squares);
        //display move history
        const moves = history.map((step, move) => {
            //------------ !? --------------------
            const decs = move ?
                'Go to move: ' + move :
                'Go to start';
            return (
                <li key={move}>
                    <button type="button" class="btn-secondary" onClick={() => this.jumpTo(move)}>{decs}</button>
                </li>
            );
        });

        let status;
        //display status check winner or keep move
        status = winner ? ('Winner: ' + winner) : ('Next move: ' + (this.state.xNext ? 'X' : 'O'));
        return (
            <div className="row">
                <div className="board">
                    <h4>{status}</h4>
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="history">
                    <ul><li>{moves}</li></ul>
                </div>
            </div>
        );
    }
}

export default Game;
ReactDOM.render(<Game />, document.getElementById('root'));