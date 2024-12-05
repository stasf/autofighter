export class Fighter {
    constructor({ 
        health = 100, 
        minDamage = 8,
        maxDamage = 12,
        AtkSpeed = 1000, 
        name = 'Fighter', 
        dodgeChance = 0.1, 
        critChance = 0.15, 
        critMultiplier = 1.5
    } = {}) {
        this.health = health
        this.minDamage = minDamage
        this.maxDamage = maxDamage
        this.speed = AtkSpeed
        this.name = name
        this.maxHealth = health
        
        this.critChance = critChance
        this.critMultiplier = critMultiplier
        this.dodgeChance = dodgeChance
    }

    isAlive() {
        return this.health > 0
    }

    calculateDamage() {
        // Random damage between min and max
        let finalDamage = this.minDamage + Math.random() * (this.maxDamage - this.minDamage)
        
        // Critical hit check
        if (Math.random() < this.critChance) {
            finalDamage *= this.critMultiplier
            return { damage: Math.round(finalDamage), isCritical: true }
        }
        
        return { damage: Math.round(finalDamage), isCritical: false }
    }

    takeDamage(amount) {
        // Dodge check
        if (Math.random() < this.dodgeChance) {
            return { dodged: true }
        }
        
        this.health = Math.max(0, this.health - amount)
        return { dodged: false }
    }
}