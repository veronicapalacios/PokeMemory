import './style.css'
import { renderProfile,initProfile } from './profile.js'
import { getProfile } from './storage.js'
import { renderGame } from './game.js'

const response = getProfile()

if (response.status && response.profile) {
  renderGame(response.profile)
} else {
  renderProfile()
  initProfile()
}