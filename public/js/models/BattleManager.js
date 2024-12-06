import { Fighter } from './Fighter.js'
import { Battle } from './Battle.js'

/**
 * Manages the creation and execution of battles
 */
export class BattleManager {
    /**
     * Creates a new pair of fighters with predefined stats
     * @returns {{ fighter1: Fighter, fighter2: Fighter }}
     */
    createFighters() {
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

    /**
     * Starts a battle between two fighters
     * @param {Fighter} fighter1 The first fighter
     * @param {Fighter} fighter2 The second fighter
     * @returns {Array} Battle events
     */
    startBattle(fighter1, fighter2) {
        const battle = new Battle(fighter1, fighter2)
        return battle.start()
    }
} 