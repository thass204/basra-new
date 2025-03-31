import { useEffect, useState } from "react";

// Helper to get random int
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Load sound from CDN
const playSound = (url) => {
  const audio = new Audio(url);
  audio.play();
};

export default function BasraGame() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHand, setBotHand] = useState([]);
  const [tableCards, setTableCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [burned7Diamonds, setBurned7Diamonds] = useState(false);
  const [basras, setBasras] = useState({ player: 0, bot: 0 });
  const [winningTotal, setWinningTotal] = useState(150);
  const [message, setMessage] = useState("Welcome to Basra!");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) startNewGame();
  }, [started]);

  function generateDeck() {
    const suits = ["♠", "♣", "♥", "♦"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    return suits.flatMap((suit) =>
      ranks.map((rank) => ({ rank, suit, code: `${rank}${suit}` }))
    );
  }

  function shuffle(array) {
    const deck = [...array];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = getRandomInt(i + 1);
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function cardImage(card) {
    return `https://deckofcardsapi.com/static/img/${convertToCode(card)}.png`;
  }

  function convertToCode(card) {
    const rankMap = { A: "A", J: "J", Q: "Q", K: "K" };
    const suitMap = { "♠": "S", "♣": "C", "♥": "H", "♦": "D" };
    const rank = rankMap[card.rank] || card.rank;
    return `${rank}${suitMap[card.suit]}`;
  }

  function startNewGame() {
    const newDeck = shuffle(generateDeck());
    const table = newDeck.splice(0, 4);
    const player = newDeck.splice(0, 4);
    const bot = newDeck.splice(0, 4);
    setDeck(newDeck);
    setTableCards(table);
    setPlayerHand(player);
    setBotHand(bot);
    setMessage("Game started. Your move.");
  }

  function isJack(card) {
    return card.rank === "J";
  }

  function is7D(card) {
    return card.rank === "7" && card.suit === "♦";
  }

  function playCard(card, isPlayer = true) {
    playSound("https://cdn.pixabay.com/audio/2022/03/15/audio_9e1aa4f213.mp3"); // peel sound

    let newTable = [...tableCards];
    let captured = [];
    let isBasra = false;

    if (is7D(card)) {
      setBurned7Diamonds(true);
      setMessage("7♦ has been burned!");
    }

    // Sum combo logic and captures go here...

    newTable.push(card);
    setTableCards(newTable);

    if (isPlayer) {
      setPlayerHand((prev) => prev.filter((c) => c !== card));
    } else {
      setBotHand((prev) => prev.filter((c) => c !== card));
    }

    setTimeout(() => {
      playSound("https://cdn.pixabay.com/audio/2023/04/06/audio_2e4e0e9c56.mp3"); // land sound
    }, 200);
  }

  return (
    <div style={{
      backgroundImage: "url('https://cdn.pixabay.com/photo/2018/04/17/18/36/table-3322830_1280.jpg')",
      backgroundSize: "cover",
      minHeight: "100vh",
      color: "white",
      padding: "1rem"
    }}>
      {!started ? (
        <div style={{ textAlign: "center" }}>
          <h1>🃏 Basra</h1>
          <label>Winning Score: {winningTotal}</label>
          <input
            type="range"
            min="150"
            max="500"
            step="10"
            value={winningTotal}
            onChange={(e) => setWinningTotal(parseInt(e.target.value))}
          />
          <br />
          <button onClick={() => setStarted(true)}>Start Game</button>
        </div>
      ) : (
        <>
          <p>{message}</p>
          <h2>Table</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {tableCards.map((card, idx) => (
              <img key={idx} src={cardImage(card)} alt={card.code} style={{ width: "80px" }} />
            ))}
          </div>

          <h2>Your Hand</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {playerHand.map((card, idx) => (
              <img
                key={idx}
                src={cardImage(card)}
                alt={card.code}
                style={{ width: "80px", cursor: "pointer" }}
                onClick={() => {
                  playCard(card, true);
                  setTimeout(() => {
                    if (botHand.length > 0) {
                      const botCard = botHand[getRandomInt(botHand.length)];
                      playCard(botCard, false);
                    }
                  }, 1000);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
