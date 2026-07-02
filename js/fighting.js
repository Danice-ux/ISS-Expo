// =====================
// STATS
// =====================

const player = {
    hp: 200,
    maxHp: 200
};

window.enemy = {
    hp: 30,
    maxHp: 300
};
window.updateBattleUI = updateUI;
const enemy = window.enemy;
let playerTurn = true;
window.hand = [];
let allCards = [];

// =====================
// CARD EFFECTS
// =====================

let attackMultiplier = 1;
let attackBonus = 0;
let defenseMultiplier = 1;
let enemyFrozenTurns = 0;

const cardFunctions = {

    andromeda() {
        player.hp = Math.min(player.maxHp, player.hp + 50);
        setMessage("Andromeda heals 50 HP!");
    },

    aquila() {
        enemy.hp -= 50;
        setMessage("Aquila strikes! (-50 HP)");
    },

    aquarius() {
        player.hp = Math.min(player.maxHp, player.hp + 20);
        setMessage("Aquarius heals 20 HP!");
    },

    aries() {
        enemy.hp -= 40;
        setMessage("Aries charges! (-40 HP)");
    },

    bootes() {
        enemy.hp = 0;
        setMessage("Boötes is pissed off! INSTANT K.O.");
    },

    caelum() {
        attackMultiplier = 2;
        setMessage("Caelum doubles your next attack!");
    },

    cancer() {
        defenseMultiplier = 0.5;
        setMessage("Cancer raises your defense!");
    },

    capricornus() {
        player.hp = Math.min(player.maxHp, player.hp + 25);
        setMessage("Capricornus heals 25 HP!");
    },

    cassiopeia() {
        enemyFrozenTurns = 1;
        setMessage("Cassiopeia freezes the enemy!");
    },

    chamaeleon() {
        defenseMultiplier = 0.5;
        setMessage("Chamaeleon raises your defense!");
    },

    draco() {
        enemy.hp -= (20 * attackMultiplier) + attackBonus;
        attackMultiplier = 1;
        attackBonus = 0;

        setMessage("Draco attacks! (-20 HP)");
    },

    gemini() {
        attackMultiplier = 2;
        defenseMultiplier = 0.5;
        setMessage("Gemini empowers attack and defense!");
    },

    hercules() {
        enemy.hp -= (15 * attackMultiplier) + attackBonus;
        attackMultiplier = 1;
        attackBonus = 0;

        setMessage("Hercules attacks! (-15 HP)");
    },

    hydra() {
        enemy.hp -= (50 * attackMultiplier) + attackBonus;
        attackMultiplier = 1;
        attackBonus = 0;

        setMessage("Hydra attacks! (-50 HP)");
    },

    leo() {
        enemy.hp -= (30 * attackMultiplier) + attackBonus;
        attackMultiplier = 1;
        attackBonus = 0;

        setMessage("Leo attacks! (-30 HP)");
    },

    libra() {
        defenseMultiplier = 0.5;
        setMessage("Libra balances the scales! Defense up!");
    },

    lyra() {
        player.hp = Math.min(player.maxHp, player.hp + 40);
        setMessage("Lyra heals 40 HP!");
    },

    orion() {
        enemy.hp -= (40 * attackMultiplier) + attackBonus;
        attackMultiplier = 1;
        attackBonus = 0;

        setMessage("Orion fires an arrow! (-40 HP)");
    },

    pegasus() {
        defenseMultiplier = 0.5;
        setMessage("Pegasus protects you!");
    },

    phoenix() {
        player.hp = player.maxHp;
        setMessage("Phoenix restores Lou to full HP!");
    },

    pisces() {
        player.hp = Math.min(player.maxHp, player.hp + 30);
        setMessage("Pisces heals 30 HP!");
    },

    pyxis() {
        attackMultiplier = 2;
        setMessage("Pyxis doubles your next attack!");
    },

    scorpio() {
        enemy.hp -= (20 * attackMultiplier) + attackBonus;
        attackMultiplier = 1;
        attackBonus = 0;

        setMessage("Scorpio stings! (-20 HP)");
    },

    sagittarius() {
        attackBonus += 25;
        setMessage("Sagittarius increases your next attack by 25!");
    },

    taurus() {
        enemy.hp -= (25 * attackMultiplier) + attackBonus;
        attackMultiplier = 1;
        attackBonus = 0;

        setMessage("Taurus charges! (-25 HP)");
    },

    virgo() {
        player.hp = Math.min(player.maxHp, player.hp + 30);
        setMessage("Virgo heals 30 HP!");
    }

};

// =====================
// ENEMY MOVES
// =====================

const enemyMoves = [
    {
        name: "Punch",
        damage: 10
    },
    {
        name: "Kick",
        damage: 15
    },
    {
        name: "Power Smash",
        damage: 25
    }
];

// =====================
// LOAD CARDS
// =====================
let unlockedCards = new Set();

async function loadCards() {
    const response = await fetch("js/cards.json");
    const data = await response.json();

    allCards = data.filter(card => card.name !== "Bootes");

    generateStartingHand();
    updateUI();
}

window.unlockBootes = function unlockBootes() {
    const response = fetch("js/cards.json")
        .then(res => res.json())
        .then(data => {
            const bootes = data.find(c => c.name === "Bootes");
            if (bootes) allCards.push(bootes);
        });
        document.getElementById('dialog').innerHTML= "bootes unlocked! play bootes to defeat the enemy in one card!";
        setTimeout(() => {
            const dialog = document.getElementById('dialog');
            dialog.style.display = "block";

            setTimeout(() => {
                dialog.style.display = "none";
            }, 2000);
        }, 3000);
    }

// =====================
// RANDOM CARD
// =====================

function getRandomCard() {

    const randomIndex =
        Math.floor(Math.random() * allCards.length);

    return structuredClone(allCards[randomIndex]);
}

// =====================
// STARTING HAND
// =====================

function generateStartingHand() {

    window.hand = [];

    for (let i = 0; i < 5; i++) {
        window.hand.push(getRandomCard());
    }

    renderHand();
}

// =====================
// DRAW CARD
// =====================

function refillHand() {

    while (window.hand.length < 5) {
        window.hand.push(getRandomCard());
    }

    renderHand();
}

// =====================
// RENDER HAND
// =====================

function renderHand() {

    const handDiv = document.getElementById("hand");

    handDiv.innerHTML = "";

    window.hand.forEach((card, index) => {

        const cardElement = document.createElement("div");

        cardElement.className = "card";

        cardElement.innerHTML = `
            <h3>${card.name}</h3>
            <p>${card.extraInformation}</p>
        `;

        cardElement.onclick = () => playCard(index);

        handDiv.appendChild(cardElement);
    });
}

// =====================
// PLAY CARD         <img src="${card.imgname}" width="100">
// =====================

function playCard(index) {

    if (!playerTurn) return;

    const card = window.hand[index];

    const effect = cardFunctions[card.function];

    if (effect) {
        effect();
    }

    window.hand.splice(index, 1);

    refillHand();

    updateUI();

    if (checkGameOver()) return;

    playerTurn = false;

    setTimeout(enemyTurn, 1000);

    socket.emit("battleUpdate", window.hand);
}

// =====================
// ENEMY TURN
// =====================

function enemyTurn() {

    if (enemyFrozenTurns > 0) {
        enemyFrozenTurns--;
        setMessage("Enemy is frozen and misses its turn!");
        playerTurn = true;
        return;
    }

    const move =
        enemyMoves[Math.floor(Math.random() * enemyMoves.length)];

    const damage = Math.floor(move.damage * defenseMultiplier);

    player.hp -= damage;

    defenseMultiplier = 1;

    setMessage(
        `Enemy uses ${move.name}! (-${damage} HP)`
    );

    updateUI();

    if (checkGameOver()) return;

    playerTurn = true;
}

// =====================
// UI
// =====================
function updateHPBars() {

    const enemyPercent = (enemy.hp / enemy.maxHp) * 100;
    const playerPercent = (player.hp / player.maxHp) * 100;

    document.getElementById("enemyHpBar").style.width = enemyPercent + "%";
    document.getElementById("playerHpBar").style.width = playerPercent + "%";

    document.getElementById("enemyHpText").textContent =
        `${Math.max(0, enemy.hp)} / ${enemy.maxHp}`;

    document.getElementById("playerHpText").textContent =
        `${Math.max(0, player.hp)} / ${player.maxHp}`;
}

function updateUI() {
    updateHPBars()

}

function setMessage(text) {

    document.getElementById("message").textContent = text;
}

window.resetBattleState = function () {
    player.hp = player.maxHp;

    attackMultiplier = 1;
    attackBonus = 0;
    defenseMultiplier = 1;
    enemyFrozenTurns = 0;

    playerTurn = true;

    setMessage("");

    generateStartingHand();
    updateUI();
};

// =====================
// WIN / LOSE
// =====================


function checkGameOver() {
    if (enemy.hp <= 0) {
        setMessage("Victory!");
        playerTurn = false;

        setTimeout(() => {
            document.getElementById("battle").style.display = "none";
            window.parent.endBattle?.(true);
        }, 800);

        return true;
    }
if (player.hp <= 0) {
    setMessage("Defeat!");
    playerTurn = false;

    setTimeout(() => {
        document.getElementById("battle").style.display = "none";
        window.parent.endBattle?.(false);
    }, 800);

    return true;
}

    return false;
}



// =====================
// START GAME
// =====================
// window.playCard = playCard();
window.cardsReady = loadCards();