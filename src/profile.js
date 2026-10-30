import { saveProfile } from "./storage.js"
import { loadPokemon } from "./pokemon-api.js"

export function renderProfile(){ 
    document.querySelector('#app').innerHTML = `
    <main>
        <h1> PokeMemory </h1>

        <section class="profile-card">
        <h2> Create your profile </h2>

        <form id="profile-form">
            <label for="username"> Username </label>
            <input type="text" id="username" name="username"
            minlength="3" maxlength="15" required
            >

            <label for="pokemon-search"> Favourite Pokémon </label>
            <input type="text" id="pokemon-search" name="pokemon-search"
            placeholder="Search your favorite Pokémon..."
            autocomplete="off"
            >

            <div id="pokemon-results"></div>
            <div id="selected-pokemon"></div>

            <button type="submit">Create Profile</button>
        </form>
        </section>
    </main>
    `
}

export async function initProfile () {
    let selectedPokemonData= null
    
    const pokemonList=await loadPokemon()
    const pokemonSearch = document.querySelector('#pokemon-search')
    const pokemonResults = document.querySelector('#pokemon-results')
    const selectedPokemon = document.querySelector('#selected-pokemon')

    const profileForm=document.querySelector('#profile-form')
    profileForm.addEventListener('submit', (event)=>{
        event.preventDefault() //evita que navegador recargue pg al enviar form

        const username=document.querySelector('#username').value.trim()

        if (username.length<3 || username.length>15){
            alert('Username must be between 3 and 15 characters.')
            return 
        }

        if (!selectedPokemonData){
            alert ('Please select your favorite Pokémon to continue...')
            return
        }

        const profile = {
            username: username,
            favoritePokemon: selectedPokemonData
        }

        const response = saveProfile(profile)

        if (!response.status) {
            alert(`Could not save your profile.`)
            return
        }

        alert(`Welcome, ${username}!`)
        window.location.reload()
    })

    pokemonSearch.addEventListener('input', () => {
        const searchText =pokemonSearch.value.trim().toLowerCase()
        pokemonResults.innerHTML=''
        selectedPokemonData=null
        selectedPokemon.innerHTML=''

        let matches = [] 

        if (searchText) {
            matches = pokemonList
                .filter((pokemon) => pokemon.name.includes(searchText))
                .slice (0,5)
        }

        matches.forEach((pokemon) => {
            const result = document.createElement('button')
            result.type='button' //evitamos enviar el form al darle
            result.textContent=pokemon.name
        
            result.addEventListener('click', async() => {
                try {
                    const response =await fetch (pokemon.url)
                    if (!response.ok) {
                        throw new Error ('Error fetching selected Pokémon')
                    }
                    const data =await response.json()

                    selectedPokemonData={
                        id:data.id,
                        name: data.name,
                        image: data.sprites.front_default
                    }

                    selectedPokemon.innerHTML=`
                        <img src="${data.sprites.front_default}" alt="${data.name}">
                        <p>${data.name}</p>
                    `
                    pokemonSearch.value=data.name
                    pokemonResults.innerHTML=''

                } catch (error) {
                    console.error('Error loading selected Pokémon:', error)
                }
            })
            pokemonResults.appendChild(result)
        })
    })
}