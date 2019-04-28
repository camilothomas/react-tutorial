import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//1. display the location for each move in the format (col, row) in the move history list
//2. bold the currently selected item in the move list
//3. rewrite board to use two loops to make the squares instead of hard coding them
//4. add a toggle button that lets you sort the moves in either ascending or descending order
//5. when someone wins, highlight the three squares that caused the win

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {   
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  createArray = () => {
    let myArray = [];
    for (let i = 0; i < 3; i++) {
      let children = [];
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare((i*3)+j));
      }
      myArray.push(<div key={i} className="board-row">{children}</div>);
    }
    return myArray;
  }

  render() {
    
    return (
      <div>
        {this.createArray()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      listIsCron: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    const location = formatLocation(i);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleList() {
    this.setState({
      listIsCron: !this.state.listIsCron,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + step.location:
        'Go to game start';
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    const oMoves = this.state.listIsCron ? moves : moves.reverse();

    const toggle =
      (<li>
        <button onClick={() => this.toggleList()}>Toggle list order</button>
      </li>);

    

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{oMoves}{toggle}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function formatLocation(i) {
  let loc = ' (';
  if ([0,3,6].indexOf(i) >= 0) {
    loc += '1, ';
  } else if ([1,4,7].indexOf(i) >= 0) {
    loc += '2, ';
  } else {
    loc += '3, ';
  }
  if ([0,1,2].indexOf(i) >= 0) {
    loc += '1)';
  } else if ([3,4,5].indexOf(i) >= 0) {
    loc += '2)';
  } else {
    loc += '3)';
  }
  return loc;
}