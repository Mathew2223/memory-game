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
  counter.textContent = `Pairs: ${count} / 8 | and your moves: ${moves}`;
}

function checkMatch() {
  if (firstCard.dataset.id === secondCard.dataset.id) {
    count++;
    updateCounter();
    firstCard = null;
    secondCard = null;
    if (count === 8) {
      alert("You win!");
      // здесь будет dialog
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

// Create elements
const header = document.createElement("header");
const main = document.createElement("main");
const footer = document.createElement("footer");
// Add elements to the body
document.body.append(header, main, footer);

// Create buttons to the header
const newGameButton = document.createElement("button");
newGameButton.textContent = "New game";

const dashboardButton = document.createElement("button");
dashboardButton.textContent = "Dashboard";

newGameButton.classList.add("header-button");
dashboardButton.classList.add("header-button");

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

// Function to init the game
function initGame() {
  firstCard = null;
  secondCard = null;
  isLocked = true;
  count = 0;
  moves = 0;
  updateCounter();
  gameBoard.innerHTML = "";

  const shuffleCards = shuffle([...cardsData, ...cardsData]);
  const fragment = document.createDocumentFragment();

  shuffleCards.forEach((card, index) => {
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

  allCards.forEach((card) => {
    card.classList.add("is-flipped");
  });

  setTimeout(() => {
    allCards.forEach((card) => {
      card.classList.remove("is-flipped");
    });
    isLocked = false;
  }, 3000);

  allCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (isLocked || card.classList.contains("is-flipped")) {
        return;
      }
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
  link.classList.add("contacts-list-item");
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
