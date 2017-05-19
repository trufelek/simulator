/*
 Killing Station Class
*/
KillingStation.all = {};
KillingStation.count = 0;
KillingStation.ready = [];

function KillingStation(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.id = KillingStation.count;

    this.attributes = {
        stack: {
            max: 50,
            min: 0,
            current: 0,
            label: 'Ilość zwierząt',
            icon: 'kill_stock_icon',
            increase: 25,
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
        killed: 0
    };

    this.init();

    KillingStation.all[this.id] = this;
    KillingStation.ready.push(this);
    KillingStation.count ++;
}

KillingStation.prototype = Object.create(Prefab.prototype);
KillingStation.prototype.constructor = KillingStation;

KillingStation.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endKilling);

    // create timer loop
    this.createTimerLoop(500, this.updateKillingStation, this);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, true, true);
    this.statsBar.timerBar.alpha = 0;
    this.statsBar.attrsBar.alpha = 0;
};
KillingStation.prototype.updateKillingStation = function() {
    if(this.state.full) {
        this.killing();
    }
};


KillingStation.prototype.increaseKillStack = function() {
    // increase stack lvl
    if(this.attributes.stack.current + this.attributes.stack.increase <= this.attributes.stack.max) {
        this.attributes.stack.current += this.attributes.stack.increase;

        if(this.attributes.stack.current == this.attributes.stack.max) {
            this.state.full = true;
            KillingStation.ready.shift();
        }
    }
};

KillingStation.prototype.endKilling = function() {
    // decrease stack
    this.attributes.stack.current -= this.attributes.stack.decrease;

    // count killed animals
    this.stats.killed += this.attributes.stack.decrease;

    if(!this.attributes.stack.current && SkinningStation.ready.length) {
        this.state.full = false;

        if(KillingStation.ready.indexOf(this) == -1) {
            KillingStation.ready.unshift(this);

            // update skinnign stations
            SkinningStation.ready[0].increaseSkinStack();
        }
    }

    // stack carcass & furs in storage
    simulator.farm.carcassStorage.stackCarcass();

    // reset timer
    this.resetTimer();

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endKilling);
};

KillingStation.prototype.killing = function() {
    if(this.attributes.stack.current && !simulator.farm.carcassStorage.state.full) {
        this.timer.clock.start();
    }
};
