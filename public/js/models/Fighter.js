export class Fighter {
    constructor({ 
        health = 100, 
        minDamage = 1,
        maxDamage = 2,
        AtkSpeed = 1000, 
        name = 'Fighter', 
        dodgeChance = 0.05, 
        critChance = 0.05, 
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
      const isCritical = Math.random() < this.critChance;
      
      // Random damage between min and max
      const baseDamage = this.minDamage + Math.random() * (this.maxDamage - this.minDamage)

      // If critical, multiply damage by critMultiplier (e.g. 1.5x)
      const finalDamage = Math.round(isCritical ? baseDamage * this.critMultiplier : baseDamage)

      return { damage: finalDamage, isCritical }
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