Cage.all = {};
Cage.count = 0;

function Cage(state, x, y, z, image) {
    Prefab.call(this, state, x, y, z, image);

    this.attributes = {
        hunger: {
            max: 100,
            min: 0,
            current: 100,
            label: 'hunger',
            icon: 'food_icon',
            decrease: 2,
            increase: 25
        },
        condition: {
            max: 100,
            min: 0,
            current: 100,
            label: 'condition',
            icon: 'condition_icon',
            decrease: 1,
            increase: 25
        }
    };

    this.state = {
        ready: false,
        ill: false,
        full: true
    };

    this.timer = {
        clock: null,
        event: null,
        loop: null
    };

    this.actions = {
        feed: {
            label: 'feed',
            icon: 'action_feed_icon',
            position: 'top',
            enabled: true,
            callback: this.feed
        },
        kill: {
            label: 'kill',
            icon: 'action_kill_icon',
            position: 'left',
            enabled: false,
            callback: this.kill
        },
        heal: {
            label: 'heal',
            icon: 'action_heal_icon',
            position: 'right',
            enabled: false,
            callback: this.heal
        }
    };

    Cage.count ++;
    Cage.all[this.id] = this;

    this.init();
}

Cage.prototype = Object.create(Prefab.prototype);
Cage.prototype.constructor = Cage;

Cage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    this.events.onInputDown.add(this.click, this);

    // create timer
    this.timer.clock = game.time.create();

    //create events
    this.timer.event  = this.timer.clock.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 10, this.endTimer, this);

    // set loop event
    this.timer.loop = game.time.events.loop(Phaser.Timer.SECOND, this.updateAttributes, this);

    //start timer
    this.timer.clock.start();

};

Cage.prototype.update = function() {
    if(this.input.pointerOver()) {
        // show info in tooltip
        game.settings.gui.showTooltip(this.position, this.timer, this.attributes);
    }

    this.debug();
};

Cage.prototype.click = function() {
    // show actions
    game.settings.gui.showActions(this.id, this.position, this.actions);
};


Cage.prototype.updateAttributes = function() {
    this.attributes.hunger.current -= this.attributes.hunger.current == this.attributes.hunger.min ? 0 : this.attributes.hunger.decrease;
    this.attributes.condition.current -= this.attributes.condition.current == this.attributes.condition.min ? 0 : this.attributes.condition.decrease;
};

Cage.prototype.feed = function(cage) {
    if(cage.attributes.hunger.current + cage.attributes.hunger.increase >= cage.attributes.hunger.max) {
        cage.attributes.hunger.current = cage.attributes.hunger.max;
    } else {
        cage.attributes.hunger.current += cage.attributes.hunger.increase
    }

    if(cage.attributes.condition.current + cage.attributes.condition.increase >= cage.attributes.condition.max) {
        cage.attributes.condition.current = cage.attributes.condition.max;
    } else {
        cage.attributes.condition.current += cage.attributes.condition.increase
    }
};

Cage.prototype.kill = function(cage) {
    console.log('kill');
};

Cage.prototype.heal = function(cage) {
    console.log('heal');
};

Cage.prototype.endTimer = function() {
    console.log('cage is ready');
    this.actions.kill.enabled = true;
};

Cage.prototype.debug = function() {
    game.debug.text('Cage hunger: ' + this.attributes.hunger.current + ' / ' + this.attributes.hunger.max, 15, 150);
    game.debug.text('Cage condition: ' + this.attributes.condition.current + ' / ' + this.attributes.condition.max, 15, 175);
    game.debug.text('Cage timer: ' + game.settings.gui.formatTime(Math.round((this.timer.event.delay - this.timer.clock.ms) / 1000)), 15, 200);
};
