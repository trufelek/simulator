Cage.all = {};
Cage.count = 0;

function Cage(state, x, y, z, image) {
    Prefab.call(this, state, x, y, z, image);

    this.attributes = {
        feed: {
            max: 100,
            min: 0,
            current: 100,
            label: 'Poziom nakarmienia',
            icon: 'food_icon',
            decrease: 2,
            increase: 25
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
            callback: this.heal
        }
    };

    Cage.all[Cage.count] = this;
    Cage.count ++;

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
    this.timer.event  = this.timer.clock.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, this.endTimer, this);

    // set loop event
    this.timer.loop = game.time.events.loop(Phaser.Timer.SECOND, this.updateAttributes, this);

    //start timer
    this.timer.clock.start();

};

Cage.prototype.update = function() {
    if(this.input.pointerOver()) {
        // show info in tooltip
        game.settings.gui.showTooltip(this.position, this.timer, this.attributes, null);
    }

    this.debug();
};

Cage.prototype.click = function() {
    // show actions
    game.settings.gui.showActions(this.id, this.position, this.actions);
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

Cage.prototype.feed = function(o) {
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
    game.farm.foodStorage.consumeFood(food);

};

Cage.prototype.kill = function(o) {
    console.log('kill');
};

Cage.prototype.heal = function(o) {
    console.log('heal');
};

Cage.prototype.endTimer = function() {
    console.log('cage is ready');
    this.actions.kill.enabled = true;
};

Cage.prototype.debug = function() {
    game.debug.text('Cage feed: ' + this.attributes.feed.current + ' / ' + this.attributes.feed.max, 15, 150);
    game.debug.text('Cage condition: ' + this.attributes.condition.current + ' / ' + this.attributes.condition.max, 15, 175);
    game.debug.text('Cage timer: ' + game.settings.gui.formatTime(Math.round((this.timer.event.delay - this.timer.clock.ms) / 1000)), 15, 200);
};

Cage.changeActionStatus = function(action, status) {
    for(c in Cage.all) {
        var cage = Cage.all[c];
        cage.actions[action].enabled = status;
    }
};
