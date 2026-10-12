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
        </main>
    `
}