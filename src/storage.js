//Session storage
export function saveProfile (profile) {
    try {
        sessionStorage.setItem(`profile`, JSON.stringify(profile))
        return {status:true}
    } catch (e) {
        console.error(`Error saving profile: ${error.message}`)
        return {status: false}
    }
}

export function getProfile () {
    try {
        const profile = JSON.parse(sessionStorage.getItem(`profile`))
        return {status:true, profile: profile}
    } catch (e) {
        console.error(`Error reading profile: ${error.message}`)
        return {status:false}
    }
}

export function removeProfile() {
    try {
        sessionStorage.removeItem(`profile`)
        return {status:true}
    } catch (e) {
        console.error(`Error removing profile: ${error.message}`)
        return {status:false}
    }
}

//Local storage
export function getGameHistory() {
    try {
        const history = localStorage.getItem('gameHistory')
        if (history === null) {
            return []
        }
        return JSON.parse(history)
    } catch (error) {
        console.error('Error reading game history:', error)
        return []
    }
}

export function saveGameRresult (result) {
    try {
        const history = getGameHistory()
        history.push(result)
        localStorage.setItem('gameHistory', JSON.stringify(history))
    } catch (error) {
        console.error('Error saving game result:', error)
    }
}