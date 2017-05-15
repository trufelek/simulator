/*
 Cage Class
*/
Cage.all = {};
Cage.count = 0;

function Cage(game, x, y, image, frame, group, enabled, pavilion) {
    Prefab.call(this, game, x, y, image, frame, group);

    this.attributes = {
        condition: {
            max: 100,
            min: 0,
            current: enabled ? 100 : 0,
            label: 'Stan zwierząt',
            icon: 'condition_icon',
            min_decrease: 1,
            max_decrease: 5
        }
    };

    this.actions = {
        kill: {
            label: 'Zabij',
            icon: 'action_kill_icon',
            position: 'top',
            enabled: false,
            visible: enabled,
            callback: this.kill
        },
        heal: {
            label: 'Wylecz',
            icon: 'action_heal_icon',
            position: 'right',
            enabled: false,
            visible: false,
            callback: this.heal,
            cost: 1000
        },
        add: {
            label: 'Dodaj',
            icon: 'action_add_icon',
            position: 'top',
            enabled: false,
            visible: enabled ? false : true,
            callback: this.addAnimals
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
        loops: [],
        duration: { minutes: 0, seconds: 30 },
        progress: 0
    };

    this.eatingAmount = 1;

    this.pavilionId = pavilion;
    this.pavilion = null;
    this.statsBar = null;

    Cage.all[Cage.count] = this;
    Cage.count ++;

    this.init();
}

Cage.prototype = Object.create(Prefab.prototype);
Cage.prototype.constructor = Cage;

Cage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    if(this.state.enabled) {
        // create timer
        this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, true, this.cageReady);

        // create timer loop
        this.createTimerLoop(Phaser.Timer.SECOND, this.updateAttributes, this);
        this.createTimerLoop(Phaser.Timer.SECOND, this.eatingFood, this);
    }

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, true, true);
    this.statsBar.timerBar.alpha = 0;
    this.statsBar.attrsBar.alpha = 0;
};

Cage.prototype.update = function() {
    // enable/disable actions
    this.updateActions();

    if(this.state.enabled) {
        // update timer
        this.updateTimer();
    }
};

Cage.prototype.updateActions = function() {
    // update actions
    //this.actions.default.kill.enabled = !simulator.farm.slaughterhouse.state.full && this.state.ready;
    this.actions.add.enabled = Incubator.incubated.length;
};

Cage.prototype.updateAttributes = function() {
    // if there is no food decrease condition faster
    var decrease = simulator.farm.foodStorage.state.empty ? this.attributes.condition.max_decrease : this.attributes.condition.min_decrease;

    // decrease condition lvl
    if(this.attributes.condition.current - decrease <= this.attributes.condition.min) {
        this.attributes.condition.current = this.attributes.condition.min;
    } else {
        this.attributes.condition.current -= decrease;
    }
};

Cage.prototype.eatingFood = function() {
    // decrease food lvl in food store
    simulator.farm.foodStorage.consumeFood(this.eatingAmount);
};

Cage.prototype.kill = function(o) {
    // kill action
    //simulator.farm.slaughterhouse.increaseKillStack();

    o.emptyCage();
    o.destroyTimer();
};

Cage.prototype.heal = function(o) {
    // heal action
    console.log('heal');
};

Cage.prototype.addAnimals = function(cage) {
    // release incubator from incubated array
    Incubator.dismissAnimals();

    // enable cage & set timer
    cage.state.enabled = true;

    // set attributes to max
    cage.attributes.condition.current = cage.attributes.condition.max;

    //update actions
    cage.actions.add.visible = false;
    cage.actions.kill.visible = true;

    // create timer
    cage.createTimerEvent(cage.timer.duration.minutes, cage.timer.duration.seconds, true, cage.cageReady);
};

Cage.prototype.emptyCage = function() {
    // reset current cage
    this.state.enabled = false;

    // set attributes to max
    this.attributes.condition.current = this.attributes.condition.max;

    //update actions
    this.actions.add.visible = true;
    this.actions.kill.visible = false;
};

Cage.prototype.cageReady = function() {
    // cage ready to kill
    this.actions.kill.enabled = true;
    this.state.ready = true;
};
