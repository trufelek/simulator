function Skinning(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.attributes = {
        stack: {
            max: 100,
            min: 0,
            current: 0,
            label: 'Ilość zwierząt',
            icon: 'kill_stock_icon',
            increase: 25
        }
    };

    this.actions = {
        kill: {
            label: 'Ubój',
            icon: 'action_kill_icon',
            position: 'top',
            enabled: false,
            callback: this.kill,
            cost: 10000
        }
    };

    this.state = {
        ready: true,
        full: false
    };

    this.timer = {
        clock: null,
        event: null,
        loop: null
    };

    this.stats = {
        killed: 0
    };

    this.init();
}

Skinning.prototype = Object.create(Prefab.prototype);
Skinning.prototype.constructor = Skinning;

Skinning.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create timer
    this.createTimerEvent(this.timer.value.minutes, this.timer.value.seconds, true, this.endTimer);

};

Skinning.prototype.update = function() {
    // enable/disable actions
    this.updateActions();
};

Skinning.prototype.updateActions = function() {
    // update actions
    this.actions.kill.enabled = !simulator.farm.storage.state.full && this.state.full;
};

Skinning.prototype.endTimer = function() {
    // count killed animals
    this.stats.killed += this.attributes.stack.current;

    // stack carcass & furs in storage
    simulator.farm.storage.stack(this.attributes.stack.current);

    // reset slaughterhouse stack & timer
    this.attributes.stack.current = 0;
    this.state.full = false;
    this.resetTimer();
};

Skinning.prototype.increaseKillStack = function() {
    // increase stack lvl
    if(this.attributes.stack.current + this.attributes.stack.increase >= this.attributes.stack.max) {
        this.attributes.stack.current = this.attributes.stack.max;
        this.state.full = true;
    } else {
        this.attributes.stack.current += this.attributes.stack.increase;
    }
};

Skinning.prototype.kill = function(o) {
    // start killing clock
    o.timer.clock.start();

    // decrease owner cash
    simulator.farm.owner.cash -= o.actions.kill.cost;

    // disable kill action
    o.actions.kill.enabled = false;
};
