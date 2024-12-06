export class Battle {
    constructor(fighter1, fighter2) {
        this.fighter1 = fighter1
        this.fighter2 = fighter2
        this.events = []
        this.stats = {
            fighter1: {
                totalDamage: 0,
                hits: 0,
                misses: 0,
                criticalHits: 0,
                damageReceived: 0
            },
            fighter2: {
                totalDamage: 0,
                hits: 0,
                misses: 0,
                criticalHits: 0,
                damageReceived: 0
            }
        }
    }

    start() {
        let nextAttack1 = 0
        let nextAttack2 = 0
        let lastAttackTime = 0
        
        while (this.fighter1.isAlive() && this.fighter2.isAlive()) {
            if (nextAttack1 <= nextAttack2) {
                lastAttackTime = nextAttack1
                this.handleAttack({
                    time: nextAttack1,
                    attacker: this.fighter1,
                    defender: this.fighter2,
                    attackerId: 1
                })
                nextAttack1 += this.fighter1.speed
            } else {
                lastAttackTime = nextAttack2
                this.handleAttack({
                    time: nextAttack2,
                    attacker: this.fighter2,
                    defender: this.fighter1,
                    attackerId: 2
                })
                nextAttack2 += this.fighter2.speed
            }
        }

        this.events.push(this.createEndEvent(lastAttackTime))
        return this.events
    }

    handleAttack({ time, attacker, defender, attackerId }) {
        const { damage, isCritical } = attacker.calculateDamage()
        const { dodged } = defender.takeDamage(damage)

        // Update stats
        const attackerStats = attackerId === 1 ? this.stats.fighter1 : this.stats.fighter2
        const defenderStats = attackerId === 1 ? this.stats.fighter2 : this.stats.fighter1

        if (dodged) {
            attackerStats.misses++
        } else {
            attackerStats.hits++
            attackerStats.totalDamage += damage
            defenderStats.damageReceived += damage
            if (isCritical) {
                attackerStats.criticalHits++
            }
        }

        // Record what happened
        this.events.push({
            time,
            type: 'attack',
            attacker: attackerId,
            attackerName: attacker.name,
            defenderName: defender.name,
            damage: damage,
            fighter1HP: this.fighter1.health,
            fighter2HP: this.fighter2.health,
            isCritical,
            dodged
        })
    }

    createEndEvent(time) {
        const winner = this.fighter1.isAlive() ? 1 : 2
        const winnerName = this.fighter1.isAlive() ? this.fighter1.name : this.fighter2.name
        
        return {
            time,
            type: 'end',
            fighter1HP: this.fighter1.health,
            fighter2HP: this.fighter2.health,
            winner,
            winnerName,
            stats: this.stats
        }
    }
}