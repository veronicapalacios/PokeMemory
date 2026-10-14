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
                        step="2"
                        required
                    >
                    <button type="submit">Start game</button>
                    <p id="game-feedback"></p>
                </form>
            </section>
            <section class="game-board">
                <h2>Memory Game </h2>
                <div id="game-cards"></div>
            </section>
        </main>
    `

    const gameForm = document.querySelector('#game-form')
    const cardCountInput = document.querySelector ('#card-count')
    const gameFeedback =document.querySelector ('#game-feedback')

    gameForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const cardCount =Number (cardCountInput.value)

        if (
            !Number.isInteger(cardCount) || cardCount<=0 || cardCount%2 !== 0
        ) {
            gameFeedback.textContent = 'Introduce un número entero positivo y par de cartas.'
            return
        } 
        renderCards(cardCount)
        gameFeedback.textContent = `Número válido: ${cardCount} cartas.`
    })
}

function renderCards (cardCount) {
    const gameCards =document.querySelector ('#game-cards')
    gameCards.innerHTML = ''
    
    for (let i=0; i<cardCount; i++) {
        const card =document.createElement ('button')
        card.type= 'button'
        card.classList.add ('memory-card')
        card.textContent = '?'

        gameCards.appendChild(card)
    }
}