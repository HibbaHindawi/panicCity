//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Instances of the ZombieRanger class.
 *
 * @constructor
 * @extends panicCity.entity.Zombie
 *
 * @class
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {string} texture - texture resource
 * @param {rune.scene.Scene} game - The Game object
 * 
 * Class for Ranger zombie, includes methods such as initStatus and movement logic
 */
panicCity.entity.ZombieRanger = function (x, y, width, height, texture, game) {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    panicCity.entity.Zombie.call(this, x, y, width, height, texture, game);

    /**
     * Controls the delay of the throw attack.
     * 
     * @type {number}
     * @private
     */
    this.m_lastThrow = 0;

    /**
     * Cooldown for the zombies throw attacks.
     * 
     * @type {number}
     * @private
     */
    this.m_throwCoolDown = 2000;
    
    /**
     * Sound file for when projectile gets thrown
     * 
     * @type {rune.media.Sound}
     * @private
     */
    this.m_throwSound = this.application.sounds.sound.get("Throw-normal-attack");
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

panicCity.entity.ZombieRanger.prototype = Object.create(panicCity.entity.Zombie.prototype);
panicCity.entity.ZombieRanger.prototype.constructor = panicCity.entity.ZombieRanger;

/**
 * Initialize the ZombieRanger statistics.
 *
 * @return {undefined}
 * @private
 * 
 */
panicCity.entity.ZombieRanger.prototype.m_initStats = function () {
    panicCity.entity.Zombie.prototype.m_initStats.call(this);
    this.health = 20;
    this.damage = 10;
    this.acceleration = 0.4;
    this.speed = 0.3;
    this.velocity.max.x = 0.7;
    this.velocity.max.y = 0.7;
};

/**
 * Updates the zombieRangers inputs.
 *
 * @return {undefined}
 * @private
 * 
 */
panicCity.entity.ZombieRanger.prototype.m_updateInput = function () {
    if (!this.newTarget) {
        console.log("No target set: ", this.newTarget);
        return;
    }
    var dX = this.newTarget.x - this.x;
    var dY = this.newTarget.y - this.y;
    
    var currentPosition = new rune.geom.Point(this.centerX, this.centerY);
    var targetPosition = new rune.geom.Point(this.newTarget.centerX, this.newTarget.centerY);

    var distance = currentPosition.distance(targetPosition);

    var threshold = 80.0;

    if (!this.isAttacking && distance > threshold) {
        if (dY * dY > dX * dX) {
            if (dY > 0) {
                this.moveDown();
                this.direction = "DOWN";
            } else if (dY < 0) {
                this.moveUp();
                this.direction = "UP";
            }
        } else {
            if (dX > 0) {
                this.moveRight();
                this.direction = "SIDE";
            } else if (dX < 0) {
                this.moveLeft();
                this.direction = "SIDE";
            }
        }
    }else{
        this.m_throwAttack();
    }
};

/**
 * Initialize the animations. 
 *
 * @return {undefined}
 * @private
 * 
 */
panicCity.entity.ZombieRanger.prototype.m_initAnimations = function () {
    panicCity.entity.Zombie.prototype.m_initAnimations.call(this);
    this.animation.create("walk", [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
    this.animation.create("attack", [9, 10, 11, 12, 13], 8, true);
    this.animation.create("walkDown", [14, 15, 16, 17, 18], 8, true);
    this.animation.create("attackDown", [19, 20, 21, 22, 23, 24], 8, true);
    this.animation.create("walkUp", [25, 26, 27, 28, 29], 8, true);
    this.animation.create("attackUp", [30, 31, 32, 33, 34, 35], 8, true);
}; 

/**
 * Does a throwing attack to the closest target to the ZombieRanger.
 *
 * @return {undefined}
 * @private
 * 
 */
panicCity.entity.ZombieRanger.prototype.m_throwAttack = function () {
    if (!this.newTarget) {
        console.log("No target set: ", this.newTarget);
        return;
    }
    var now = Date.now();
    if (this.velocity.x == 0.0 && now > this.m_lastThrow) {
        this.animation.gotoAndPlay("attack");
        var projectile = new panicCity.entity.Projectile(5, 13, this, this.newTarget, 10, "image_Bottle", this.game);
        this.game.projectiles.addMember(projectile);

        this.m_throwSound.play(true);

        this.m_lastThrow = now + this.m_throwCoolDown;
    }
};