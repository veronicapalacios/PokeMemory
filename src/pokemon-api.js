export async function loadPokemon(){
  try {
    const response=await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500')
    if (!response.ok) {
      throw new Error ('Error fetching Pokémon list')
    }
    const data=await response.json()
    return data.results
  }catch (error){
    console.error('Error loading Pokémon:',error)
    return []
  }
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

export async function createPokemonPairs(cardCount) {
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
