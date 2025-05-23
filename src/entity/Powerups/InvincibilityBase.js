//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Instances of the InvincibilityBase class.
 *
 * @constructor
 * @extends panicCity.entity.Powerups
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
 * The class for the basic Zombie, includes methods such as initStatus and movement logic
 */
panicCity.entity.InvincibilityBase = function (x, y, width, height, texture, game) {

    /**
     * The type of powerup
     * 
     * @type {string}
     * @public
     */
    this.type = "INVINCIBILITY_BASE";

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    panicCity.entity.Powerups.call(this, x, y, width, height, texture, game);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

panicCity.entity.InvincibilityBase.prototype = Object.create(panicCity.entity.Powerups.prototype);
panicCity.entity.InvincibilityBase.prototype.constructor = panicCity.entity.InvincibilityBase;

/**
 * Makes base invincible for 10 seconds
 * 
 * @param {Object} target - The target to be affected
 * 
 * @return {undefined}
 * @public
 */
panicCity.entity.InvincibilityBase.prototype.initPower = function (target) {
    panicCity.entity.Powerups.prototype.initPower.call(this);
    target.forEachMember(function (target) {
        target.changeHealthColor("#27dcf5");
        target.invincible = true;
        this.game.timers.create({
            duration: 10000,
            onComplete: function () {
                this.touchable = true;
                target.invincible = false;
                target.changeHealthColor("red");
            },
        });
        this.game.timers.create({
            duration: 8000,
            onComplete: function () {
                    target.initFlicker(2000, 150);
            }
        });
    }, this);
}