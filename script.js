import { cardsData } from "./cards.js";
import { socialLinks } from "./socialLinks.js";

// Data for the game
let firstCard = null;
let secondCard = null;
let isLocked = false;
let count = 0;

// Data for the game board
const gameCards = [...cardsData, ...cardsData];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const fragment = document.createDocumentFragment();

// Create elements
const header = document.createElement("header");
const main = document.createElement("main");
const footer = document.createElement("footer");

// Add elements to the body
document.body.append(header, main, footer);

// Create buttons to the header
const newGameButton = document.createElement("button");
newGameButton.textContent = "New game";
const DashboardButton = document.createElement("button");
DashboardButton.textContent = "Dashboard";

newGameButton.classList.add("header-button");
DashboardButton.classList.add("header-button");

// Add buttons to the header
header.append(newGameButton, DashboardButton);

// Create elements to the main
const gameContainer = document.createElement("div");
gameContainer.classList.add("game-container");
const gameBoard = document.createElement("div");
gameBoard.classList.add("game-board");

const shuffleCards = shuffle(gameCards);

// Create elements to the game board

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
// Add elements to the game board
gameBoard.appendChild(fragment);

// Add elements to the game container
gameContainer.appendChild(gameBoard);

// Add elements to the main
main.appendChild(gameContainer);

// Game logic
const allCards = document.querySelectorAll(".card");

allCards.forEach((card) => {
  card.classList.add("is-flipped");
});

isLocked = true;

setTimeout(() => {
  allCards.forEach((card) => {
    card.classList.remove("is-flipped");
  });
  isLocked = false;
}, 5000);

function checkMatch() {
  if (firstCard.dataset.id === secondCard.dataset.id) {
    count++;
    firstCard = null;
    secondCard = null;
    if (count == 8) {
      alert("You win!");
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
      checkMatch();
    }
  });
});

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
