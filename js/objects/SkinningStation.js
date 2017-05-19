/*
 Skinning Station Class
*/
SkinningStation.all = {};
SkinningStation.count = 0;
SkinningStation.ready = [];

function SkinningStation(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.id = SkinningStation.count;

    this.attributes = {
        stack: {
            max: 50,
            min: 0,
            current: 0,
            label: 'Ilość zwierząt',
            icon: 'kill_stock_icon',
            increase: 50,
            decrease: 2
        }
    };

    this.actions = {
        kill: {
            label: 'Ubój',
            icon: 'action_kill_icon',
            position: 'top',
            enabled: false,
            visible: true,
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
        loops: [],
        duration: { minutes: 0, seconds: 1 },
        progress: 0
    };

    this.stats = {
        skinned: 0
    };

    this.init();

    SkinningStation.all[this.id] = this;
    SkinningStation.ready.push(this);
    SkinningStation.count ++;
}

SkinningStation.prototype = Object.create(Prefab.prototype);
SkinningStation.prototype.constructor = SkinningStation;

SkinningStation.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endSkinning);

    // create timer loop
    this.createTimerLoop(Phaser.Timer.SECOND, this.skinning, this);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, true, true);
    this.statsBar.timerBar.alpha = 0;
    this.statsBar.attrsBar.alpha = 0;
};

SkinningStation.prototype.increaseSkinStack = function() {
    // increase stack lvl
    if(this.attributes.stack.current + this.attributes.stack.increase <= this.attributes.stack.max) {
        this.attributes.stack.current += this.attributes.stack.increase;

        if(this.attributes.stack.current == this.attributes.stack.max) {
            this.state.full = true;
            SkinningStation.ready.shift();
        }
    }
};

SkinningStation.prototype.endSkinning = function() {
    // decrease stack
    this.attributes.stack.current -= this.attributes.stack.decrease;

    // count killed animals
    this.stats.skinned += this.attributes.stack.decrease;

    if(!this.attributes.stack.current) {
        this.state.full = false;

        if(SkinningStation.ready.indexOf(this) == -1) {
            SkinningStation.ready.unshift(this);
        }
    }

    // stack carcass & furs in storage
    simulator.farm.furStorage.stackFur();

    // reset timer
    this.resetTimer();

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endSkinning);
};

SkinningStation.prototype.skinning = function() {
    if(this.attributes.stack.current && !simulator.farm.furStorage.state.full) {
        this.timer.clock.start();
    }
};
