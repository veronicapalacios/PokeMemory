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