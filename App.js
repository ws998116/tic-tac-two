import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

const { width, height } = Dimensions.get("screen");

// Theme Colors
const LIGHT = "#f3f2e5";
const DARK = "#242c40";

const bottomBorderIndecies = [0, 1, 2, 3, 4, 5];
const rightBorderIndecies = [0, 1, 3, 4, 6, 7];

// Individual Square Component
function Square({ value, onSquareClick, index }) {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeBorderStyle =
    colorScheme === "light" ? styles.lightBorder : styles.darkBorder;
  let squareBorderStyle = [styles.square];
  if (bottomBorderIndecies.includes(index)) {
    squareBorderStyle.push(styles.bottomBorder);
  }
  if (rightBorderIndecies.includes(index)) {
    squareBorderStyle.push(styles.rightBorder);
  }

  return (
    <Pressable
      onPress={onSquareClick}
      style={[...squareBorderStyle, themeBorderStyle]}
    >
      <Text style={[styles.xo, themeTextStyle]}>{value}</Text>
    </Pressable>
  );
}

// Board Component
function Board({ xIsNext, squares, onPlay, playerX, winner, reset }) {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;

  function handleClick(i) {
    if ((xIsNext && playerX) || (!xIsNext && !playerX)) {
      // Disable if there's a winner or if the square is already filled
      if (winner || squares[i]) {
        return;
      }
      // Update state
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares);
    }
  }

  let status;
  if (winner) {
    if (winner === "tie") {
      status = "Tie!";
    } else if ((playerX && winner == "X") || (!playerX && winner == "O")) {
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
    <View style={[styles.board, playerX && styles.flip]}>
      <View style={{ height: 50 }}>
        {winner && (
          <Pressable onPress={reset} style={styles.playAgain}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </Pressable>
        )}
      </View>
      <Text style={[styles.statusText, themeTextStyle]}>{status}</Text>
      <View>
        <View style={styles.boardRow}>
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} index={0} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} index={1}/>
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} index={2}/>
        </View>
        <View style={styles.boardRow}>
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} index={3}/>
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} index={4}/>
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} index={5}/>
        </View>
        <View style={styles.boardRow}>
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} index={6}/>
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} index={7}/>
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} index={8}/>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Manage game state
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const winner = calculateWinner(currentSquares);

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Board
        xIsNext={xIsNext}
        squares={currentSquares}
        onPlay={handlePlay}
        playerX={true}
        winner={winner}
        reset={() => setCurrentMove(0)}
      />
      <Board
        xIsNext={xIsNext}
        squares={currentSquares}
        onPlay={handlePlay}
        playerX={false}
        winner={winner}
        reset={() => setCurrentMove(0)}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function calculateWinner(squares) {
  // All possible win cases
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
    // See if any case contains the same piece (X or O)
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  let full = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      full = false;
    }
  }
  if (full) {
    return "tie";
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "20%",
  },
  lightContainer: {
    backgroundColor: LIGHT,
  },
  darkContainer: {
    backgroundColor: DARK,
  },
  lightThemeText: {
    color: DARK,
  },
  darkThemeText: {
    color: LIGHT,
  },
  lightBorder: {
    borderColor: DARK,
  },
  darkBorder: {
    borderColor: LIGHT,
  },
  board: {
    flex: 1,
    width: width,
    padding: 10,
    gap: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#aaa",
  },
  flip: {
    transform: [{ rotate: "180deg" }],
  },
  boardRow: {
    flexDirection: "row",
  },
  square: {
    height: width * 0.2,
    width: width * 0.2,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBorder: {
    borderBottomWidth: 2,
  },
  rightBorder: {
    borderRightWidth: 2,
  },
  xo: {
    fontSize: 40,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  playAgain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#67f",
    borderRadius: 5,
  },
  playAgainText: {
    fontSize: 24,
    fontWeight: "bold",
    color: LIGHT,
  },
});
