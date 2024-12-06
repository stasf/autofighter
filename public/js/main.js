import { BattleManager } from './models/BattleManager.js'
import { BattleRenderer } from './models/BattleRenderer.js'

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        fighter1: document.getElementById('fighter1'),
        fighter2: document.getElementById('fighter2'),
        timeline: document.querySelector('.timeline'),
        playButton: document.getElementById('playButton')
    }

    const battleManager = new BattleManager()
    const battleRenderer = new BattleRenderer(elements.fighter1, elements.fighter2, elements.timeline)

    async function playBattle() {
        const { fighter1, fighter2 } = battleManager.createFighters()
        
        // Update fighter names in UI
        elements.fighter1.querySelector('.name').textContent = fighter1.name
        elements.fighter2.querySelector('.name').textContent = fighter2.name
        
        const events = battleManager.startBattle(fighter1, fighter2)
        await battleRenderer.renderBattle(events, fighter1, fighter2)
    }

    elements.playButton.addEventListener('click', playBattle)
    playBattle() // Start first battle
}) 