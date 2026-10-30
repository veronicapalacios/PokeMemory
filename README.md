# 🎮 PokeMemory

### Pokémon Memory Game

**Find the pairs. Beat the clock. Improve your ranking!**

PokeMemory is a Pokémon-themed Memory game developed as part of the Web Application Development (DAW) course. The objective is to find all matching Pokémon pairs in the shortest time possible.

Players can create their own profile, choose their favourite Pokémon, customise the number of cards and compete to achieve the best results.

---

## 🌐 Live Demo

[Play PokeMemory](YOUR_DEPLOYED_APP_URL)

## 🎥 Video Demonstration

[Watch the project demonstration](YOUR_YOUTUBE_VIDEO_URL)

---

## ✨ Features

- **Player Profile:** Create a profile using a username and a favourite Pokémon.
- **Pokémon Search:** Search for Pokémon and select one as your favourite using data from PokeAPI.
- **Session Persistence:** Keep the active player session when reloading the page.
- **Custom Game Setup:** Choose the number of cards before starting a game.
- **Memory Game:** Find matching Pokémon pairs by selecting two cards at a time.
- **Game Timer:** Track the time taken to complete each game.
- **Game Feedback:** Receive visual feedback during gameplay.
- **Restart Game:** Restart the current game whenever needed.
- **Persistent Ranking:** Save completed games and keep the results using localStorage.
- **Ranking System:** Compare players' results, prioritising games with more cards and, in case of a tie, the shortest completion time.
- **Responsive Design:** Adapt the interface to desktop, tablet and mobile screens.

---

## 🛠️ Technologies Used

- **HTML5** — Application structure.
- **CSS3** — Styling, layouts and responsive design.
- **JavaScript (ES6+)** — Game logic, events and DOM manipulation.
- **Vite** — Development environment and build tool.
- **PokeAPI** — Pokémon data and images.
- **Fetch API** — Asynchronous requests to retrieve Pokémon information.
- **Web Storage API** — `sessionStorage` for session management and `localStorage` for ranking persistence.
- **ESLint** — JavaScript code quality and consistency.

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/veronicapalacios/PokeMemory.git
```

2. Navigate to the project folder:

```bash
cd PokeMemory
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

### Production Build

To generate the production build, run:

```bash
npm run build
```

---

## 📡 API

Pokémon information and images are retrieved from [PokeAPI](https://pokeapi.co/).

The application uses the Fetch API to make asynchronous HTTP requests and obtain the Pokémon data required for the game.

---

## 👩‍💻 Author

**Verónica Palacios**

Web Application Development (DAW) student.

---

*Made with JavaScript and a little Pokémon magic ⚡*
