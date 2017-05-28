/*
 Prefab Class
*/
Prefab.all = {};
Prefab.count = 0;

function Prefab(game, x, y, image, frame, group) {
    Phaser.Sprite.call(this, game, x, y, image, frame, group);

    this.id = Prefab.count;
    this.position = {x: x, y: y};
    this.image = image;

    this.highlight = {
        hover: '0xfff401',
        default: '0xffffff'
    };

    // enable input
    this.inputEnabled = true;
    this.input.useHandCursor = true;

    // add click/touch event listeners
    this.events.onInputDown.add(this.click, this);

    // if desktop add hover/out listeners
    if(game.input.activePointer.isMouse) {
        this.events.onInputOver.add(this.inputOver, this);
        this.events.onInputOut.add(this.inputOut, this);
    }

    this.statsBar = null;

    Prefab.all[this.id] = this;
    Prefab.count ++;
}

Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Prefab.prototype.constructor = Prefab;

Prefab.prototype.update = function() {
    if(this.timer) {
        if(this.timer.event) {
            this.updateTimer();
        }
    }
};

Prefab.prototype.inputOver = function() {
    // highlight object on hover
    this.tint = this.highlight.hover;
};

Prefab.prototype.inputOut = function() {
    // remove highlight from object
    this.tint = this.highlight.default;
};

Prefab.prototype.click = function() {
    if(this.actions) {
        // show actions on click
        simulator.gui.showActions(this, this.position, this.actions);
    }
};

Prefab.prototype.createTimerEvent = function(minutes, seconds, autostart, callback) {
    // create timer event
    this.timer.clock = game.time.create();
    this.timer.event  = this.timer.clock.add(Phaser.Timer.MINUTE * minutes + Phaser.Timer.SECOND * seconds, callback, this);

    if(autostart) {
        this.timer.clock.start();
    }
};

Prefab.prototype.createTimerLoop = function(interval, callback, obj) {
    // create timer loop
    this.timer.loops.push(game.time.events.loop(interval, callback, obj));
};

Prefab.prototype.updateTimer = function() {
    // update timer bar progress
    var time = {};
    time.all = Math.round((this.timer.event.delay));
    time.left = Math.round((this.timer.event.delay - this.timer.clock.ms));
    time.passed = time.all - time.left;

    this.timer.progress = time.passed * 100 / time.all;
    this.timer.progress = this.timer.progress > 100 ? 100 : this.timer.progress;
};

Prefab.prototype.resetTimer = function() {
    // destroy timer
    this.timer.clock.remove(this.timer.event);
    this.timer.clock.destroy();

    this.timer.progress = 0;
};

Prefab.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
