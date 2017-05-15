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
    this.highlight_tint = '0xfff401';
    this.default_tint = '0xffffff';

    // enable input
    this.inputEnabled = true;
    this.input.useHandCursor = true;

    // add event listeners
    this.events.onInputDown.add(this.click, this);
    this.events.onInputOver.add(this.inputOver, this);
    this.events.onInputOut.add(this.inputOut, this);

    this.statsBar = null;

    Prefab.all[this.id] = this;
    Prefab.count ++;
}

Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Prefab.prototype.constructor = Prefab;

Prefab.prototype.inputOver = function() {
    // highlight object on hover
    this.tint = this.highlight_tint;
};

Prefab.prototype.inputOut = function() {
    // remove highlight from object
    this.tint = this.default_tint;
};

Prefab.prototype.click = function() {
    if(this.actions) {
        // show actions
        simulator.gui.showActions(this.id, this.position, this.actions);
    }
};

Prefab.prototype.createTimerEvent = function(minutes, seconds, autostart, callback) {
    // timer event
    this.timer.clock = game.time.create();
    this.timer.event  = this.timer.clock.add(Phaser.Timer.MINUTE * minutes + Phaser.Timer.SECOND * seconds, callback, this);

    if(autostart) {
        //start timer
        this.timer.clock.start();
    }
};

Prefab.prototype.createTimerLoop = function(interval, callback, obj) {
    // create timer loop
    this.timer.loops.push(game.time.events.loop(interval, callback, obj));
};

Prefab.prototype.updateTimer = function() {
    var time = {};

    time.all = Math.round((this.timer.event.delay) / 1000);
    time.left = Math.round((this.timer.event.delay - this.timer.clock.ms) / 1000);
    time.passed = time.all - time.left;

    // timer bar progress
    this.timer.progress = time.passed * 100 / time.all;
};

Prefab.prototype.resetTimer = function() {
    // destroy timer
    this.timer.clock.remove(this.timer.event);
    this.timer.clock.destroy();
};

Prefab.prototype.destroyTimer = function() {
    // remove events & destroy timer
    this.timer.clock.remove(this.timer.event);
    game.time.events.remove(this.timer.loop);
    this.timer.clock.destroy();

    // reset timer values
    this.timer.clock = null;
    this.timer.event = null;
    this.timer.loop = null;
};
