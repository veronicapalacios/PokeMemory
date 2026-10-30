import { getGameHistory } from "./storage.js"

export function renderGameHistory() {
    const gameHistory = document.querySelector('#game-history')
    const response = getGameHistory()
    gameHistory.innerHTML=''
    const latestGame = [...response].sort((a,b) => b.id - a.id)[0]

    response. sort ((a,b) => {
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

    topGames.forEach((result) => {
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
