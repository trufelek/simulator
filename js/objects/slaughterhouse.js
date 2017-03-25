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

    this.init();
}

Slaughterhouse.prototype = Object.create(Prefab.prototype);
Slaughterhouse.prototype.constructor = Slaughterhouse;

Slaughterhouse.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create timer
    this.timer.clock = game.time.create();

    //create events
    this.timer.event  = this.timer.clock.add(Phaser.Timer.MINUTE * 2 + Phaser.Timer.SECOND * 30, this.endTimer, this);
};

Slaughterhouse.prototype.update = function() {
    if(this.input.pointerOver()) {
        // show info in tooltip
        var info = 'Ilość zwierząt do ubicia: ' + this.attributes.stack.current + ' / ' + this.attributes.stack.max;
        game.settings.gui.showTooltip(this.position, this.timer, this.attributes, info);
    }
};

Slaughterhouse.prototype.endTimer = function() {
    console.log('slaughterhouse is ready');
};

Slaughterhouse.prototype.increaseKillStack = function() {
    // increase stack lvl
    if(this.attributes.stack.current + this.attributes.stack.increase >= this.attributes.stack.max) {
        this.attributes.stack.current = this.attributes.stack.max;
        this.state.full = true;
    } else {
        this.attributes.stack.current += this.attributes.stack.increase;
    }
};
