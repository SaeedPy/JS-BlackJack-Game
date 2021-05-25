let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10 , 'Q': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};


const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a')
const winSound = new Audio('static/sounds/cash.mp3')
const lossSound = new Audio('static/sounds/aww.mp3')

document.querySelector('#blackjack-hit').addEventListener('click', blackjackHit)
document.querySelector('#blackjack-stand').addEventListener('click', dealerLogic)
document.querySelector('#blackjack-deal').addEventListener('click', blackjackDeal)

function blackjackHit() {
    if (blackjackGame['isStand'] === false){
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU)
        showScore(YOU)
    }
};

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
};

function showCard(card, activePlayer){
    if (activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play()
    }
};

function blackjackDeal(){
    if (blackjackGame['turnsOver'] === true){

        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        
        yourImages.forEach((item) => {
            item.remove()
        });
        
        dealerImages.forEach((item) => {
            item.remove()
        });
        
        YOU['score'] = 0;
        DEALER['score'] = 0;

        let yourScore = document.querySelector('#your-blackjack-result');
        yourScore.textContent = 0;
        yourScore.style.color = 'white';

        let dealerScore = document.querySelector('#dealer-blackjack-result');
        dealerScore.textContent = 0;
        dealerScore.style.color = 'white'

        let letPlay = document.querySelector('#blackjack-result');
        letPlay.textContent = "Let's Play";
        letPlay.style.color = 'black'

        blackjackGame['turnsOver'] = true;
    }
};

function updateScore(card, activePlayer){
    if (card === 'A'){
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1]
        }else{
            activePlayer['score'] + blackjackGame['cardsMap'][card][0]
        }
    }else{
    activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
};

function showScore(activePlayer){
    if (activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }else{
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']
    }
}

function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true){
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// compute who is winner
function computeWinner(){
    let winner;

    if (YOU['score'] <= 21){
        
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)){
            blackjackGame['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            winner = DEALER;
            
        } else if (YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
        }

    // conditions: when user busts but dealer dosen't
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        blackjackGame['losses']++;
        winner = DEALER;
    
    // conditions: when you AND the dealer busts
    } else if (YOU['score'] > 21 && DEALER['score'] > 21){
        blackjackGame['draws']++;
    }

    return winner;
}

function showResult(winner){
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true){

        if (winner === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
            
        } else if (winner === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();
            
        } else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'balck';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}
