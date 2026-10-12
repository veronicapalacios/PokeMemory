import './style.css'
import { renderProfile,initProfile } from './profile.js'
import { getProfile } from './storage.js'

renderProfile()
initProfile()

const response = getProfile()

if (response.status && response.profile) {
  console.log(`Session found:`, response.profile)
} else {
  console.log ('No active session found')
}