import './style.css'

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
const profileForm=document.querySelector('#profile-form')
profileForm.addEventListener('submit', (event)=>{
  event.preventDefault() //evita que navegador recargue pg al enviar form

  const username=document.querySelector('#username').value.trim()

  if (username.length<3 || username.length>15){
    alert('Username must be between 3 and 15 characters.')
    return 
  }
  alert(`Welcome, ${username}!`)
})

