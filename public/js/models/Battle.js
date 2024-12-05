export class Battle {
    constructor(fighter1, fighter2) {
        this.fighter1 = fighter1
        this.fighter2 = fighter2
        this.events = []
    }

    start() {
        let nextAttack1 = 0
        let nextAttack2 = 0
        
        while (this.fighter1.isAlive() && this.fighter2.isAlive()) {
            if (nextAttack1 <= nextAttack2) {
                this.handleAttack({
                    time: nextAttack1,
                    attacker: this.fighter1,
                    defender: this.fighter2,
                    attackerId: 1
                })
                nextAttack1 += this.fighter1.speed
            } else {
                this.handleAttack({
                    time: nextAttack2,
                    attacker: this.fighter2,
                    defender: this.fighter1,
                    attackerId: 2
                })
                nextAttack2 += this.fighter2.speed
            }
        }

        this.events.push(this.createEndEvent(Math.max(nextAttack1, nextAttack2)))
        return this.events
    }

    handleAttack({ time, attacker, defender, attackerId }) {
        // Calculate damage with possible crit
        const { damage, isCritical } = attacker.calculateDamage()
        
        // Check for dodge
        const { dodged } = defender.takeDamage(damage)

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
        return {
            time,
            type: 'end',
            fighter1HP: this.fighter1.health,
            fighter2HP: this.fighter2.health,
            winner: this.fighter1.isAlive() ? 1 : 2,
            winnerName: this.fighter1.isAlive() ? this.fighter1.name : this.fighter2.name
        }
    }
}