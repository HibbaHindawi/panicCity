//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new Credits scene Object
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * 
 */
panicCity.scene.Credits = function () {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

panicCity.scene.Credits.prototype = Object.create(rune.scene.Scene.prototype);
panicCity.scene.Credits.prototype.constructor = panicCity.scene.Credits;

/**
 * @inheritDoc
 */
panicCity.scene.Credits.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    this.cameras.getCameraAt(0).fade.opacity = 1;
    this.cameras.getCameraAt(0).fade.in(1000);

    this.m_initBackground();
    this.m_initMenu();

    var credits = [
        "THE SOUND OF METAL-LESFM",
        "DARK WAVE SYNTH INSTRUMENTAL-NICKPANEK620",
        "HELP HELP 2-U/Q2B5LX2VQB",
        "ZOMBIE-VILCHES86"
    ];

    for (var i = 0; i < credits.length; i++) {
        var creditField = new rune.text.BitmapField(credits[i], "Font");
        creditField.autoSize = true;
        creditField.centerX = this.application.screen.centerX;
        creditField.y = 150 + i * 10;

        this.stage.addChild(creditField);
    }

};

/**
 * @inheritDoc
 */
panicCity.scene.Credits.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    this.m_updateInput(step);
};

/**
 * @inheritDoc
 */
panicCity.scene.Credits.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};

/**
 * Initializes the background
 * @private
 * @returns {undefined}
 */
panicCity.scene.Credits.prototype.m_initBackground = function () {
    this.m_background = new rune.display.Graphic(
        0,
        0,
        400,
        225,
        "image_Credits"
    );
    this.stage.addChild(this.m_background);
};

/**
 * Initialize the Menu.
 *
 * @return {undefined}
 * @private
 * 
 */
panicCity.scene.Credits.prototype.m_initMenu = function () {
    this.m_menu = new rune.ui.VTMenu({ resource: "Font", pointer: panicCity.components.Pointer });
    this.m_menu.onSelect(this.m_onMenuSelect, this);
    this.m_menu.add("BACK TO MENU");
    this.m_menu.centerX = this.cameras.getCameraAt(0).viewport.centerX;
    this.m_menu.y = 200;
    this.stage.addChild(this.m_menu);
};

/**
 * Handles the navigation on the menu.
 * @private
 * @returns {undefined}
 */
panicCity.scene.Credits.prototype.m_updateInput = function (step) {
    if (this.keyboard.justPressed("SPACE") || this.gamepads.justPressed(0)) {
        this.m_menu.select();
    }
};

/**
 * Handles routing for selecting on the menu.
 * 
 * @param {Object} elem The selected menu object.
 * 
 * @private
 * @returns {undefined}
 */
panicCity.scene.Credits.prototype.m_onMenuSelect = function (elem) {
    this.application.scenes.load([new panicCity.scene.Menu()])

};

