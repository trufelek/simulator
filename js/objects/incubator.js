Incubator.all = {};
Incubator.count = 0;
Incubator.incubated = [];

function Incubator(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.actions = {
        incubate: {
            label: 'Rozmnażanie',
            icon: 'action_incubate_icon',
            position: 'top',
            enabled: true,
            callback: this.incubate
        }
    }

    this.timer = {
        clock: null,
        event: null
    };

    Incubator.all[Incubator.count] = this;
    Incubator.count ++;

    this.init();
}

Incubator.prototype = Object.create(Prefab.prototype);
Incubator.prototype.constructor = Incubator;

Incubator.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // add click event
    this.events.onInputDown.add(this.click, this);

    // create timer
    this.createTimer();
};

Incubator.prototype.update = function() {
    // show/hide gui
    this.updateTooltip();
};

Incubator.prototype.updateTooltip = function() {
    // show info in tooltip on hover
    if(this.input.pointerOver()) {
        game.settings.gui.showTooltip(this.position, this.timer, null, null);
    }
};

Incubator.prototype.click = function() {
    // show actions
    game.settings.gui.showActions(this.id, this.position, this.actions);
};

Incubator.prototype.createTimer = function() {
    // create timer & timer event
    this.timer.clock = game.time.create();
    this.timer.event  = this.timer.clock.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 30, this.endTimer, this);
};

Incubator.prototype.incubate = function(o) {
    // disable incubate action
    o.actions.incubate.enabled = false;

    //start timer
    o.timer.clock.start();
};

Incubator.prototype.endTimer = function() {
    Incubator.incubated.push(this);
};

Incubator.prototype.resetTimer = function() {
    // destroy timer
    this.timer.clock.remove(this.timer.event);
    this.timer.clock.destroy();

    // create new timer
    this.createTimer();
};

Incubator.dismissAnimals = function() {
    // shift incubator from incubated incubators array
    var incubator = Incubator.incubated.shift();

    // set action incubate to enabled
    incubator.actions.incubate.enabled = true;
    incubator.resetTimer();
};