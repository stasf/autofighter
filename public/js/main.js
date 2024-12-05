import { Fighter } from './models/Fighter.js'
import { Battle } from './models/Battle.js'

document.addEventListener('DOMContentLoaded', () => {
    // Setup UI elements
    const f1Element = document.getElementById('fighter1')
    const f2Element = document.getElementById('fighter2')
    const timeline = document.querySelector('.timeline')

    function createFighters() {
        return {
            fighter1: new Fighter({ 
                name: 'Sean (rogue)',
                AtkSpeed: 600,
                minDamage: 6,
                maxDamage: 11,
                critChance: 0.2,
                critMultiplier: 1.8,
                dodgeChance: 0.05
            }),
            fighter2: new Fighter({ 
                name: 'Stas (tank)',
                health: 170, 
                AtkSpeed: 1000,
                minDamage: 7,
                maxDamage: 9,
                critChance: 0.05,
                critMultiplier: 1.5,
                dodgeChance: 0.2
            })
        }
    }

    function updateHealthBars(f1Health, f2Health, fighter1, fighter2) {
        const f1Percent = (f1Health / fighter1.maxHealth) * 100
        const f2Percent = (f2Health / fighter2.maxHealth) * 100
        
        f1Element.querySelector('.health-fill').style.width = `${f1Percent}%`
        f2Element.querySelector('.health-fill').style.width = `${f2Percent}%`
        
        // Update HP text
        f1Element.querySelector('.health-text').textContent = `${Math.round(f1Health)}/${fighter1.maxHealth}`
        f2Element.querySelector('.health-text').textContent = `${Math.round(f2Health)}/${fighter2.maxHealth}`
    }

    function createTimelineEvents(events, maxTime) {
        // Clear previous events
        timeline.innerHTML = ''

        events.forEach(event => {
            const eventElement = document.createElement('div')
            eventElement.className = 'event'
            eventElement.style.top = `${(event.time / maxTime) * 80}%`
            
            if (event.type === 'attack') {
                let message = `${event.attackerName} `
                if (event.dodged) {
                    message += `misses!`
                } else {
                    message += `hits for ${event.damage}`
                    if (event.isCritical) {
                        message += ` (CRITICAL!)`
                    }
                }
                eventElement.textContent = message
                eventElement.dataset.attacker = event.attacker
                if (event.isCritical) {
                    eventElement.dataset.critical = 'true'
                }
                if (event.dodged) {
                    eventElement.dataset.dodged = 'true'
                }
            } else {
                eventElement.textContent = `${event.winnerName} wins!`
                eventElement.dataset.type = 'end'
            }
            
            timeline.appendChild(eventElement)
        })
    }

    async function playBattle() {
        // Clear the timeline before starting new battle
        timeline.innerHTML = ''

        // Create new fighters for each battle
        const { fighter1, fighter2 } = createFighters()
        
        // Update fighter names in UI
        f1Element.querySelector('.name').textContent = fighter1.name
        f2Element.querySelector('.name').textContent = fighter2.name
        
        // Generate new battle events
        const battle = new Battle(fighter1, fighter2)
        const events = battle.start()
        const maxTime = events[events.length - 1].time

        // Reset health bars at start
        updateHealthBars(fighter1.maxHealth, fighter2.maxHealth, fighter1, fighter2)

        // Create and animate timeline events
        let currentF1HP = fighter1.maxHealth
        let currentF2HP = fighter2.maxHealth

        for (let i = 0; i < events.length; i++) {
            const event = events[i]
            
            // Create the event element
            const eventElement = document.createElement('div')
            eventElement.className = 'event'
            eventElement.style.top = `${(event.time / maxTime) * 80}%`
            
            if (event.type === 'attack') {
                let message = `${event.attackerName} `
                if (event.dodged) {
                    message += `misses!`
                } else {
                    message += `hits for ${event.damage}`
                    if (event.isCritical) {
                        message += ` (CRITICAL!)`
                    }
                    // Update current HP
                    currentF1HP = event.fighter1HP
                    currentF2HP = event.fighter2HP
                }
                eventElement.textContent = message
                eventElement.dataset.attacker = event.attacker
                if (event.isCritical) {
                    eventElement.dataset.critical = 'true'
                }
                if (event.dodged) {
                    eventElement.dataset.dodged = 'true'
                }
            } else {
                eventElement.textContent = `${event.winnerName} wins!`
                eventElement.dataset.type = 'end'
            }
            
            timeline.appendChild(eventElement)
            
            // Wait for the appropriate time before showing the event
            await new Promise(resolve => setTimeout(resolve, i === 0 ? 0 : events[i].time - events[i-1].time))
            
            // Show the event and update health
            eventElement.classList.add('active')
            updateHealthBars(currentF1HP, currentF2HP, fighter1, fighter2)
        }
    }

    // Add click handler for the play button
    document.getElementById('playButton').addEventListener('click', playBattle)

    // Start first battle
    playBattle()
}) 