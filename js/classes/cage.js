Cage.all = {};
Cage.count = 0;

function Cage(game, x, y, image, frame, group, enabled, pavilion) {
    Prefab.call(this, game, x, y, image, frame, group);

    this.attributes = {
        feed: {
            max: 100,
            min: 0,
            current: 100,
            label: 'Poziom nakarmienia',
            icon: 'food_icon',
            decrease: 2,
            increase: 100
        },
        condition: {
            max: 100,
            min: 0,
            current: 100,
            label: 'Stan zwierząt',
            icon: 'condition_icon',
            decrease: 1,
            increase: 5
        }
    };

    this.actions = {
        default: {
            feed: {
                label: 'Nakarm',
                icon: 'action_feed_icon',
                position: 'top',
                enabled: true,
                callback: this.feed
            },
            kill: {
                label: 'Zabij',
                icon: 'action_kill_icon',
                position: 'left',
                enabled: false,
                callback: this.kill
            },
            heal: {
                label: 'Wylecz',
                icon: 'action_heal_icon',
                position: 'right',
                enabled: false,
                callback: this.heal,
                cost: 1000
            }
        },
        empty: {
            add: {
                label: 'Dodaj',
                icon: 'action_add_icon',
                position: 'top',
                enabled: false,
                callback: this.addAnimals
            }
        }
    };

    this.state = {
        ready: false,
        ill: false,
        enabled: enabled
    };

    this.timer = {
        clock: null,
        event: null,
        loop: null
    };

    this.pavilionId = pavilion;
    this.pavilion = null;

    Cage.all[Cage.count] = this;
    Cage.count ++;

    this.init();
}

Cage.prototype = Object.create(Prefab.prototype);
Cage.prototype.constructor = Cage;

Cage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // add click event
    this.events.onInputDown.add(this.click, this);
    this.input.priorityID = 1;

    // create timer
    this.createTimer();
};

Cage.prototype.update = function() {
    // show/hide gui
   this.updateTooltip();

    // enable/disable actions
    this.updateActions();
};

Cage.prototype.updateTooltip = function() {
    // show info in tooltip on hover
    if(this.input.pointerOver()) {
        if(this.state.enabled) {
            simulator.gui.showTooltip(this.position, this.timer, this.attributes, null);
        } else {
            var info = 'Ta klatka jest pusta.';
            simulator.gui.showTooltip(this.position, null, null, info);
        }
    }
};

Cage.prototype.inputOver = function() {
    // tint cage on hover
    this.tint = this.highlight_tint;

    // hide pavilion on hover
    this.pavilion.alpha = 0;
};

Cage.prototype.inputOut = function() {
    // remove highlight from object
    this.tint = this.default_tint;

    // hide tooltip
    simulator.gui.destroyTooltip();

    // show pavilion on out
    this.pavilion.alpha = 1;
};

Cage.prototype.updateActions = function() {
    // update actions
    //this.actions.default.feed.enabled = !simulator.farm.foodStorage.state.empty;
    //this.actions.default.kill.enabled = !simulator.farm.slaughterhouse.state.full && this.state.ready;
    //this.actions.empty.add.enabled = Incubator.incubated.length;
};

Cage.prototype.updateAttributes = function() {
    // decrease feed lvl
    if(this.attributes.feed.current - this.attributes.feed.decrease <= this.attributes.feed.min) {
        this.attributes.feed.current = this.attributes.feed.min;
    } else {
        this.attributes.feed.current -= this.attributes.feed.decrease
    }

    // decrease condition lvl
    if(this.attributes.condition.current - this.attributes.condition.decrease <= this.attributes.condition.min) {
        this.attributes.condition.current = this.attributes.condition.min;
    } else {
        this.attributes.condition.current -= this.attributes.condition.decrease
    }
};

Cage.prototype.click = function() {
    // check if cage is enabled
    if(this.state.enabled) {
        // show enabled state actions
        simulator.gui.showActions(this.id, this.position, this.actions.default);
    } else {
        // show disabled state actions
        simulator.gui.showActions(this.id, this.position, this.actions.empty);
    }
};

Cage.prototype.createTimer = function() {
    // check if cage is enabled
    if(!this.state.enabled) return false;

    // create timer & timer event & timer loop
    this.timer.clock = game.time.create();
    this.timer.event  = this.timer.clock.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 30, this.endTimer, this);
    this.timer.loop = game.time.events.loop(Phaser.Timer.SECOND, this.updateAttributes, this);

    //start timer
    this.timer.clock.start();
};

Cage.prototype.destroyTimer = function() {
    // remove events & destroy timer
    this.timer.clock.remove(this.timer.event);
    game.time.events.remove(this.timer.loop);
    this.timer.clock.destroy();

    // reset timer values
    this.timer.clock = null;
    this.timer.event = null;
    this.timer.loop = null;
};

Cage.prototype.feed = function(o) {
    // feed action
    var food = 0;

    // increase feed lvl
    if(o.attributes.feed.current + o.attributes.feed.increase >= o.attributes.feed.max) {
        food = o.attributes.feed.max - o.attributes.feed.current;
        o.attributes.feed.current = o.attributes.feed.max;
    } else {
        food = o.attributes.feed.increase;
        o.attributes.feed.current += o.attributes.feed.increase;
    }

    // increase condition lvl
    if(o.attributes.condition.current + o.attributes.condition.increase >= o.attributes.condition.max) {
        o.attributes.condition.current = o.attributes.condition.max;
    } else {
        o.attributes.condition.current += o.attributes.condition.increase
    }

    // decrease food lvl in food store
    simulator.farm.foodStorage.consumeFood(food);
};

Cage.prototype.kill = function(o) {
    // kill action
    simulator.farm.slaughterhouse.increaseKillStack();
    o.emptyCage();
    o.destroyTimer();
};

Cage.prototype.heal = function(o) {
    // heal action
    console.log('heal');
};

Cage.prototype.addAnimals = function(o) {
    // release incubator from incubated array
    Incubator.dismissAnimals();

    // enable cage & set timer
    o.state.enabled = true;
    o.createTimer();
};

Cage.prototype.emptyCage = function() {
    // reset current cage
    this.state.enabled = false;
    this.attributes.feed.current = this.attributes.feed.max;
    this.attributes.condition.current = this.attributes.condition.max;
};

Cage.prototype.endTimer = function() {
    // cage ready to kill
    this.actions.default.kill.enabled = true;
    this.state.ready = true;
};

Cage.prototype.debug = function() {
    // debug cage info
    game.debug.text('Cage feed: ' + this.attributes.feed.current + ' / ' + this.attributes.feed.max, 15, 150);
    game.debug.text('Cage condition: ' + this.attributes.condition.current + ' / ' + this.attributes.condition.max, 15, 175);
    game.debug.text('Cage timer: ' + simulator.gui.formatTime(Math.round((this.timer.event.delay - this.timer.clock.ms) / 1000)), 15, 200);
};
