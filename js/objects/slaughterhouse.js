function Slaughterhouse(game, x, y, z, image, group) {
    Prefab.call(this, game, x, y, z, image, group);

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

    this.state = {
        ready: true,
        full: false
    };

    this.timer = {
        clock: null,
        event: null,
        loop: null
    };

    this.actions = {
        kill: {
            label: 'Ubój',
            icon: 'action_kill_icon',
            position: 'top',
            enabled: false,
            callback: this.kill
        }
    };

    this.stats = {
        killed: 0
    };

    this.init();
}

Slaughterhouse.prototype = Object.create(Prefab.prototype);
Slaughterhouse.prototype.constructor = Slaughterhouse;

Slaughterhouse.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // add click event
    this.events.onInputDown.add(this.click, this);

    // create timer
    this.createTimer();

};

Slaughterhouse.prototype.createTimer = function() {
    // create timer
    this.timer.clock = game.time.create();

    //create events
    this.timer.event = this.timer.clock.add(Phaser.Timer.MINUTE * 0 + Phaser.Timer.SECOND * 30, this.endTimer, this);
};

Slaughterhouse.prototype.resetTimer = function() {
    // destroy timer
    this.timer.clock.remove(this.timer.event);
    this.timer.clock.destroy();

    this.createTimer();
};

Slaughterhouse.prototype.update = function() {
    if(this.input.pointerOver()) {
        // show info in tooltip
        var info = 'Ilość zwierząt do ubicia: ' + this.attributes.stack.current + ' / ' + this.attributes.stack.max + '\n';
        info += 'Suma zabitych zwierząt: ' + this.stats.killed;
        game.settings.gui.showTooltip(this.position, this.timer, this.attributes, info);
    }
};

Slaughterhouse.prototype.click = function() {
    // show actions
    game.settings.gui.showActions(this.id, this.position, this.actions);
};

Slaughterhouse.prototype.endTimer = function() {
    console.log('slaughterhouse is ready');
    this.stats.killed += this.attributes.stack.current;
    this.attributes.stack.current = 0;
    this.state.full = false;
    this.resetTimer();
};

Slaughterhouse.prototype.increaseKillStack = function() {
    // increase stack lvl
    if(this.attributes.stack.current + this.attributes.stack.increase >= this.attributes.stack.max) {
        this.attributes.stack.current = this.attributes.stack.max;
        this.state.full = true;
        this.actions.kill.enabled = true;
    } else {
        this.attributes.stack.current += this.attributes.stack.increase;
    }
};

Slaughterhouse.prototype.kill = function(o) {
    console.log('kill animals');
    o.timer.clock.start();
    o.actions.kill.enabled = false;
};
