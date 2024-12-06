export class BattleRenderer {
    constructor(f1Element, f2Element, timeline) {
        this.f1Element = f1Element
        this.f2Element = f2Element
        this.timeline = timeline
        this.currentF1HP = 0
        this.currentF2HP = 0
        this.maxVisibleEvents = 15
        this.eventSpacing = 4
        
        // Add resize observer to detect stacked layout
        this.setupLayoutDetection()
    }

    setupLayoutDetection() {
        const fightersContainer = document.querySelector('.fighters')
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const isStacked = entry.contentRect.width < 600
                fightersContainer.dataset.stacked = isStacked
            }
        })
        observer.observe(fightersContainer)
    }

    updateHealthBars(f1Health, f2Health, fighter1, fighter2) {
        const f1Percent = (f1Health / fighter1.maxHealth) * 100
        const f2Percent = (f2Health / fighter2.maxHealth) * 100
        
        this.f1Element.querySelector('.health-fill').style.width = `${f1Percent}%`
        this.f2Element.querySelector('.health-fill').style.width = `${f2Percent}%`
        
        this.f1Element.querySelector('.health-text').textContent = `${Math.round(f1Health)}/${fighter1.maxHealth}`
        this.f2Element.querySelector('.health-text').textContent = `${Math.round(f2Health)}/${fighter2.maxHealth}`
    }

    adjustEventPositions() {
        const events = Array.from(this.timeline.children)
            .filter(el => !el.classList.contains('battle-stats'))

        const totalHeight = 80
        const spacing = Math.min(this.eventSpacing, totalHeight / Math.max(events.length, 1))
        
        events.forEach((event, index) => {
            event.style.top = `${index * spacing}%`
        })
    }

    renderStats(stats, fighter1, fighter2, container) {
        const statsElement = document.createElement('div')
        statsElement.className = 'battle-stats'
        
        const f1Stats = stats.fighter1
        const f2Stats = stats.fighter2
        
        statsElement.innerHTML = `
            <div class="stats-container">
                <div class="fighter-stats">
                    <h3>${fighter1.name}</h3>
                    <p>Damage Dealt: ${f1Stats.totalDamage}</p>
                    <p>Hits: ${f1Stats.hits}</p>
                    <p>Misses: ${f1Stats.misses}</p>
                    <p>Critical Hits: ${f1Stats.criticalHits}</p>
                    <p>Damage Received: ${f1Stats.damageReceived}</p>
                    <p>Accuracy: ${Math.round((f1Stats.hits / (f1Stats.hits + f1Stats.misses)) * 100)}%</p>
                    <p>Crit Rate: ${Math.round((f1Stats.criticalHits / f1Stats.hits) * 100)}%</p>
                </div>
                <div class="fighter-stats">
                    <h3>${fighter2.name}</h3>
                    <p>Damage Dealt: ${f2Stats.totalDamage}</p>
                    <p>Hits: ${f2Stats.hits}</p>
                    <p>Misses: ${f2Stats.misses}</p>
                    <p>Critical Hits: ${f2Stats.criticalHits}</p>
                    <p>Damage Received: ${f2Stats.damageReceived}</p>
                    <p>Accuracy: ${Math.round((f2Stats.hits / (f2Stats.hits + f2Stats.misses)) * 100)}%</p>
                    <p>Crit Rate: ${Math.round((f2Stats.criticalHits / f2Stats.hits) * 100)}%</p>
                </div>
            </div>
        `
        
        container.appendChild(statsElement)
    }

    async processEvent(event, maxTime, fighter1, fighter2, container) {
        if (event.type === 'attack') {
            const eventElement = document.createElement('div')
            eventElement.className = 'event'

            let message = `${event.attackerName} `
            if (event.dodged) {
                message += `misses!`
            } else {
                message += `hits for ${event.damage}`
                if (event.isCritical) {
                    eventElement.dataset.critical = 'true'
                }
                
                // Get the attacker and target elements
                const attackerElement = event.attacker === 1 ? this.f1Element : this.f2Element
                const targetElement = event.attacker === 1 ? this.f2Element : this.f1Element
                
                // Get the attacker's speed for animation duration
                const attacker = event.attacker === 1 ? fighter1 : fighter2
                const animationDuration = Math.min(attacker.speed, 300) // Cap animation at 300ms
                
                // Set animation duration dynamically
                attackerElement.style.animationDuration = `${animationDuration/1000}s`
                targetElement.style.animationDuration = `${animationDuration/1000}s`
                
                // Add animation classes
                attackerElement.classList.add('attacking')
                targetElement.classList.add('getting-hit')
                
                // Wait for animation to complete
                await new Promise(resolve => setTimeout(resolve, animationDuration))
                
                // Remove animation classes
                attackerElement.classList.remove('attacking')
                targetElement.classList.remove('getting-hit')
                // Reset animation duration
                attackerElement.style.animationDuration = ''
                targetElement.style.animationDuration = ''
                
                // Update current HP
                this.currentF1HP = event.fighter1HP
                this.currentF2HP = event.fighter2HP
                this.updateHealthBars(this.currentF1HP, this.currentF2HP, fighter1, fighter2)
            }
            eventElement.textContent = message
            eventElement.dataset.attacker = event.attacker
            if (event.dodged) eventElement.dataset.dodged = 'true'

            // Remove oldest event if we have too many
            if (this.timeline.children.length >= this.maxVisibleEvents) {
                this.timeline.firstElementChild.remove()
            }

            // Add new event and adjust positions
            this.timeline.appendChild(eventElement)
            this.adjustEventPositions()
            eventElement.classList.add('active')
        } else {
            // Clear and hide the timeline
            this.timeline.innerHTML = ''
            this.timeline.style.display = 'none'
            
            // Show the battle stats with winner announcement included
            const statsElement = document.createElement('div')
            statsElement.className = 'battle-stats'
            
            const f1Stats = event.stats.fighter1
            const f2Stats = event.stats.fighter2
            
            statsElement.innerHTML = `
                <h2 class="battle-result ${event.winner === 0 ? 'draw' : ''}">${event.winner === 0 ? "Draw!" : `${event.winnerName} wins!`}</h2>
                <div class="stats-container">
                    <div class="fighter-stats">
                        <h3>${fighter1.name}</h3>
                        <p>Damage Dealt: ${f1Stats.totalDamage}</p>
                        <p>Hits: ${f1Stats.hits}</p>
                        <p>Misses: ${f1Stats.misses}</p>
                        <p>Critical Hits: ${f1Stats.criticalHits}</p>
                        <p>Damage Received: ${f1Stats.damageReceived}</p>
                        <p>Accuracy: ${Math.round((f1Stats.hits / (f1Stats.hits + f1Stats.misses)) * 100)}%</p>
                        <p>Crit Rate: ${Math.round((f1Stats.criticalHits / f1Stats.hits) * 100)}%</p>
                    </div>
                    <div class="fighter-stats">
                        <h3>${fighter2.name}</h3>
                        <p>Damage Dealt: ${f2Stats.totalDamage}</p>
                        <p>Hits: ${f2Stats.hits}</p>
                        <p>Misses: ${f2Stats.misses}</p>
                        <p>Critical Hits: ${f2Stats.criticalHits}</p>
                        <p>Damage Received: ${f2Stats.damageReceived}</p>
                        <p>Accuracy: ${Math.round((f2Stats.hits / (f2Stats.hits + f2Stats.misses)) * 100)}%</p>
                        <p>Crit Rate: ${Math.round((f2Stats.criticalHits / f2Stats.hits) * 100)}%</p>
                    </div>
                </div>
            `
            
            container.appendChild(statsElement)
        }
    }

    async renderBattle(events, fighter1, fighter2) {
        // Create battle container if it doesn't exist
        let battleContainer = document.querySelector('.battle-container')
        if (!battleContainer) {
            battleContainer = document.createElement('div')
            battleContainer.className = 'battle-container'
            this.timeline.parentNode.insertBefore(battleContainer, this.timeline)
            battleContainer.appendChild(this.timeline)
        } else {
            // Clear existing battle stats
            const existingStats = battleContainer.querySelector('.battle-stats')
            if (existingStats) {
                existingStats.remove()
            }
        }

        // Show and clear the timeline at start
        this.timeline.style.display = 'block'
        this.timeline.innerHTML = ''
        
        this.currentF1HP = fighter1.maxHealth
        this.currentF2HP = fighter2.maxHealth
        
        const maxTime = events[events.length - 1].time
        this.updateHealthBars(fighter1.maxHealth, fighter2.maxHealth, fighter1, fighter2)

        for (let i = 0; i < events.length; i++) {
            const event = events[i]
            const timeSinceLastEvent = i === 0 ? 0 : events[i].time - events[i-1].time
            await new Promise(resolve => setTimeout(resolve, timeSinceLastEvent))
            await this.processEvent(event, maxTime, fighter1, fighter2, battleContainer)
        }
    }
} 