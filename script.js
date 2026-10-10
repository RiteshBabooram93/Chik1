
"use strict";

// ========================================
// CHIKIPETS - COMPLETE GAME
// 12 CHIKIPETS + CHICKEN SOLDIER KING
// ========================================

const board = document.getElementById("board");
board.innerHTML = "";

let selectedPiece = null;
let currentTurn = "red";
let continuingCapture = false;
let gameOver = false;
let celebrating = false;
let animatingMove = false;

const COMPUTER_DELAY = 1100;
const COMPUTER_CAPTURE_DELAY = 700;
const CAPTURE_TIME = 850;

// ========================================
// CHARACTER IMAGES
// ========================================

const IMAGES = {
  chiki: "Images/chiki.png",
  chikiHop: "Images/chiki-hop.png",
  chikiKingSad: "Images/chiki-king-sad.png",
  chikiKingSadHop: "Images/chiki-king-sad-hop.png",
  chikiCaptured: "Images/chiki-captured.png",

  superhero: "Images/superhero.png",
  superheroFlying: "Images/superhero-flying.png",
  superheroKingSad: "Images/superhero-king-sad.png",
  superheroKingSadFlying: "Images/superhero-king-sad-flying.png",

  chubby: "Images/chubby.png",
  chubbyWalk: "Images/chubby-walk.png",
  chubbyKingHappy: "Images/chubby-king-happy.png",
  chubbyKingSad: "Images/chubby-king-sad.png",
  chubbyKingSadWalk: "Images/chubby-king-sad-walk.png",

  tough: "Images/tough.png",
  toughWalk: "Images/tough-walk.png",
  toughKingHappy: "Images/tough-king-happy.png",
  toughKingSad: "Images/tough-king-sad.png",
  toughKingSadWalk: "Images/tough-king-sad-walk.png",

  speedy: "Images/speedy.png",
  speedyKingHappy: "Images/speedy-king-happy.png",
  speedyKingSad: "Images/speedy-king-sad.png",

  mystique: "Images/mystique.png",
  mystiqueQueenHappy: "Images/mystique-queen-happy.png",
  mystiqueQueenSad: "Images/mystique-queen-sad.png",

  nerdy: "Images/nerdy.png",
  nerdyWalk: "Images/nerdy-walk.png",
  nerdyKingHappy: "Images/nerdy-king-happy.png",
  nerdyKingSad: "Images/nerdy-king-sad.png",
  nerdyKingSadWalk: "Images/nerdy-king-sad-walk.png",

  cool: "Images/cool.png",
  coolWalk: "Images/cool-walk.png",
  coolKingHappy: "Images/cool-king-happy.png",
  coolKingSad: "Images/cool-king-sad.png",
  coolKingSadWalk: "Images/cool-king-sad-walk.png",

  sleepy: "Images/sleepy.png",
  sleepyKing: "Images/sleepy-king.png",

  sassy: "Images/sassy.png",
  sassyQueenHappy: "Images/sassy-queen-happy.png",
  sassyQueenSad: "Images/sassy-queen-sad.png",

  invisibleChick: "Images/invisible-chick.png",
  invisibleChickWalk: "Images/invisible-chick-walk.png",
  invisibleChickKingHappy: "Images/invisible-chick-king-happy.png",
  invisibleChickKingSad: "Images/invisible-chick-king-sad.png",
  invisibleChickKingSadWalk: "Images/invisible-chick-king-sad-walk.png",

  sage: "Images/sage.png",
  sageQueen: "Images/sage-queen.png",

  soldier: "Images/chicken-soldier.png",
  soldierPush: "Images/chicken-soldier-push.png",

  // NEW: THE CROWNED CHICKEN SOLDIER
  soldierKing: "Images/chicken-soldier-king.png",

  ordinary: "Images/chikipets-hero.png"
};

// ========================================
// CHECK OPTIONAL ATTACK IMAGE
// ========================================

let soldierPushReady = false;

const soldierAttackImage = new Image();

soldierAttackImage.onload = () => {
  soldierPushReady = soldierAttackImage.naturalWidth > 0;
};

soldierAttackImage.onerror = () => {
  soldierPushReady = false;
};

soldierAttackImage.src = IMAGES.soldierPush;

function getSoldierMovementImage(piece, isCapture) {
  // Crowned soldiers ALWAYS keep their crown.
  if (isKing(piece)) {
    return IMAGES.soldierKing;
  }

  if (isCapture && soldierPushReady) {
    return IMAGES.soldierPush;
  }

  return IMAGES.soldier;
}

// ========================================
// MOVEMENT SPEEDS
// ========================================

const MOVE_TIMES = {
  speedy: 300,
  chiki: 650,
  tough: 650,
  mystique: 650,
  nerdy: 650,
  cool: 650,
  sassy: 650,
  invisibleChick: 650,
  sage: 650,
  superhero: 850,
  soldier: 1100,
  ordinary: 500,
  chubby: 1300,
  sleepy: 1950
};

// ========================================
// ADVENTURE SETTINGS
// ========================================

const CHIKI_ADVENTURE = {
  sizeMultiplier: 1.45,
  maxWidth: 86,
  minWidth: 52,
  heightMultiplier: 1.3,
  platformMultiplier: 1.05,
  platformMinWidth: 38,
  anchorY: 0.82,
  jumpHeight: 24
};

const SOLDIER_ADVENTURE = {
  sizeMultiplier: 1.55,
  maxWidth: 92,
  minWidth: 45,
  heightMultiplier: 1.25,
  platformMultiplier: 1.08,
  platformMinWidth: 30,
  anchorY: 0.82,
  jumpHeight: 0
};

const SUPERHERO_ADVENTURE = {
  sizeMultiplier: 1.35,
  maxWidth: 80,
  minWidth: 48,
  heightMultiplier: 1.3,
  platformMultiplier: 1,
  platformMinWidth: 36,
  anchorY: 0.82,
  jumpHeight: 65
};

const CHUBBY_ADVENTURE = {
  sizeMultiplier: 1.35,
  maxWidth: 80,
  minWidth: 48,
  heightMultiplier: 1.2,
  platformMultiplier: 1.05,
  platformMinWidth: 38,
  anchorY: 0.82,
  jumpHeight: 5
};

const ADVENTURE_SETTINGS = {
  chiki: CHIKI_ADVENTURE,
  soldier: SOLDIER_ADVENTURE,
  superhero: SUPERHERO_ADVENTURE,
  chubby: CHUBBY_ADVENTURE,
  tough: { ...CHUBBY_ADVENTURE, jumpHeight: 0 },
  speedy: { ...CHUBBY_ADVENTURE, jumpHeight: 0 },
  mystique: { ...CHUBBY_ADVENTURE, jumpHeight: 12 },
  nerdy: { ...CHUBBY_ADVENTURE, jumpHeight: 8 },
  cool: { ...CHUBBY_ADVENTURE, jumpHeight: 4 },
  sassy: { ...CHUBBY_ADVENTURE, jumpHeight: 0 },
  sleepy: { ...CHUBBY_ADVENTURE, jumpHeight: 0 },
  invisibleChick: { ...CHUBBY_ADVENTURE, jumpHeight: 0 },
  sage: { ...CHUBBY_ADVENTURE, jumpHeight: 0 }
};

Object.values(IMAGES).forEach(src => {
  const image = new Image();
  image.src = src;
});

// ========================================
// PROMOTION CELEBRATION
// ========================================

const celebration =
  document.getElementById("king-celebration") ||
  document.createElement("div");

celebration.id = "king-celebration";

celebration.innerHTML = `
  <div class="king-character">
    <img src="${IMAGES.chiki}" alt="Promoted character">
  </div>
  <div class="king-title">KING!</div>
  <div class="king-subtitle"></div>
`;

if (!celebration.parentElement) {
  document.body.appendChild(celebration);
}

// ========================================
// ANIMATION LAYERS
// ========================================

const animationLayer =
  document.getElementById("chikipets-animation-layer") ||
  document.createElement("div");

animationLayer.id = "chikipets-animation-layer";

if (!animationLayer.parentElement) {
  document.body.appendChild(animationLayer);
}

const adventureLayer =
  document.getElementById("chikipets-adventure-layer") ||
  document.createElement("div");

adventureLayer.id = "chikipets-adventure-layer";

if (!adventureLayer.parentElement) {
  document.body.appendChild(adventureLayer);
}

const adventureDisplays = new Map();

// ========================================
// ALL 12 STARTING CHIKIPETS
// ========================================

const STARTING_CHARACTERS = {
  "5,0": "speedy",
  "5,2": "chubby",
  "5,4": "tough",
  "5,6": "mystique",

  "6,1": "sassy",
  "6,3": "nerdy",
  "6,5": "cool",
  "6,7": "invisibleChick",

  "7,0": "sleepy",
  "7,2": "superhero",
  "7,4": "chiki",
  "7,6": "sage"
};

// ========================================
// BUILD BOARD
// ========================================

for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement("div");

    square.classList.add(
      "square",
      (row + col) % 2 === 0 ? "light" : "dark"
    );

    square.dataset.row = row;
    square.dataset.col = col;

    if ((row + col) % 2 === 1) {
      if (row < 3) {
        createPiece(square, "black", "soldier");
      }

      if (row > 4) {
        const character =
          STARTING_CHARACTERS[`${row},${col}`] ||
          "ordinary";

        createPiece(square, "red", character);
      }
    }

    square.addEventListener("click", () => {
      handleSquareClick(square);
    });

    board.appendChild(square);
  }
}

// ========================================
// GENERAL HELPERS
// ========================================

function createPiece(square, color, character) {
  const piece = document.createElement("div");

  piece.classList.add(
    "piece",
    color + "-piece",
    character
  );

  piece.dataset.character = character;

  piece.title =
    character === "invisibleChick"
      ? "Invisible Chick"
      : character === "soldier"
        ? "Chicken Soldier"
        : character;

  square.appendChild(piece);
}

function getSquare(row, col) {
  if (row < 0 || row > 7 || col < 0 || col > 7) {
    return null;
  }

  return board.querySelector(
    `[data-row="${row}"][data-col="${col}"]`
  );
}

function getPieceColor(piece) {
  return piece.classList.contains("red-piece")
    ? "red"
    : "black";
}

function getCharacter(piece) {
  return piece.dataset.character || "ordinary";
}

function isKing(piece) {
  return piece.classList.contains("king");
}

function randomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// CHARACTER POSES
// ========================================

function getCharacterImage(piece, pose = "standing") {
  const character = getCharacter(piece);
  const king = isKing(piece);
  const moving = pose === "moving";

  switch (character) {
    case "sage":
      return king ? IMAGES.sageQueen : IMAGES.sage;

    case "chiki":
      if (pose === "captured") return IMAGES.chikiCaptured;
      return king
        ? (moving ? IMAGES.chikiKingSadHop : IMAGES.chikiKingSad)
        : (moving ? IMAGES.chikiHop : IMAGES.chiki);

    case "superhero":
      if (king) {
        return moving || pose === "captured"
          ? IMAGES.superheroKingSadFlying
          : IMAGES.superheroKingSad;
      }

      return moving || pose === "captured"
        ? IMAGES.superheroFlying
        : IMAGES.superhero;

    case "chubby":
      return king
        ? (moving ? IMAGES.chubbyKingSadWalk : IMAGES.chubbyKingSad)
        : (moving || pose === "captured"
            ? IMAGES.chubbyWalk
            : IMAGES.chubby);

    case "tough":
      return king
        ? (moving ? IMAGES.toughKingSadWalk : IMAGES.toughKingSad)
        : (moving ? IMAGES.toughWalk : IMAGES.tough);

    case "speedy":
      return king ? IMAGES.speedyKingSad : IMAGES.speedy;

    case "mystique":
      return king ? IMAGES.mystiqueQueenSad : IMAGES.mystique;

    case "nerdy":
      return king
        ? (moving ? IMAGES.nerdyKingSadWalk : IMAGES.nerdyKingSad)
        : (moving ? IMAGES.nerdyWalk : IMAGES.nerdy);

    case "cool":
      return king
        ? (moving ? IMAGES.coolKingSadWalk : IMAGES.coolKingSad)
        : (moving ? IMAGES.coolWalk : IMAGES.cool);

    case "sleepy":
      return king ? IMAGES.sleepyKing : IMAGES.sleepy;

    case "sassy":
      return king ? IMAGES.sassyQueenSad : IMAGES.sassy;

    case "invisibleChick":
      return king
        ? (moving
            ? IMAGES.invisibleChickKingSadWalk
            : IMAGES.invisibleChickKingSad)
        : (moving
            ? IMAGES.invisibleChickWalk
            : IMAGES.invisibleChick);

    case "soldier":
      // NEW: Crowned soldier remains crowned.
      if (king) return IMAGES.soldierKing;

      return pose === "capturing"
        ? getSoldierMovementImage(piece, true)
        : IMAGES.soldier;

    default:
      return IMAGES.ordinary;
  }
}

// ========================================
// ADVENTURE DISPLAY HELPERS
// ========================================

function getAdventureSettings(piece) {
  return ADVENTURE_SETTINGS[getCharacter(piece)] ||
    CHIKI_ADVENTURE;
}

function usesAdventureDisplay(piece) {
  return board.classList.contains("adventure-view") &&
    Object.prototype.hasOwnProperty.call(
      ADVENTURE_SETTINGS,
      getCharacter(piece)
    );
}

function getSquareAnchor(square, settings) {
  const rect = square.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height * settings.anchorY
  };
}

function getAdventureDimensions(piece) {
  const rect = piece.parentElement.getBoundingClientRect();
  const settings = getAdventureSettings(piece);

  const width = Math.max(
    settings.minWidth,
    Math.min(
      settings.maxWidth,
      rect.width * settings.sizeMultiplier
    )
  );

  const platformWidth = Math.max(
    settings.platformMinWidth,
    rect.width * settings.platformMultiplier
  );

  return {
    width,
    height: width * settings.heightMultiplier,
    platformWidth,
    platformHeight: Math.max(10, platformWidth * 0.28)
  };
}

function createAdventureDisplay(piece) {
  const display = document.createElement("div");

  display.className =
    "adventure-character adventure-" + getCharacter(piece);

  const platform = document.createElement("div");
  platform.className = "adventure-platform";

  const sprite = document.createElement("div");
  sprite.className = "adventure-sprite";

  display.appendChild(platform);
  display.appendChild(sprite);

  display.addEventListener("click", event => {
    event.stopPropagation();

    if (animatingMove || celebrating || gameOver) return;

    const square = piece.parentElement;

    if (square?.classList.contains("square")) {
      handleSquareClick(square);
    }
  });

  adventureLayer.appendChild(display);
  adventureDisplays.set(piece, display);

  return display;
}

function updateAdventureDisplays() {
  const active = new Set();

  board.querySelectorAll(".piece").forEach(piece => {
    if (!usesAdventureDisplay(piece)) return;

    active.add(piece);

    let display = adventureDisplays.get(piece);

    if (!display) {
      display = createAdventureDisplay(piece);
    }

    // Keep characters visible during movement.
    if (piece.dataset.animating === "true") {
      display.style.display = "block";
      return;
    }

    const settings = getAdventureSettings(piece);
    const dimensions = getAdventureDimensions(piece);
    const anchor = getSquareAnchor(
      piece.parentElement,
      settings
    );

    display.style.left = anchor.x + "px";
    display.style.top = anchor.y + "px";

    display.style.zIndex = String(
      1000 + Math.round(anchor.y)
    );

    const platform =
      display.querySelector(".adventure-platform");

    const sprite =
      display.querySelector(".adventure-sprite");

    platform.style.width =
      dimensions.platformWidth + "px";

    platform.style.height =
      dimensions.platformHeight + "px";

    sprite.style.width = dimensions.width + "px";
    sprite.style.height = dimensions.height + "px";

    sprite.style.backgroundImage =
      `url("${getCharacterImage(piece)}")`;

    display.style.display = "block";
    display.style.visibility = "visible";
  });

  for (const [piece, display] of adventureDisplays) {
    if (!active.has(piece)) {
      display.remove();
      adventureDisplays.delete(piece);
    }
  }
}

window.addEventListener("resize", updateAdventureDisplays);

window.addEventListener(
  "scroll",
  updateAdventureDisplays,
  { passive: true }
);

// ========================================
// CHECKERS MOVEMENT RULES
// ========================================

function getMovesForPiece(
  piece,
  captureOnly = false,
  allowBackwardCapture = false
) {
  const square = piece.parentElement;
  const row = Number(square.dataset.row);
  const col = Number(square.dataset.col);
  const color = getPieceColor(piece);
  const forward = color === "red" ? -1 : 1;
  const moves = [];

  if (isKing(piece)) {
    for (const dr of [-1, 1]) {
      for (const dc of [-1, 1]) {
        let distance = 1;

        while (true) {
          const target = getSquare(
            row + dr * distance,
            col + dc * distance
          );

          if (!target) break;

          const occupant = target.querySelector(".piece");

          if (!occupant) {
            if (!captureOnly) {
              moves.push({
                piece,
                target,
                captured: null
              });
            }

            distance++;
            continue;
          }

          if (getPieceColor(occupant) === color) {
            break;
          }

          const landing = getSquare(
            row + dr * (distance + 1),
            col + dc * (distance + 1)
          );

          if (
            landing &&
            !landing.querySelector(".piece")
          ) {
            moves.push({
              piece,
              target: landing,
              captured: occupant
            });
          }

          break;
        }
      }
    }

    return moves;
  }

  if (!captureOnly) {
    for (const dc of [-1, 1]) {
      const target = getSquare(
        row + forward,
        col + dc
      );

      if (
        target &&
        !target.querySelector(".piece")
      ) {
        moves.push({
          piece,
          target,
          captured: null
        });
      }
    }
  }

  const directions = allowBackwardCapture
    ? [-1, 1]
    : [forward];

  for (const dr of directions) {
    for (const dc of [-1, 1]) {
      const middle = getSquare(
        row + dr,
        col + dc
      );

      const landing = getSquare(
        row + dr * 2,
        col + dc * 2
      );

      if (!middle || !landing) continue;

      const opponent = middle.querySelector(".piece");

      if (
        opponent &&
        getPieceColor(opponent) !== color &&
        !landing.querySelector(".piece")
      ) {
        moves.push({
          piece,
          target: landing,
          captured: opponent
        });
      }
    }
  }

  return moves;
}

function getAllMoves(color) {
  let moves = [];

  board.querySelectorAll(
    "." + color + "-piece"
  ).forEach(piece => {
    moves.push(...getMovesForPiece(piece));
  });

  const captures = moves.filter(
    move => move.captured !== null
  );

  return captures.length > 0 ? captures : moves;
}

// ========================================
// PLAYER MOVE HIGHLIGHTS
// ========================================

function updateHighlights() {
  board.querySelectorAll(".piece").forEach(piece => {
    piece.classList.remove(
      "available",
      "unavailable",
      "selected"
    );
  });

  board.querySelectorAll(".square").forEach(square => {
    square.classList.remove("possible-move");
  });

  if (
    gameOver ||
    celebrating ||
    animatingMove ||
    currentTurn !== "red"
  ) return;

  const moves =
    continuingCapture && selectedPiece
      ? getMovesForPiece(selectedPiece, true, true)
      : getAllMoves("red");

  const available = new Set(
    moves.map(move => move.piece)
  );

  board.querySelectorAll(".red-piece").forEach(piece => {
    piece.classList.add(
      available.has(piece)
        ? "available"
        : "unavailable"
    );
  });

  if (selectedPiece) {
    selectedPiece.classList.add("selected");

    moves
      .filter(move => move.piece === selectedPiece)
      .forEach(move => {
        move.target.classList.add("possible-move");
      });
  }
}

// ========================================
// KING PROMOTION
// ========================================

function promoteIfNeeded(piece) {
  if (isKing(piece)) return false;

  const row = Number(piece.parentElement.dataset.row);
  const color = getPieceColor(piece);

  if (
    (color === "red" && row === 0) ||
    (color === "black" && row === 7)
  ) {
    piece.classList.add("king");

    // NEW: Name crowned gladiators.
    if (getCharacter(piece) === "soldier") {
      piece.title = "Chicken Soldier King";
    }

    return true;
  }

  return false;
}

function showKingCelebration(piece, callback) {
  celebrating = true;

  const character = getCharacter(piece);
  const isQueen = ["mystique", "sassy", "sage"]
    .includes(character);

  celebration.querySelector(".king-title").textContent =
    isQueen ? "QUEEN!" : "KING!";

  // Crowned soldier image appears here too.
  celebration.querySelector(".king-character img").src =
    getCharacterImage(piece);

  let message;

  if (getPieceColor(piece) === "black") {
    message =
      "The Chicken Soldier has become King!";
  } else if (character === "sage") {
    message =
      "Sage is Queen... and remains perfectly peaceful!";
  } else if (character === "sleepy") {
    message =
      "Sleepy became King... and slept through it!";
  } else if (character === "invisibleChick") {
    message =
      "Invisible Chick became King! Now everyone can see him!";
  } else {
    message = isQueen
      ? "Oh no! A Chikipet has become Queen!"
      : "Oh no! A Chikipet has become King!";
  }

  celebration.querySelector(".king-subtitle").textContent =
    message;

  celebration.classList.add("show");

  setTimeout(() => {
    celebration.classList.remove("show");
    celebrating = false;
    updateAdventureDisplays();
    callback();
  }, 3000);
}

// ========================================
// MOVING SPRITE
// ========================================

function createAnimationSprite(piece, imageSrc) {
  const display = adventureDisplays.get(piece);

  const rect =
    usesAdventureDisplay(piece) && display
      ? display.querySelector(
          ".adventure-sprite"
        ).getBoundingClientRect()
      : piece.getBoundingClientRect();

  const sprite = document.createElement("div");

  sprite.className = "chikipets-sprite";

  sprite.style.left = rect.left + "px";
  sprite.style.top = rect.top + "px";
  sprite.style.width = rect.width + "px";
  sprite.style.height = rect.height + "px";
  sprite.style.backgroundImage = `url("${imageSrc}")`;

  animationLayer.appendChild(sprite);

  return sprite;
}

// ========================================
// ADVENTURE MOVEMENT
// ========================================

function animateAdventureMove(piece, target, isCapture) {
  const display = adventureDisplays.get(piece);

  if (!display) {
    return animateStandardMove(piece, target, isCapture);
  }

  const settings = getAdventureSettings(piece);

  const from = getSquareAnchor(
    piece.parentElement,
    settings
  );

  const to = getSquareAnchor(target, settings);

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const character = getCharacter(piece);
  const duration = MOVE_TIMES[character] || 500;

  piece.dataset.animating = "true";

  display.style.display = "block";
  display.style.visibility = "visible";
  display.style.opacity = "1";
  display.style.zIndex = "3000";

  const sprite =
    display.querySelector(".adventure-sprite");

  const movingImage =
    character === "soldier"
      ? getSoldierMovementImage(piece, isCapture)
      : getCharacterImage(piece, "moving");

  sprite.style.backgroundImage =
    `url("${movingImage}")`;

  sprite.style.visibility = "visible";
  sprite.style.opacity = "1";

  const jumpHeight = settings.jumpHeight || 0;

  const animation = display.animate(
    [
      {
        transform: "translate(0px, 0px)",
        offset: 0
      },
      {
        transform:
          `translate(${dx / 2}px, ${dy / 2 - jumpHeight}px)`,
        offset: 0.5
      },
      {
        transform: `translate(${dx}px, ${dy}px)`,
        offset: 1
      }
    ],
    {
      duration,
      easing: [
        "sleepy",
        "speedy",
        "sassy",
        "sage",
        "invisibleChick",
        "soldier"
      ].includes(character)
        ? "linear"
        : "ease-in-out",
      fill: "forwards"
    }
  );

  const finished = animation.finished
    .catch(() => {})
    .then(() => {
      target.appendChild(piece);
      animation.cancel();

      delete piece.dataset.animating;

      sprite.style.backgroundImage =
        `url("${getCharacterImage(piece)}")`;

      display.style.display = "block";
      display.style.visibility = "visible";
      display.style.opacity = "1";

      updateAdventureDisplays();
    });

  return { duration, finished };
}

// ========================================
// CLASSIC MOVEMENT
// ========================================

function animateStandardMove(piece, target, isCapture) {
  const character = getCharacter(piece);

  const start =
    piece.parentElement.getBoundingClientRect();

  const end = target.getBoundingClientRect();

  const dx =
    end.left + end.width / 2 -
    (start.left + start.width / 2);

  const dy =
    end.top + end.height / 2 -
    (start.top + start.height / 2);

  const duration = MOVE_TIMES[character] || 500;

  const movingImage =
    character === "soldier"
      ? getSoldierMovementImage(piece, isCapture)
      : getCharacterImage(piece, "moving");

  const sprite = createAnimationSprite(
    piece,
    movingImage
  );

  piece.style.visibility = "hidden";

  const jumpHeight =
    getAdventureSettings(piece).jumpHeight || 0;

  const animation = sprite.animate(
    [
      {
        transform: "translate(0px, 0px)",
        offset: 0
      },
      {
        transform:
          `translate(${dx / 2}px, ${dy / 2 - jumpHeight}px)`,
        offset: 0.5
      },
      {
        transform: `translate(${dx}px, ${dy}px)`,
        offset: 1
      }
    ],
    {
      duration,
      easing: [
        "sleepy",
        "speedy",
        "sassy",
        "sage",
        "invisibleChick",
        "soldier"
      ].includes(character)
        ? "linear"
        : "ease-in-out",
      fill: "forwards"
    }
  );

  const finished = animation.finished
    .catch(() => {})
    .then(() => {
      target.appendChild(piece);
      piece.style.visibility = "";
      sprite.remove();
    });

  return { duration, finished };
}

function animateCharacterMove(piece, target, isCapture) {
  return usesAdventureDisplay(piece)
    ? animateAdventureMove(piece, target, isCapture)
    : animateStandardMove(piece, target, isCapture);
}

// ========================================
// CAPTURE ANIMATION
// ========================================

async function animateCapture(piece) {
  const character = getCharacter(piece);
  const display = adventureDisplays.get(piece);

  const capturedDisplay =
    usesAdventureDisplay(piece) && display
      ? display
      : null;

  const sprite = capturedDisplay
    ? null
    : createAnimationSprite(
        piece,
        getCharacterImage(piece, "captured")
      );

  const animatedElement = capturedDisplay || sprite;

  piece.style.visibility = "hidden";

  if (capturedDisplay) {
    capturedDisplay.style.display = "block";
    capturedDisplay.style.zIndex = "3500";

    capturedDisplay.querySelector(
      ".adventure-sprite"
    ).style.backgroundImage =
      `url("${getCharacterImage(piece, "captured")}")`;
  }

  const rect = animatedElement.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const direction =
    rect.left + rect.width / 2 <
    boardRect.left + boardRect.width / 2
      ? -1
      : 1;

  const distance =
    direction > 0
      ? window.innerWidth - rect.left + 120
      : -rect.right - 120;

  const frames = character === "superhero"
    ? [
        {
          transform: "translate(0, 0)",
          opacity: 1
        },
        {
          transform:
            "translate(180px, -900px) rotate(-25deg)",
          opacity: 0
        }
      ]
    : [
        {
          transform:
            "translate(0, 0) rotate(0deg)",
          opacity: 1,
          offset: 0
        },
        {
          transform:
            `translate(${direction * 35}px, -35px) rotate(${direction * 30}deg)`,
          opacity: 1,
          offset: 0.25
        },
        {
          transform:
            `translate(${distance}px, -120px) rotate(${direction * 600}deg) scale(0.6)`,
          opacity: 0,
          offset: 1
        }
      ];

  const animation = animatedElement.animate(
    frames,
    {
      duration: CAPTURE_TIME,
      easing: "ease-in",
      fill: "forwards"
    }
  );

  await animation.finished.catch(() => {});

  if (sprite) sprite.remove();
  if (capturedDisplay) animation.cancel();
}

// ========================================
// COMPLETE MOVE
// ========================================

async function performMove(move) {
  const piece = move.piece;
  const captured = move.captured;

  const movement = animateCharacterMove(
    piece,
    move.target,
    Boolean(captured)
  );

  let capturePromise = Promise.resolve();

  if (captured) {
    capturePromise = (async () => {
      await wait(movement.duration * 0.48);
      await animateCapture(captured);
    })();
  }

  await Promise.all([
    movement.finished,
    capturePromise
  ]);

  if (captured) {
    const display = adventureDisplays.get(captured);

    if (display) {
      display.remove();
      adventureDisplays.delete(captured);
    }

    captured.remove();
  }

  move.target.appendChild(piece);
  piece.style.visibility = "";

  const promoted = promoteIfNeeded(piece);

  updateAdventureDisplays();

  return {
    wasCapture: Boolean(captured),
    promoted
  };
}

// ========================================
// PLAYER CLICKS
// ========================================

async function handleSquareClick(square) {
  if (
    currentTurn !== "red" ||
    gameOver ||
    celebrating ||
    animatingMove
  ) return;

  const clickedPiece = square.querySelector(".piece");

  if (
    clickedPiece &&
    getPieceColor(clickedPiece) === "red"
  ) {
    if (
      continuingCapture &&
      clickedPiece !== selectedPiece
    ) return;

    const moves = continuingCapture
      ? getMovesForPiece(selectedPiece, true, true)
      : getAllMoves("red");

    if (!moves.some(
      move => move.piece === clickedPiece
    )) return;

    selectedPiece =
      selectedPiece === clickedPiece &&
      !continuingCapture
        ? null
        : clickedPiece;

    updateHighlights();
    return;
  }

  if (!selectedPiece || clickedPiece) return;

  const moves = continuingCapture
    ? getMovesForPiece(selectedPiece, true, true)
    : getAllMoves("red").filter(
        move => move.piece === selectedPiece
      );

  const move = moves.find(
    item => item.target === square
  );

  if (!move) return;

  animatingMove = true;
  updateHighlights();

  try {
    const result = await performMove(move);
    animatingMove = false;

    if (result.promoted) {
      showKingCelebration(
        move.piece,
        () => finishPlayerMove(result.wasCapture)
      );
    } else {
      finishPlayerMove(result.wasCapture);
    }
  } catch (error) {
    animatingMove = false;
    console.error("Player move error:", error);
    updateAdventureDisplays();
    updateHighlights();
  }
}

// ========================================
// FINISH PLAYER TURN
// ========================================

function finishPlayerMove(wasCapture) {
  if (checkGameEnd()) return;

  if (wasCapture) {
    const captures = getMovesForPiece(
      selectedPiece,
      true,
      true
    );

    if (captures.length > 0) {
      continuingCapture = true;
      updateHighlights();
      return;
    }
  }

  selectedPiece = null;
  continuingCapture = false;
  currentTurn = "black";

  if (checkNoMoves("black")) return;

  updateHighlights();

  setTimeout(computerMove, COMPUTER_DELAY);
}

// ========================================
// COMPUTER TURN
// ========================================

async function computerMove() {
  if (gameOver || celebrating || animatingMove) return;

  const moves = getAllMoves("black");

  if (moves.length === 0) {
    finishGame("black", "blocked");
    return;
  }

  const move = randomMove(moves);
  animatingMove = true;

  try {
    const result = await performMove(move);
    animatingMove = false;

    if (checkGameEnd()) return;

    const next = () => {
      if (result.wasCapture) {
        computerContinueCapture(move.piece);
      } else {
        currentTurn = "red";

        if (!checkNoMoves("red")) {
          updateHighlights();
        }
      }
    };

    if (result.promoted) {
      showKingCelebration(move.piece, next);
    } else {
      next();
    }
  } catch (error) {
    animatingMove = false;
    console.error("Computer move error:", error);
    updateAdventureDisplays();
  }
}

// ========================================
// COMPUTER MULTI-CAPTURE
// ========================================

function computerContinueCapture(piece) {
  const captures = getMovesForPiece(
    piece,
    true,
    true
  );

  if (!captures.length) {
    currentTurn = "red";

    if (!checkNoMoves("red")) {
      updateHighlights();
    }

    return;
  }

  setTimeout(async () => {
    if (gameOver) return;

    const move = randomMove(captures);
    animatingMove = true;

    try {
      const result = await performMove(move);
      animatingMove = false;

      if (checkGameEnd()) return;

      if (result.promoted) {
        showKingCelebration(
          piece,
          () => computerContinueCapture(piece)
        );
      } else {
        computerContinueCapture(piece);
      }
    } catch (error) {
      animatingMove = false;
      console.error(
        "Computer capture error:",
        error
      );
      updateAdventureDisplays();
    }
  }, COMPUTER_CAPTURE_DELAY);
}

// ========================================
// REVERSE CHECKERS WIN CONDITIONS
// ========================================

function checkGameEnd() {
  const redCount =
    board.querySelectorAll(".red-piece").length;

  const blackCount =
    board.querySelectorAll(".black-piece").length;

  if (redCount === 0) {
    finishGame("red", "pieces");
    return true;
  }

  if (blackCount === 0) {
    finishGame("black", "pieces");
    return true;
  }

  return false;
}

function checkNoMoves(color) {
  if (gameOver) return true;

  if (getAllMoves(color).length === 0) {
    finishGame(color, "blocked");
    return true;
  }

  return false;
}

// This function is replaced by ending.js
// when ending.js loads after script.js.

function finishGame(winner, reason) {
  if (gameOver) return;

  gameOver = true;
  selectedPiece = null;
  continuingCapture = false;

  updateHighlights();

  if (winner === "red") {
    alert(
      reason === "blocked"
        ? "YOU WIN CHIKIPETS!\n\nYour Chikipets have no legal moves left!"
        : "YOU WIN CHIKIPETS!\n\nYou lost all your pieces!"
    );
  } else {
    alert(
      reason === "blocked"
        ? "COMPUTER WINS!\n\nThe Chicken Soldiers have no legal moves left!"
        : "COMPUTER WINS!\n\nThe Chicken Soldiers lost all their pieces!"
    );
  }
}

// ========================================
// CLASSIC AND ADVENTURE VIEWS
// ========================================

const classicButton =
  document.getElementById("classic-view");

const adventureButton =
  document.getElementById("adventure-view");

function changeBoardView(view) {
  const adventure = view === "adventure";

  board.classList.toggle(
    "adventure-view",
    adventure
  );

  classicButton?.classList.toggle(
    "active",
    !adventure
  );

  adventureButton?.classList.toggle(
    "active",
    adventure
  );

  try {
    localStorage.setItem(
      "chikipets-board-view",
      view
    );
  } catch (error) {}

  updateAdventureDisplays();
}

classicButton?.addEventListener("click", () => {
  if (!animatingMove && !celebrating) {
    changeBoardView("classic");
  }
});

adventureButton?.addEventListener("click", () => {
  if (!animatingMove && !celebrating) {
    changeBoardView("adventure");
  }
});

let savedView = "classic";

try {
  savedView =
    localStorage.getItem("chikipets-board-view") ||
    "classic";
} catch (error) {}

changeBoardView(savedView);

if (!checkNoMoves("red")) {
  updateHighlights();
}
