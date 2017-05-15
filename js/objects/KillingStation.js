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
            current: 25,
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
    this.createTimerLoop(250, this.killing, this);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, true, true);
    this.statsBar.timerBar.alpha = 0;
    this.statsBar.attrsBar.alpha = 0;
};

KillingStation.prototype.update = function() {
    // update timer
    this.updateTimer();
};

KillingStation.prototype.updateActions = function() {
    // update actions
    //this.actions.kill.enabled = !simulator.farm.storage.state.full && this.state.full;
    this.actions.kill.enabled = this.state.full;
};

KillingStation.prototype.increaseKillStack = function() {
    // increase stack lvl
    if(this.attributes.stack.current + this.attributes.stack.increase < this.attributes.stack.max) {
        this.attributes.stack.current += this.attributes.stack.increase;

        if(this.attributes.stack.current == this.attributes.stack.max) {
            this.state.full = true;
        }
    }
};

KillingStation.prototype.kill = function() {
    // start killing clock
    //this.timer.clock.start();

    this.increaseKillStack();


    // disable kill action
    this.actions.kill.enabled = false;
};


KillingStation.prototype.endKilling = function() {
    // decrease stack
    this.attributes.stack.current --;

    // count killed animals
    this.stats.killed ++;


    // stack carcass & furs in storage
    simulator.farm.carcassStorage.stackCarcass();

    // reset timer
    this.resetTimer();

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endKilling);
};

KillingStation.prototype.killing = function() {
    if(this.attributes.stack.current) {
        this.timer.clock.start();
    }
};
