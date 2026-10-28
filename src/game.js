import { loadPokemon } from "./pokemon-api.js"
import { saveGameResult } from "./storage.js"
import { getGameHistory } from "./storage.js"
let timerInterval = null
let hideCardsTimeout = null
let gameRequestId = 0

export function renderGame (profile) {
    const app = document.querySelector('#app')

    app.innerHTML = `
        <main>
            <h1> PokeMemory </h1>

            <section class="game-header">
                <h2> Welcome, ${profile.username}!</h2>
                <div class="player-favorite">
                    <img src="${profile.favoritePokemon.image}" alt="${profile.favoritePokemon.name}">
                    <p>Favorite Pokémon: ${profile.favoritePokemon.name}</p>
                </div>
            </section>
            <section class="game-setup">
                <h2>New game </h2>
                <form id="game-form">
                    <label for="card-count">Number of cards </label>
                    <input
                        type="number"
                        id="card-count"
                        name="card-count"
                        min="2"
                        step="1"
                        required
                    >
                    <button type="submit">Start game</button>
                    <p id="game-feedback"></p>
                </form>
            </section>
            <section class="game-board">
                <h2>Memory Game </h2>
                <p id="game-timer">Time: 00:00</p>
                <div id="game-cards"></div>
            </section>
            <section class="game-history">
                <h2>Ranking</h2>
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
        </main>
    `

    function renderGameHistory() {
        const gameHistory = document.querySelector('#game-history')
        const response = getGameHistory()
        gameHistory.innerHTML=''
        const latestGame = [...response].sort((a,b) => b.id - a.id)[0]

        response. sort ((a,b) =>{
            if (b.cardCount !== a.cardCount) {
                return b.cardCount - a.cardCount
            }
            return a.time - b.time
        })

        if (response.length === 0) {
            const row = document.createElement('tr')
            const cell = document.createElement('td')
            cell.textContent = 'No games played yet'
            cell.colSpan = 5
            row.appendChild(cell)
            gameHistory.appendChild(row)
            return
        }
        const topGames = response.slice(0,5)
        if (!topGames.some((game) => game.id === latestGame.id)) {
            topGames.push(latestGame)
        }

        topGames.forEach((result,index) => {
            const row = document.createElement('tr')

            if (result.id === latestGame.id) {
                row.classList.add('latest-game')
            }
            
            const minutes = String(Math.floor(result.time/60)).padStart(2,'0')
            const seconds = String(result.time%60).padStart(2,'0')

            row.innerHTML = `
                <td>${response.findIndex((game) => game.id === result.id) + 1}</td>
                <td>${result.username}</td>
                <td>${result.favoritePokemon}</td>
                <td>${minutes}:${seconds}</td>
                <td>${result.cardCount}</td>
            `
            gameHistory.appendChild(row)
        })

        if (response.length > 5) {
            const hiddenGames = response.length - topGames.length
            if (hiddenGames>0) {
                const row = document.createElement('tr')
                const cell = document.createElement('td')
                cell.textContent = `And ${hiddenGames} more games...`
                cell.colSpan = 5
                row.appendChild(cell)
                gameHistory.appendChild(row)
            }
        }
    }

    renderGameHistory()

    const gameForm = document.querySelector('#game-form')
    const cardCountInput = document.querySelector ('#card-count')
    const gameFeedback =document.querySelector ('#game-feedback')
    const startButton = gameForm.querySelector('button[type="submit"]')

    gameForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const cardCount =Number (cardCountInput.value)

        if (
            !Number.isInteger(cardCount) || cardCount<=0 || cardCount%2 !== 0
        ) {
            gameFeedback.textContent = 'Enter a positive, even number of cards.'
            return
        } 

        const requestId = ++gameRequestId
        document.querySelector('#game-cards').innerHTML = ''
        document.querySelector('#game-timer').textContent = 'Time: 00:00'

        if (timerInterval !== null) {
            clearInterval (timerInterval)
            timerInterval = null
        }

        if (hideCardsTimeout !== null) {
            clearTimeout(hideCardsTimeout)
            hideCardsTimeout = null
        }

        startButton.disabled = true
        try {
            const cards = await createPokemonPairs(cardCount)
            if (requestId !== gameRequestId) {
                return
            }
            shuffleCards(cards)
            renderCards(cards, profile, cardCount, renderGameHistory)
            startButton.disabled = false
            gameFeedback.textContent=`Game ready with ${cardCount} cards.`
        } catch (error) {
            if (requestId !== gameRequestId) {  
                return
            }
            startButton.disabled = false
            console.error('Error creating the game:', error)
            gameFeedback.textContent = 'Unable to load the game. Please try again.'

        }
    })
}

function renderCards (cards, profile, cardCount, renderGameHistory) {
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

async function getRandomPokemon (cardCount) {
    const pokemonList = await loadPokemon ()
    const pairCount = cardCount /2

    if (pokemonList.length < pairCount) {
        throw new Error ('Not enough Pokémon available')
    }

    const shuffledPokemon = [...pokemonList]

    for (let i= shuffledPokemon.length -1; i > 0 ; i--) {
        const randomIndex = Math.floor (Math.random() * (i+1))
        const temp = shuffledPokemon [i]
        shuffledPokemon [i] = shuffledPokemon [randomIndex]
        shuffledPokemon[randomIndex] = temp        
    }
    return shuffledPokemon.slice (0, pairCount)
}

async function getPokemonDetails(pokemon) {
    const response = await fetch(pokemon.url)
    if (!response.ok) {
        throw new Error('Error fetching Pokémon details')
    }
    const data = await response.json()
    return {
        id: data.id,
        name: data.name, 
        image: data.sprites.front_default
    }
}

async function createPokemonPairs(cardCount) {
    const selectedPokemon = await getRandomPokemon(cardCount)
    const pokemonDetails = await Promise.all (
        selectedPokemon.map((pokemon) => getPokemonDetails(pokemon))
    )
    const cards = pokemonDetails.flatMap((pokemon) => [
        { ...pokemon },
        { ...pokemon }
    ])
    return cards
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