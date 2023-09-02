// Start page animation
const startEl = document.getElementById('start-page');
const startBtn = document.querySelector('.start-btn');

startBtn.addEventListener('click', () => {
  startEl.classList.add('hide');
  setTimeout(() => {
    startEl.style.display = 'none';
  }, 1000);
  buildDeck();
  shuffleDeck();
  startGame();
});
//--------------------------------

let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck = [];
let isAlive = false;

const endGame = document.getElementById('end-game');
const title = document.querySelector('#end-game h2');
const blackJackDiv = document.querySelector('#end-game div:first-of-type');
const emoji = document.querySelector('.emoji img');

// Display all the 52 cards of our deck
function buildDeck() {
  let values = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  let types = ['C', 'D', 'H', 'S'];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + '-' + types[i]);
    }
  }
}

// Shuffle our ordered deck
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    // The variable "temp" stores the original value of desk[i].
    // The value of deck[i] takes the value of deck[j](the random index generated).
    // Because deck[i] value was re-assigned, we use "temp" variable to set the original value to deck[j].
    // Basically deck[i] and deck[j] values were exchanged.
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function startGame() {
  isAlive = true;
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);

  let dealerCards = document.getElementById('dealer-cards');
  document.querySelector('.dealer h2').textContent = 'Dealer: ';

  // Dealer cards generator
  while (dealerSum < 14) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './poker-deck/' + card + '.svg';
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    dealerSum = reduceAce(dealerSum, dealerAceCount)[0];
    dealerCards.appendChild(cardImg);
  }

  // To show no more than 2 cards in the screen
  for (var i = 2; i < dealerCards.children.length; i++) {
    var hiddenCards = dealerCards.children[i];
    hiddenCards.style.display = 'none';
  }

  //   Your cards generator
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './poker-deck/' + card + '.svg';
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById('your-cards').appendChild(cardImg);
  }

  yourSum = reduceAce(yourSum, yourAceCount)[0];
  yourAceCount = reduceAce(yourSum, yourAceCount)[1];

  if (yourSum == 21 && dealerSum !== 21) {
    blackJack();
    showDealerCards();
    document.querySelector('.dealer h2').textContent = 'Dealer: ' + dealerSum;
  } else if (yourSum == 21 && dealerSum == 21) {
    tie();
    showDealerCards();
    document.querySelector('.dealer h2').textContent = 'Dealer: ' + dealerSum;
  }

  document.querySelector('.you h2').textContent = 'You: ' + yourSum;

  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stay').addEventListener('click', stay);
}

function hit() {
  if (isAlive) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = './poker-deck/' + card + '.svg';
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById('your-cards').appendChild(cardImg);
  }

  yourSum = reduceAce(yourSum, yourAceCount)[0];
  yourAceCount = reduceAce(yourSum, yourAceCount)[1];

  document.querySelector('.you h2').textContent = 'You: ' + yourSum;
  hitEvaluate();
}

function stay() {
  yourSum = reduceAce(yourSum, yourAceCount)[0];
  isAlive = false;

  showDealerCards();

  document.querySelector('.dealer h2').textContent = 'Dealer: ' + dealerSum;
  document.querySelector('.you h2').textContent = 'You: ' + yourSum;

  if (yourSum < dealerSum && dealerSum <= 21) {
    showResults();
  } else if (yourSum > dealerSum || dealerSum > 21) {
    win();
  } else if (yourSum == dealerSum) {
    tie();
  }
}

function getValue(card) {
  let data = card.split('-'); //Ex. 4-C -> ["4", "C"]
  let value = data[0];

  if (isNaN(value)) {
    if (value === 'A') {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  let regex = /A/;
  if (regex.test(card)) {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  if (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    yourAceCount -= 1;
  }
  return [playerSum, yourAceCount];
}

function hitEvaluate() {
  if (yourSum > 21) {
    isAlive = false;
    showDealerCards();
    document.querySelector('.dealer h2').textContent = 'Dealer: ' + dealerSum;
    showResults();
  } else if (yourSum == 21 && dealerSum == 21) {
    isAlive = false;
    tie();
    showDealerCards();
    document.querySelector('.dealer h2').textContent = 'Dealer: ' + dealerSum;
  } else if (yourSum == 21 && dealerSum !== 21) {
    isAlive = false;
    blackJack();
    showDealerCards();
    document.querySelector('.dealer h2').textContent = 'Dealer: ' + dealerSum;
  }
}

function showDealerCards() {
  let dealerCards = document.getElementById('dealer-cards');
  for (var i = 2; i < dealerCards.children.length; i++) {
    var hiddenCards = dealerCards.children[i];
    hiddenCards.style.display = 'inline-block';
  }

  document.querySelector('.hidden-card').src =
    './poker-deck/' + hidden + '.svg';
}

// Result message interface

function win() {
  title.textContent = 'You Win!!';
  emoji.src = './assets/win.svg';
  showResults();
}

function tie() {
  title.textContent = 'Tie!!';
  emoji.src = './assets/tie.svg';
  showResults();
}

function blackJack() {
  const image = document.createElement('img');
  blackJackDiv.classList.add('blackjack');

  image.src = './assets/blackjack.svg';
  blackJackDiv.appendChild(image);

  title.textContent = 'You Win!!';
  title.style.cssText =
    'font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 0;';

  emoji.src = './assets/win.svg';
  showResults();
}

// To create results transition
function showResults() {
  endGame.style.display = 'flex';
  setTimeout(() => {
    endGame.classList.add('results');
  }, 1);
}

// Restart game
const restartBtn = document.getElementById('restart-btn');

restartBtn.addEventListener('click', () => {
  endGame.style.display = 'none';
  setTimeout(() => {
    endGame.classList.remove('results');
  }, 1);

  title.textContent = 'You Lose!!';
  title.style.cssText = 'font-size: clamp(2rem, 10vw, 4rem)';
  blackJackDiv.innerHTML = '';
  blackJackDiv.classList.remove('blackjack');

  emoji.src = './assets/lose.svg';

  document.getElementById('dealer-cards').innerHTML =
    '<img class="hidden-card" src="./poker-deck/bgRed.svg" alt="Hidden card">';
  document.getElementById('your-cards').innerHTML = '';

  dealerSum = 0;
  dealerAceCount = 0;

  yourSum = 0;
  yourAceCount = 0;

  deck = [];
  hidden = '';
  isAlive = false;

  buildDeck();
  shuffleDeck();
  startGame();
});
