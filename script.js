const cardsOrd = [
  "image-1",
  "image-1",
  "image-2",
  "image-2",
  "image-3",
  "image-3",
  "image-4",
  "image-4",
  "image-5",
  "image-5",
  "image-6",
  "image-6",
  "image-7",
  "image-7",
  "image-8",
  "image-8",
  "image-9",
  "image-9",
  "image-10",
  "image-10",
  "image-11",
  "image-11",
  "image-12",
  "image-12",
  "image-13",
  "image-13",
  "image-14",
  "image-14",
  "image-15",
  "image-15",
  "image-16",
  "image-16",
  "image-17",
  "image-17",
  "image-18",
  "image-18",
];
const defaultNumberOfCards = 12;
const defaultCardSets = "all";
let numberOfCards = defaultNumberOfCards;
let cardSets = defaultCardSets;
let cards = [];

function renderBoard() {
  let dateCopyright = todayDate();
  document.querySelector(
    ".copyright"
  ).innerHTML = `Copyright &copy; ${dateCopyright} LivenLab`;

  setMusic();
  setCards();
}

function setCards() {
  let cardSet = cardsOrd;

  document.querySelector(".congrats-container").style.display = "none";
  setCardsNumber();
  setStartingCardSets();
  setScores();
  clearCards();

  if (cardSets == "arrietty") {
    cardSet = cardsOrd.slice(0, 8);
  } else if (cardSets == "kiki") {
    cardSet = cardsOrd.slice(9, 17);
  }

  console.log(cardSets);
  console.log(cardSet);

  let cardsRandom = shuffle(cardSet, numberOfCards);

  for (let i = 0; i < cardsRandom.length; i++) {
    let div = document.createElement("div");
    div.className = "card";
    document.querySelector(".cards-container").appendChild(div);
  }

  cards = document.querySelectorAll(".card");

  cards.forEach((elem) => {
    elem.classList.add(cardsRandom.pop());
    elem.addEventListener("click", onCardClick);
  });
}

function clearCards() {
  const container = document.querySelector(".cards-container");
  while (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

function setScores() {
  let numBestResult = localStorage.getItem(`bestscore${numberOfCards}`);
  if (numBestResult == null) {
    localStorage.setItem(`bestscore${numberOfCards}`, 0);
  }
  localStorage.setItem("lastscore", 0);

  document.querySelector("#score-best").textContent = `${localStorage.getItem(
    `bestscore${numberOfCards}`
  )}`;

  document.querySelector("#score-last").textContent = `${localStorage.getItem(
    "lastscore"
  )} `;
}

function setCardsNumber() {
  if (localStorage.getItem("cardsnumber") == null) {
    localStorage.setItem("cardsnumber", defaultNumberOfCards);
  } else {
    document.querySelector("#number-cards").value =
      localStorage.getItem("cardsnumber");
  }
  numberOfCards = localStorage.getItem("cardsnumber");

  document.querySelector(
    "#cards-number"
  ).textContent = ` ${numberOfCards} `;
}

function setStartingCardSets() {
  if (localStorage.getItem("cardsets") == null) {
    localStorage.setItem("cardsets", defaultCardSets);
  } else {
    document.querySelector("#card-sets").value =
      localStorage.getItem("cardsets");
  }
  cardSets = localStorage.getItem("cardsets");
}

// generate a random number
function calcRandomNumber(newLength) {
  return Math.floor(Math.random() * newLength);
}

// adjust array size
function arraySize(array, newLength) {
  let newArray = array.slice();
  let originalArrayLength = array.length;
  while (originalArrayLength > newLength) {
    newArray.pop();
    originalArrayLength--;
  }
  return newArray;
}

// randomize an array
function shuffle(array, newLength) {
  let currentIndex = newLength - 1;
  let adjustedArray = arraySize(array, newLength);
  while (currentIndex != 0) {
    let randomIndex = calcRandomNumber(newLength);
    [adjustedArray[currentIndex], adjustedArray[randomIndex]] = [
      adjustedArray[randomIndex],
      adjustedArray[currentIndex],
    ];
    currentIndex--;
  }
  return adjustedArray;
}

function onCardClick(e) {
  let el = e.target;
  let maxOpenCards =
    document.querySelectorAll(".flipped-up").length -
    document.querySelectorAll(".done").length;
  localStorage.setItem("lastscore", +localStorage.getItem("lastscore") + 1);
  if (maxOpenCards < 2) {
    flipCard(el);
    document.querySelector(
      "#score-last"
    ).textContent = ` ${localStorage.getItem("lastscore")} `;
  }
}

function flipCard(el) {
  let card = el.getAttribute("class");
  if (!card.split(" ").includes("done")) {
    if (card.split(" ").includes("flipped-up")) {
      el.classList.remove("flipped-up");
    } else {
      if (document.querySelectorAll(".flipped-up").length) {
        isMatchingPair(card, el);
      } else {
        el.classList.add("flipped-up");
      }
    }
  }
}

// check if the pair of cards are match:
function isMatchingPair(card, el) {
  const waitingTime = 1000;
  let cardImg = card
    .replace("card", "")
    .split(" ")
    .filter((n) => n);
  document.querySelectorAll(".flipped-up").forEach(function (elFlipped) {
    if (
      elFlipped.classList.value.split(" ").includes(cardImg[0]) &&
      !elFlipped.classList.value.split(" ").includes("done")
    ) {
      el.classList.add("flipped-up");
      elFlipped.classList.add("done");
      el.classList.add("done");
    } else {
      el.classList.add("flipped-up");
    }
    if (!elFlipped.classList.value.split(" ").includes("done")) {
      setTimeout(() => elFlipped.classList.remove("flipped-up"), waitingTime);
      setTimeout(() => el.classList.remove("flipped-up"), waitingTime);
    }
  });
  if (
    document.querySelectorAll(".done").length >
      localStorage.getItem("cardsnumber") - 1 &&
    document.querySelectorAll(".flipped-up").length >
      localStorage.getItem("cardsnumber") - 1
  ) {
    isGameOver();
  }
}

function loopMusic() {
  if (document.querySelector("#music-control").getAttribute("loop") == null) {
    document.querySelector("#music-control").setAttribute("loop", "loop");
    document.querySelector(".fa-rotate").setAttribute("title", "Loop On");
    document.querySelector(".loopLabel").textContent = "On";
  } else {
    document.querySelector("#music-control").removeAttribute("loop");
    document.querySelector(".fa-rotate").setAttribute("title", "Loop Off");
    document.querySelector(".loopLabel").textContent = "Off";
  }
}

function isGameOver() {
  let currentNum = document.querySelector("#cards-number").textContent.trim();
  if (
    +localStorage.getItem(`bestscore${currentNum}`) >
      +localStorage.getItem("lastscore") ||
    +localStorage.getItem(`bestscore${currentNum}`) == 0
  ) {
    localStorage.setItem(
      `bestscore${currentNum}`,
      localStorage.getItem("lastscore")
    );
  }
  document.querySelector("#score-best").textContent = localStorage.getItem(
    `bestscore${currentNum}`
  );
  setTimeout(() => {
    document.querySelector(".congrats-container").style.display = "block";
  }, 500);
}

function setNumberOfCards() {
  localStorage.setItem(
    "cardsnumber",
    document.querySelector("#number-cards").value
  );
  localStorage.getItem("cardsnumber");
  restart();
}

function setCardSets() {
  localStorage.setItem(
    "cardsets",
    document.querySelector("#card-sets").value
  );
  localStorage.getItem("card-sets");
  restart();
}

function playAll() {
  let i = 1;
  let nextSong = "";
  const audioPlayer = document.querySelector("#music-control");
  if (
    localStorage.getItem("music") != "none" &&
    localStorage.getItem("music") != "Play All" &&
    localStorage.getItem("music") != null
  ) {
    audioPlayer.src = `./assets/music/${localStorage.getItem("music")}.mp3`;
  } else if (localStorage.getItem("trackForPlayAll") != null) {
    audioPlayer.src = `./assets/music/${localStorage.getItem(
      "trackForPlayAll"
    )}.mp3`;
  } else {
    console.log("last");
    localStorage.setItem("trackForPlayAll", i);
    audioPlayer.src = `./assets/music/${localStorage.getItem(
      "trackForPlayAll"
    )}.mp3`;
  }

  document.querySelector("#music-control").addEventListener(
    "ended",
    function () {
      i += 1;
      nextSong = `./assets/music/${i}.mp3`;
      localStorage.setItem("trackForPlayAll", i);
      audioPlayer.src = nextSong;
      audioPlayer.load();
      audioPlayer.play();
      if (i == 24) {
        i = 0;
      }
    },
    false
  );
}
function setMusic() {
  let musicControl = document.querySelector("#music-control");
  let playerReset = document.querySelector("#audio-reset");
  localStorage.setItem("music", document.querySelector("#music").value);
  if (
    localStorage.getItem("music") != "none" &&
    localStorage.getItem("music") != "Play All"
  ) {
    musicControl.removeAttribute("hidden");
    playerReset.removeAttribute("hidden");
    musicControl.setAttribute(
      "src",
      `./assets/music/${localStorage.getItem("music")}.mp3`
    );
  } else if (
    localStorage.getItem("music") == "none" &&
    !musicControl.getAttribute("hidden")
  ) {
    playerReset.setAttribute("hidden", "hidden");
    musicControl.setAttribute("hidden", "hidden");
    musicControl.setAttribute("src", "");
  } else if (localStorage.getItem("music") == "Play All") {
    playerReset.removeAttribute("hidden");
    musicControl.removeAttribute("hidden");
    playAll();
  }
  if (document.querySelector("#music").value == "none") {
    document.querySelector("#music").style.width = "80px";
  } else {
    document.querySelector("#music").style.width = "200px";
  }
}

function resetPlayer() {
  let musicControl = document.querySelector("#music-control");
  let playerReset = document.querySelector("#audio-reset");
  playerReset.setAttribute("hidden", "hidden");
  musicControl.setAttribute("hidden", "hidden");
  musicControl.setAttribute("src", "");
  localStorage.setItem("music", "none");
  document.querySelector("#music").value = localStorage.getItem("music");
  localStorage.removeItem("music");
  localStorage.removeItem("trackForPlayAll");
}

function resetScores() {
  let currentNum = document.querySelector("#cards-number").textContent.trim();
  localStorage.setItem(`bestscore${currentNum}`, 0);
  document.querySelector("#score-best").textContent = `${localStorage.getItem(
    `bestscore${currentNum}`
  )}`;
}

// copyright
function todayDate() {
  let date = new Date().getFullYear();
  return date;
}

function restart() {
  setCards();
}

// start the game on page load
(function () {
  console.clear();
  renderBoard();
})();
