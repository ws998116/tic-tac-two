import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function PlayAgain({ reset, winner }) {
  return (
    <View
      style={{
        height: 30,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {winner && (
        <Pressable onPress={reset} style={styles.playAgain}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </Pressable>
      )}
    </View>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <Pressable onPress={onSquareClick} style={styles.square}>
      <Text style={styles.xo}>{value}</Text>
    </Pressable>
  );
}

function Board({ xIsNext, squares, onPlay, playerX }) {
  function handleClick(i) {
    if ((xIsNext && playerX) || (!xIsNext && !playerX)) {
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares);
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    if ((playerX && winner == "X") || (!playerX && winner == "O")) {
      status = "You Won!";
    } else {
      status = "You Lost!";
    }
  } else {
    if ((playerX && xIsNext) || (!playerX && !xIsNext)) {
      status = "Your Turn";
    } else {
      status = " ";
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={styles.winnerText}>{status}</Text>
      <View style={styles.boardRow}>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </View>
      <View style={styles.boardRow}>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </View>
      <View style={styles.boardRow}>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </View>
    </View>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const winner = calculateWinner(currentSquares);

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          playerX={true}
        />
        <PlayAgain reset={() => setCurrentMove(0)} winner={winner} />
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          playerX={false}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "20%",
  },
  boardRow: {
    flexDirection: "row",
  },
  square: {
    backgroundColor: "#fff",
    borderWidth: 1,
    height: 70,
    width: 70,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  xo: {
    fontSize: 40,
    fontWeight: "bold",
  },
  winnerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  playAgain: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#67f",
    borderRadius: 5,
  },
  playAgainText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
