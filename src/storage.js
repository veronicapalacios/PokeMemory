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