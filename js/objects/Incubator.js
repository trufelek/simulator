/*
  Incubator Class
*/
Incubator.all = {};
Incubator.count = 0;
Incubator.incubated = [];

function Incubator(game, x, y, image, frame, group) {
    Prefab.call(this, game, x, y, image, frame, group);

    this.actions = {
        incubate: {
            label: 'Rozmnażanie',
            icon: 'action_incubate_icon',
            position: 'top',
            enabled: true,
            visible: true,
            callback: this.incubate,
            cost: 1000
        }
    };

    this.timer = {
        clock: null,
        event: null,
        loops: [],
        duration: { minutes: 0, seconds: 15 },
        progress: 0
    };

    this.stats = {
      incubated: 0
    };

    this.increase = 25;

    Incubator.all[Incubator.count] = this;
    Incubator.count ++;

    this.init();
}

Incubator.prototype = Object.create(Prefab.prototype);
Incubator.prototype.constructor = Incubator;

Incubator.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create timer
    this.createTimerEvent(this.timer.duration.minutes, this.timer.duration.seconds, false, this.endIncubation);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, true, false);
};

Incubator.prototype.incubate = function(incubator) {
    // disable incubate action
    incubator.actions.incubate.enabled = false;

    // decrease owner cash
    simulator.farm.owner.cash -= incubator.actions.incubate.cost;

    //start timer
    incubator.timer.clock.start();

    // change texture
    incubator.loadTexture('incubator_full', 0, false);
};

Incubator.prototype.endIncubation = function() {
    this.stats.incubated += this.increase;
    Incubator.incubated.push(this);
};

Incubator.dismissAnimals = function() {
    // shift incubator from incubated incubators array
    var incubator = Incubator.incubated.shift();

    // set action incubate to enabled
    incubator.actions.incubate.enabled = true;
    incubator.resetTimer();

    // create timer again
    incubator.createTimerEvent(incubator.timer.duration.minutes, incubator.timer.duration.seconds, false, incubator.endIncubation);

    // change texture
    incubator.loadTexture('incubator', 0, false);
};
