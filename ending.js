
"use strict";

// ============================================
// CHIKIPETS - VICTORY AND DEFEAT ENDING
// ============================================

// This file works alongside script.js.
// It does not replace the existing game.

// The characters appear in this order.
const ENDING_CHARACTERS = [
  {
    name: "Chiki",
    happy: "Images/chiki.png",
    sad: "Images/chiki-king-sad.png",
    action: "bounce"
  },
  {
    name: "Superhero",
    happy: "Images/superhero-flying.png",
    sad: "Images/superhero-king-sad.png",
    action: "fly"
  },
  {
    name: "Chubby",
    happy: "Images/chubby-king-happy.png",
    sad: "Images/chubby-king-sad.png",
    action: "bounce"
  },
  {
    name: "Tough",
    happy: "Images/tough-king-happy.png",
    sad: "Images/tough-king-sad.png",
    action: "bounce"
  },
  {
    name: "Speedy",
    happy: "Images/speedy.png",
    sad: "Images/speedy-king-sad.png",
    action: "speedy"
  },
  {
    name: "Mystique",
    happy: "Images/mystique-queen-happy.png",
    sad: "Images/mystique-queen-sad.png",
    action: "float"
  },
  {
    name: "Sassy",
    happy: "Images/sassy-queen-happy.png",
    sad: "Images/sassy-queen-sad.png",
    action: "bounce"
  },
  {
    name: "Nerdy",
    happy: "Images/nerdy-king-happy.png",
    sad: "Images/nerdy-king-sad.png",
    action: "bounce"
  },
  {
    name: "Cool",
    happy: "Images/cool-king-happy.png",
    sad: "Images/cool-king-sad.png",
    action: "cool"
  },
  {
    name: "Invisible Chick",
    happy: "Images/invisible-chick-king-happy.png",
    sad: "Images/invisible-chick-king-sad.png",
    action: "bounce"
  },
  {
    name: "Sleepy",
    happy: "Images/sleepy.png",
    sad: "Images/sleepy.png",
    action: "sleep"
  },
  {
    name: "Sage",
    happy: "Images/sage.png",
    sad: "Images/sage.png",
    action: "peaceful"
  }
];

// ============================================
// BUILD THE ENDING SCREEN
// ============================================

const endingScreen = document.createElement("div");

endingScreen.id = "chikipets-ending";

endingScreen.setAttribute("aria-hidden", "true");

endingScreen.innerHTML = `
  <div class="ending-background"></div>

  <div class="ending-content">

    <div class="ending-stars" aria-hidden="true"></div>

    <div class="ending-heading">
      <div class="ending-small-title">CHIKIPETS</div>
      <h1 id="ending-title">YOU WIN!</h1>
      <p id="ending-message"></p>
    </div>

    <div id="ending-character-grid"></div>

    <div id="ending-special-message"></div>

    <div class="ending-buttons">
      <button id="ending-play-again" type="button">
        PLAY AGAIN
      </button>
      <button id="ending-close" type="button">
        VIEW BOARD
      </button>
    </div>

  </div>
`;

document.body.appendChild(endingScreen);

const endingTitle =
  document.getElementById("ending-title");

const endingMessage =
  document.getElementById("ending-message");

const endingGrid =
  document.getElementById("ending-character-grid");

const endingSpecialMessage =
  document.getElementById("ending-special-message");

// ============================================
// CREATE CHARACTER CARDS
// ============================================

function createEndingCharacter(character, didWin, index) {
  const card = document.createElement("div");

  card.className =
    "ending-character ending-" + character.action;

  card.style.setProperty(
    "--character-delay",
    `${index * 85}ms`
  );

  if (!didWin) {
    card.classList.add("ending-sad");
  }

  const image = document.createElement("img");

  image.src = didWin
    ? character.happy
    : character.sad;

  image.alt = character.name;

  // If a special expression is missing,
  // use the ordinary character image.
  const fallbackImages = {
    "Chiki": "Images/chiki.png",
    "Superhero": "Images/superhero.png",
    "Chubby": "Images/chubby.png",
    "Tough": "Images/tough.png",
    "Speedy": "Images/speedy.png",
    "Mystique": "Images/mystique.png",
    "Sassy": "Images/sassy.png",
    "Nerdy": "Images/nerdy.png",
    "Cool": "Images/cool.png",
    "Invisible Chick": "Images/invisible-chick.png",
    "Sleepy": "Images/sleepy.png",
    "Sage": "Images/sage.png"
  };

  image.onerror = () => {
    const fallback = fallbackImages[character.name];

    if (
      fallback &&
      !image.src.endsWith(fallback)
    ) {
      image.src = fallback;
    } else {
      image.style.display = "none";
    }
  };

  const name = document.createElement("div");

  name.className = "ending-character-name";
  name.textContent = character.name;

  card.appendChild(image);
  card.appendChild(name);

  return card;
}

// ============================================
// CONFETTI AND RAIN
// ============================================

function createEndingParticles(didWin) {
  const container =
    endingScreen.querySelector(".ending-stars");

  container.innerHTML = "";

  const colors = didWin
    ? [
        "#ffdf55",
        "#ff6584",
        "#6be4ff",
        "#ffffff",
        "#8aff9e"
      ]
    : [
        "#8ac6ff",
        "#b3d6ff",
        "#ffffff"
      ];

  const count = didWin ? 65 : 35;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");

    particle.className = didWin
      ? "ending-confetti"
      : "ending-raindrop";

    particle.style.left =
      Math.random() * 100 + "%";

    particle.style.animationDelay =
      Math.random() * -7 + "s";

    particle.style.animationDuration =
      (3 + Math.random() * 4) + "s";

    particle.style.backgroundColor =
      colors[
        Math.floor(Math.random() * colors.length)
      ];

    if (didWin) {
      particle.style.transform =
        `rotate(${Math.random() * 360}deg)`;
    }

    container.appendChild(particle);
  }
}

// ============================================
// DISPLAY THE ENDING
// ============================================

function showChikipetsEnding(winner, reason) {
  const didWin = winner === "red";

  endingScreen.classList.remove(
    "ending-victory",
    "ending-defeat",
    "ending-visible"
  );

  endingScreen.classList.add(
    didWin ? "ending-victory" : "ending-defeat"
  );

  endingTitle.textContent = didWin
    ? "YOU WIN!"
    : "YOU LOSE!";

  if (didWin) {
    endingMessage.textContent =
      reason === "blocked"
        ? "Your Chikipets have no legal moves left. Victory!"
        : "You lost all your Chikipets. That's how you win!";
  } else {
    endingMessage.textContent =
      reason === "blocked"
        ? "The Chicken Soldiers have no legal moves left!"
        : "The Chicken Soldiers lost all their pieces!";
  }

  endingGrid.innerHTML = "";

  ENDING_CHARACTERS.forEach((character, index) => {
    endingGrid.appendChild(
      createEndingCharacter(
        character,
        didWin,
        index
      )
    );
  });

  if (didWin) {
    endingSpecialMessage.textContent =
      "Chiki celebrates! Superhero flies! Sage remains calm... and Sleepy is still asleep.";
  } else {
    endingSpecialMessage.textContent =
      "The Chikipets are heartbroken! Well... except Sage and Sleepy.";
  }

  createEndingParticles(didWin);

  endingScreen.setAttribute(
    "aria-hidden",
    "false"
  );

  requestAnimationFrame(() => {
    endingScreen.classList.add("ending-visible");
  });
}

// ============================================
// BUTTONS
// ============================================

document.getElementById(
  "ending-play-again"
).addEventListener("click", () => {
  window.location.reload();
});

document.getElementById(
  "ending-close"
).addEventListener("click", () => {
  endingScreen.classList.remove("ending-visible");

  endingScreen.setAttribute(
    "aria-hidden",
    "true"
  );
});

// ============================================
// CONNECT TO EXISTING GAME
// ============================================

// The existing script.js calls finishGame()
// whenever either player wins.
//
// We replace that function with a version
// that displays the new ending screen.
//
// All movement, capture animations,
// computer logic and characters stay intact.

finishGame = function(winner, reason) {
  if (gameOver) {
    return;
  }

  gameOver = true;
  selectedPiece = null;
  continuingCapture = false;

  updateHighlights();

  showChikipetsEnding(winner, reason);
};
