import { createPokemonPairs } from "./pokemon-api.js"
import { renderProfile, initProfile } from "./profile.js"
import { saveGameResult, removeProfile} from "./storage.js"
import { renderGameHistory } from "./ranking.js"

let timerInterval = null
let hideCardsTimeout = null
let gameRequestId = 0

export function renderGame (profile) {
    const app = document.querySelector('#app')
        app.innerHTML = `
            <main class="game-layout">
                <aside class="game-sidebar">
                    <!-- PERFIL -->
                    <section class="game-header">
                        <h2>Welcome, ${profile.username}!</h2>

                        <div class="player-favorite">
                            <img src="${profile.favoritePokemon.image}" alt="${profile.favoritePokemon.name}">
                            <div>
                                <p>Favorite Pokémon:</p>
                                <strong>${profile.favoritePokemon.name}</strong>
                            </div>
                        </div>

                        <button id="logout-button" type="button">Log out</button>
                    </section>

                    <!-- CONFIGURACIÓN DE PARTIDA -->
                    <section class="game-setup">
                        <h2>New game</h2>

                        <form id="game-form">
                            <label for="card-count">Number of cards</label>

                            <input
                                type="number"
                                id="card-count"
                                name="card-count"
                                min="2"
                                step="1"
                                required
                            >
                            <button type="submit">Start game</button>
                            <button type="button" id="restart-button" hidden>Restart game</button>
                        </form>
                    </section>
                    <!-- RANKING -->
                    <section class="game-history">
                        <h2>🏆 Ranking 🏆</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Player</th>
                                    <th>Favorite Pokémon</th>
                                    <th>Time</th>
                                    <th>Cards</th>
                                </tr>
                            </thead>

                            <tbody id="game-history"></tbody>
                        </table>
                    </section>
                </aside>
                <section class="game-content">
                    <h1>PokeMemory</h1>
                    <section class="game-feedback-panel"
                        <p id="game-feedback">Choose the number of cards and start playing</p>
                    </section>
                    <!-- TABLERO -->
                    <section class="game-board">
                        <div class="board-header">
                            <h2>Memory Game</h2>
                            <p id="game-timer">Time: 00:00</p>
                        </div>

                        <div id="game-cards"></div>
                    </section>
                </section>
            </main>
        `

    renderGameHistory()

    const logoutButton = document.querySelector('#logout-button')
    logoutButton.addEventListener('click', () => {
        //Cancelamos el temporitzador activo
        if (timerInterval !== null) {
            clearInterval(timerInterval)
            timerInterval = null
        }
        //Cancelamos la ocultación pendiente de las cartas
        if (hideCardsTimeout !== null) {
            clearTimeout(hideCardsTimeout)
            hideCardsTimeout = null
        }
        //Impedimos que una petición antigua inicie partida después de cerrar sesión
        gameRequestId++

        removeProfile()
        renderProfile()
        initProfile()
    })

    const gameForm = document.querySelector('#game-form')
    const cardCountInput = document.querySelector ('#card-count')
    const gameFeedback =document.querySelector ('#game-feedback')
    const startButton = gameForm.querySelector('button[type="submit"]')
    const restartButton = document.querySelector('#restart-button')

    async function startGame() {
        const cardCount = Number(cardCountInput.value)
        if (!Number.isInteger(cardCount) || cardCount <= 0 || cardCount % 2 !==0) {
            gameFeedback.textContent = 'Enter a positive, even number of cards'
            return
        }
        const requestId = ++gameRequestId
        document.querySelector('#game-cards').innerHTML = ''
        document.querySelector('#game-timer').textContent = 'Time: 00:00'

        //si hay un temporizador activo lo paramos
        if (timerInterval !== null) {
            clearInterval(timerInterval)
            timerInterval = null
        }
        //si hay una ocultación de cartas pendiente, la paramos
        if (hideCardsTimeout !== null) {
            clearTimeout(hideCardsTimeout)
            hideCardsTimeout = null
        }
        //desactivamos los botones mientras preparamos cartas
        startButton.disabled = true
        restartButton.disabled = true

        try {
            const cards = await createPokemonPairs(cardCount)
            if (requestId !== gameRequestId) {
                return
            }
            shuffleCards(cards)
            renderCards(cards, profile, cardCount)

            //Ocultamos start y mostramos restart cuando el juego esta preparado
            startButton.hidden = true
            restartButton.hidden = false

            //Reactivamos restart 
            restartButton.disabled = false
            gameFeedback.textContent = `Game ready with ${cardCount} cards.`
        } catch (error) {
            if (requestId !== gameRequestId){
                return
            }
            //Reactivamos los botones si falla la carga
            startButton.disabled = false
            restartButton.disabled = false

            console.error('Error creating the game:', error)
            gameFeedback.textContent = 'Unable to load the game. Please try again.'
        }
    }
    gameForm.addEventListener('submit', (event) => {
        event.preventDefault()
        startGame()
    }) 
    restartButton.addEventListener('click', () => {
        startGame()
    })
}
function renderCards (cards, profile, cardCount) {
    const gameCards =document.querySelector ('#game-cards')
    gameCards.innerHTML = ''

    const selectedCards = []
    let isChecking=false
    let matchedPairs = 0
    let elapsedSeconds = 0
    let gameFinished = false

    const gameTimer = document.querySelector('#game-timer')

    function updateTimer() {
        const minutes = Math.floor(elapsedSeconds/60)
        const seconds = elapsedSeconds % 60

        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(seconds).padStart(2, '0')

        gameTimer.textContent = `Time: ${formattedMinutes}:${formattedSeconds}`
    }

    if (timerInterval !== null) {
        clearInterval(timerInterval)
    }

    if (hideCardsTimeout !== null) {
        clearTimeout(hideCardsTimeout)
        hideCardsTimeout = null
    }

    elapsedSeconds = 0
    updateTimer()

    timerInterval = setInterval(() => {
        elapsedSeconds++
        updateTimer()
    },1000)
    
    cards.forEach ((pokemon, index) => {
        const card = document.createElement ('button')
        card.type = 'button'
        card.classList.add('memory-card')

        card.dataset.index = index
        card.dataset.pokemonId = pokemon.id

        const image = document.createElement('img')
        image.src = pokemon.image
        image.alt = pokemon.name
        image.hidden = true
        card.appendChild(image)
        
        const questionMark = document.createElement('span')
        questionMark.textContent = '?'

        card.appendChild(questionMark)

        card.addEventListener('click',() => {
            if (isChecking) {
                return
            }
            if (selectedCards.includes (card)) {
                return
            }
            image.hidden = false
            questionMark.hidden = true
            selectedCards.push(card)

            if (selectedCards.length < 2) {
                return
            }
            const firstCard = selectedCards[0]
            const secondCard = selectedCards[1]
            
            if (firstCard.dataset.pokemonId === secondCard.dataset.pokemonId) {
                firstCard.disabled=true
                secondCard.disabled=true

                firstCard.classList.add('matched')
                secondCard.classList.add('matched')

                matchedPairs++

                if (matchedPairs === cards.length/2 && !gameFinished) {
                    gameFinished = true
                    clearInterval(timerInterval)

                    const result = {
                        id: Date.now(),
                        username: profile.username,
                        favoritePokemon: profile.favoritePokemon.name,
                        time: elapsedSeconds,
                        cardCount: cardCount
                    }
                    saveGameResult(result)
                    renderGameHistory()

                    document.querySelector('#game-feedback').textContent =
                        '¡Congratulations! ¡You found all the pairs!'
                }
                selectedCards.length=0
                return
            } 
            
            isChecking=true

            hideCardsTimeout = setTimeout (() => {
                selectedCards.forEach((selectedCard)=> {
                    selectedCard.querySelector('img').hidden=true
                    selectedCard.querySelector('span').hidden=false
                })
                selectedCards.length = 0
                isChecking = false
                hideCardsTimeout = null
            }, 1000)
        })
        gameCards.appendChild(card)
    })
}
function shuffleCards(cards) {
    for (let i= cards.length -1; i > 0 ; i--) {
        const randomIndex = Math.floor (Math.random() * (i+1))
        const temp = cards [i]
        cards [i] = cards [randomIndex]
        cards[randomIndex] = temp      
    }
    return cards
}