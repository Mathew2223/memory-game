import { cardsData } from "./cards.js";
import { socialLinks } from "./socialLinks.js";

// Data for the game
let firstCard = null;
let secondCard = null;
let isLocked = false;
let count = 0;
let moves = 0;

// Base functions for the game
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateCounter() {
  const counter = document.querySelector(".counter");
  counter.textContent = `Pairs: ${count} / 8 | Moves: ${moves}`;
}

function createLeaderboardTable() {
  const currentResults = JSON.parse(localStorage.getItem("leaderboard")) || [];

  if (currentResults.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No results yet";
    noResults.classList.add("no-results");
    return noResults;
  }

  const table = document.createElement("table");
  table.classList.add("leaderboard-table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.append(
    Object.assign(document.createElement("th"), { textContent: "Place" }),
    Object.assign(document.createElement("th"), { textContent: "Moves" }),
    Object.assign(document.createElement("th"), { textContent: "Date" }),
  );
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");

  currentResults.forEach((result, index) => {
    const row = document.createElement("tr");
    row.append(
      Object.assign(document.createElement("td"), { textContent: index + 1 }),
      Object.assign(document.createElement("td"), {
        textContent: result.moves,
      }),
      Object.assign(document.createElement("td"), {
        textContent: new Date(result.date).toLocaleDateString("ru-RU"),
      }),
    );
    tbody.appendChild(row);
  });

  table.append(thead, tbody);
  return table;
}

function showWinModal(finalMoves) {
  modal.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "🎉 You Won!";
  title.classList.add("modal-title");

  const message = document.createElement("p");
  message.textContent = `Great job! You completed the game in ${finalMoves} moves.`;
  message.style.fontSize = "18px";
  message.style.marginBottom = "20px";
  message.style.color = "#333";

  const leaderboardTitle = document.createElement("h3");
  leaderboardTitle.textContent = "Leaderboard";
  leaderboardTitle.style.marginBottom = "15px";
  leaderboardTitle.style.color = "#1a1a1a";

  const table = createLeaderboardTable();

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.justifyContent = "center";
  btnContainer.style.gap = "15px";
  btnContainer.style.marginTop = "25px";

  const newGameBtn = document.createElement("button");
  newGameBtn.textContent = "New Game";
  newGameBtn.classList.add("close-button");
  newGameBtn.style.backgroundColor = "#bfff00";
  newGameBtn.style.color = "#000";
  newGameBtn.addEventListener("click", () => {
    modal.close();
    initGame();
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList.add("close-button");
  closeBtn.addEventListener("click", () => modal.close());

  btnContainer.append(newGameBtn, closeBtn);
  modal.append(title, message, leaderboardTitle, table, btnContainer);
  modal.showModal();
}

function checkMatch() {
  if (firstCard.dataset.id === secondCard.dataset.id) {
    count++;
    updateCounter();
    firstCard = null;
    secondCard = null;

    if (count === 8) {
      const currentResults =
        JSON.parse(localStorage.getItem("leaderboard")) || [];
      currentResults.push({ moves: moves, date: new Date().toISOString() });

      currentResults.sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return new Date(a.date) - new Date(b.date);
      });

      localStorage.setItem(
        "leaderboard",
        JSON.stringify(currentResults.slice(0, 10)),
      );
      setTimeout(() => showWinModal(moves), 500);
    }
  } else {
    isLocked = true;
    setTimeout(() => {
      firstCard.classList.remove("is-flipped");
      secondCard.classList.remove("is-flipped");
      firstCard = null;
      secondCard = null;
      isLocked = false;
    }, 1200);
  }
}

function renderDashboard() {
  modal.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Dashboard";
  title.classList.add("modal-title");

  const table = createLeaderboardTable();

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList.add("close-button");
  closeBtn.addEventListener("click", () => modal.close());

  modal.append(title, table, closeBtn);
  modal.showModal();
}

// Create elements
const header = document.createElement("header");
const main = document.createElement("main");
const footer = document.createElement("footer");

// Add elements to the body
document.body.append(header, main, footer);

// Create buttons to the header
const newGameButton = document.createElement("button");
newGameButton.classList.add("close-button");
newGameButton.textContent = "New game";

const dashboardButton = document.createElement("button");
dashboardButton.classList.add("close-button");
dashboardButton.textContent = "Dashboard";

// Add buttons to the header
header.append(newGameButton, dashboardButton);

// Create counter
const counter = document.createElement("div");
counter.classList.add("counter");
main.appendChild(counter);

// Create elements to the main
const gameContainer = document.createElement("div");
gameContainer.classList.add("game-container");

const gameBoard = document.createElement("div");
gameBoard.classList.add("game-board");

// Add elements to the main and game container
gameContainer.appendChild(gameBoard);
main.appendChild(gameContainer);

// Create modal for dashboard and win screen
const modal = document.createElement("dialog");
modal.classList.add("modal");
document.body.append(modal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

dashboardButton.addEventListener("click", () => {
  renderDashboard();
});

// Function to init the game
function initGame() {
  firstCard = null;
  secondCard = null;
  isLocked = true;
  count = 0;
  moves = 0;
  updateCounter();
  gameBoard.replaceChildren();

  const fragment = document.createDocumentFragment();
  shuffle([...cardsData, ...cardsData]).forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;
    cardElement.dataset.index = index;

    const img = document.createElement("img");
    img.src = card.image;
    img.alt = card.description;
    img.classList.add("card-image");

    cardElement.appendChild(img);
    fragment.appendChild(cardElement);
  });

  gameBoard.appendChild(fragment);
  const allCards = document.querySelectorAll(".card");

  allCards.forEach((card) => card.classList.add("is-flipped"));

  setTimeout(() => {
    allCards.forEach((card) => card.classList.remove("is-flipped"));
    isLocked = false;
  }, 3000);

  allCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (isLocked || card.classList.contains("is-flipped")) return;

      card.classList.add("is-flipped");
      if (firstCard === null) {
        firstCard = card;
      } else {
        secondCard = card;
        moves++;
        updateCounter();
        checkMatch();
      }
    });
  });
}

initGame();

newGameButton.addEventListener("click", initGame);

// Create elements to the footer
const contactsList = document.createElement("ul");
contactsList.classList.add("contacts");

socialLinks.forEach((item) => {
  const listItem = document.createElement("li");
  listItem.classList.add("contacts-list-item");

  const link = document.createElement("a");
  link.href = item.href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const img = document.createElement("img");
  img.src = item.imgSrc;
  img.alt = item.alt;
  img.classList.add("contacts-list-item-image");

  link.appendChild(img);
  listItem.appendChild(link);
  contactsList.appendChild(listItem);
});

footer.appendChild(contactsList);
