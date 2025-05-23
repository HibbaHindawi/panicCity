/**
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * 
 * The Game Object, responsible for showing the game stage 
 */
panicCity.scene.Game = function () {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------

    rune.scene.Scene.call(this);

    /**
     * The total amount of score that has been collected
     * @public
     * @type {number}
     */
    this.score = 0;

    /**
     * Timer for score, used to call a method that gives points every 4 seconds
     * @public
     * @type {number}
     */
    this.scoreTime = 4000;

    /**
     * Timer for rescuees, used to call a method that spawns a NPC every 10 seconds
     * @public
     * @type {number}
     */
    this.rescueeTime = 10000;

    /**
     * Timer for powerups, used to call a method that spawns a powerup every 10 seconds
     * @public
     * @type {number}
     */
    this.powerupTime = 10000;

    /**
     * Flag to check if game is over
     * 
     * @public
     * @type {boolean}
     */
    this.ifGameover = false;

    /**
     * Flag to check if game is over
     * 
     * @public
     * @type {boolean}
     */
    this.ifGameoverHighscore = false;

    /**
     * Background music
     * 
     * @type {rune.media.Sound}
     * @private
     */
    this.m_music;

    /**
     * The base
     * 
     * @type {Object}
     * @public
     */
    this.base;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

panicCity.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
panicCity.scene.Game.prototype.constructor = panicCity.scene.Game;

/**
 * @inheritDoc
 */
panicCity.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    this.m_music = this.application.sounds.music.get("Game-background-music");
    this.m_music.play();
    this.m_music.loop = true;
    this.m_music.volume = 0.5;
    this.cameras.getCameraAt(0).fade.opacity = 1;
    this.cameras.getCameraAt(0).fade.in(1000);

    this.m_initBackground();
    this.m_initCamera();
    this.m_initUI();
    this.m_initScore();

    this.players = this.groups.create(this.stage);
    this.enemies = this.groups.create(this.stage);
    this.bullets = this.groups.create(this.stage);
    this.baseSta = this.groups.create(this.stage);
    this.projectiles = this.groups.create(this.stage);
    this.items = this.groups.create(this.stage);
    this.walls = this.groups.create(this.stage);
    this.humans = this.groups.create(this.stage);
    this.powerups = this.groups.create(this.stage);

    this.playerJesper = new panicCity.entity.Player(320, 128, 27, 26, "Player1-Sheet", this, 0, "UP", "DOWN", "LEFT", "RIGHT", "P", "O");
    this.playerHibba = new panicCity.entity.Player(140, 128, 27, 26, "Player2-Sheet", this, 1, "W", "S", "A", "D", "Q", "E");
    this.base = new panicCity.entity.Base(220, 128, 47, 47, "Base-Sheet", this);

    this.cameras.getCameraAt(0).targets.add(this.playerJesper);
    this.cameras.getCameraAt(0).targets.add(this.playerHibba);

    this.players.addMember(this.playerJesper);
    this.players.addMember(this.playerHibba);
    this.baseSta.addMember(this.base);

    this.collisionControl = new panicCity.managers.CollisionManager(this);
    this.waveManager = new panicCity.managers.WaveManager(this, this.cameras);
    this.rescueeSpawner = new panicCity.managers.RescueeSpawner(this);
    this.powerupSpawner = new panicCity.managers.PowerupSpawner(this);

    this.timers.create({
        duration: this.scoreTime,
        onComplete: function () {
            this.m_addScore();
        },
    });

    this.timers.create({
        duration: this.rescueeTime,
        onComplete: function () {
            this.spawnHuman();
        },
    });

    this.timers.create({
        duration: this.powerupTime,
        onComplete: function () {
            this.spawnPowerup();
        },
    });
};

/**
 * @inheritDoc
 */
panicCity.scene.Game.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);
    this.collisionControl.update();
    this.waveManager.updateSpawner();

    if (this.playerJesper.isDowned && this.playerHibba.isDowned) {
        this.checkHighscore();
    }
};

/**
 * @inheritDoc
 */
panicCity.scene.Game.prototype.dispose = function () {
    rune.scene.Scene.prototype.dispose.call(this);
};

/**
 * Initializes score
 * @private
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.m_initScore = function () {
    this.counter = new rune.ui.Counter(6, 8, 8, "Counter-Digit-Sheet");
    this.counter.spacing = 10;
    this.counter.y = 7;
    this.counter.x = this.application.screen.width - this.counter.width - 15;
    this.counter.value = this.score;

    var text = new rune.text.BitmapField("SCORE:", "Font");
    text.autoSize = true;
    text.x = this.application.screen.width - this.counter.width - text.width - 15;
    text.y = 7;

    this.cameras.getCameraAt(0).addChild(text);
    this.cameras.getCameraAt(0).addChild(this.counter);
}

/**
 * Initializes the UI
 * @private
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.m_initUI = function () {
    this.testHud = new rune.display.Graphic(0, 0, 400, 30, "UI");
    this.m_cameras.getCameraAt(0).addChild(this.testHud);
}

/**
 * Initializes the camera
 * @private
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.m_initCamera = function () {
    if (this.cameras.length == 0) {
        this.cameras.addCamera(this.cameras.createCamera());
    }
    this.m_camera = this.cameras.getCameraAt(0);
    this.m_camera.bounderies = new rune.geom.Rectangle(
        0,
        0,
        475,
        300
    );
};

/**
 * Initializes the background
 * @private
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.m_initBackground = function () {
    this.m_background = new rune.display.Graphic(
        0,
        0,
        475,
        300,
        "image_Background"
    );
    this.stage.addChild(this.m_background);
};

/**
 * Updates the score
 * 
 * @param {number} points The amount of points to be added to the score.
 * 
 * @public
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.updateScoretext = function (points) {
    this.score += points;
    this.counter.value = this.score;
}

/**
 * Adds points to the score
 * @private
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.m_addScore = function () {
    this.updateScoretext(1);
    this.timers.create({
        duration: this.scoreTime,
        onComplete: function () {
            this.m_addScore();
        },
    });
}

/**
 * Spawns a human
 * @private
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.spawnHuman = function () {
    this.rescueeSpawner.spawnRescuee();
    this.timers.create({
        duration: this.rescueeTime,
        onComplete: function () {
            this.spawnHuman();
        },
    });
}

/**
 * Spawns a powerup
 * @public
 * @returns {undefined}
 */
panicCity.scene.Game.prototype.spawnPowerup = function () {
    this.powerupSpawner.spawn();
    this.timers.create({
        duration: this.powerupTime,
        onComplete: function () {
            this.spawnPowerup();
        },
    });
}

panicCity.scene.Game.prototype.checkHighscore = function () {
    if (this.application.highscores.test(this.score) < 5 && this.application.highscores.test(this.score) != -1) {
        if (!this.ifGameoverHighscore) {
            this.ifGameoverHighscore = true;
            this.cameras.getCameraAt(0).fade.out(4000, function () {
                this.application.scenes.load([new panicCity.scene.VirtualKeyboard(this)]);
            }, this);
        }
    } else {
        if (!this.ifGameover) {
            this.ifGameover = true;
            this.cameras.getCameraAt(0).fade.out(4000, function () {
                this.application.scenes.load([new panicCity.scene.Gameover(this)]);
            }, this);
        }
    }
}