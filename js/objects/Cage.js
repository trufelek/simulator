/*
 Cage Class
*/
Cage.all = {};
Cage.count = 0;
Cage.full = [];
Cage.sick = [];
Cage.miserable = [];

function Cage(game, x, y, image, frame, group, enabled, pavilion) {
    Prefab.call(this, game, x, y, image, frame, group);

    this.attributes = {
        condition: {
            max: 100,
            min: 0,
            current: enabled ? 100 : 0,
            label: 'Stan zwierząt',
            icon: 'condition_icon',
            min_decrease: 0.5,
            hungry_decrease: 1,
            crowded_decrease: 3
        }
    };

    this.actions = {
        kill: {
            label: 'Zabij',
            icon: 'action_kill_icon',
            position: 'top',
            enabled: false,
            visible: enabled,
            callback: this.kill,
            sounds: [game.add.audio('kill1'),  game.add.audio('kill2'), game.add.audio('kill3')],
            cost: 500,
            income: false
        },
        heal: {
            label: 'Wylecz',
            icon: 'action_heal_icon',
            position: 'top',
            enabled: true,
            visible: false,
            callback: this.heal,
            cost: 1000,
            income: false,
            sound: game.add.audio('heal')
        },
        add: {
            label: 'Dodaj',
            icon: 'action_add_icon',
            position: 'top',
            enabled: false,
            visible: enabled ? false : true,
            callback: this.addAnimals,
            sounds: [game.add.audio('add1'), game.add.audio('add2')]
        },
        repair: {
            label: 'Napraw',
            icon: 'action_repair_icon',
            position: 'top',
            enabled: true,
            visible: false,
            callback: this.repair,
            cost: 1000,
            income: false,
            sound: game.add.audio('repair')
        }
    };

    this.state = {
        ready: false,
        sick: false,
        enabled: enabled
    };

    this.timer = {
        clock: null,
        event: null,
        loops: [],
        duration: { minutes: 0, seconds: 15 },
        progress: 0
    };

    this.eatingAmount = 1;

    this.pavilionId = pavilion;
    this.pavilion = null;
    this.statsBar = null;
    this.warning = null;

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

        // add to full cages
        Cage.full.push(this);
    }

    // create timer loop
    this.createTimerLoop(1000, this.updateCage, this);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, true, true);
    this.statsBar.timerBar.alpha = 0;
    this.statsBar.attrsBar.alpha = 0;
};

Cage.prototype.updateCage = function() {
    // enable/disable actions
    this.updateActions();

    if(this.state.enabled) {
        // eat food
        this.eatingFood();

        // update attributes
        this.updateAttributes();
    }
};

Cage.prototype.updateActions = function() {
    // update actions
    this.actions.kill.enabled = KillingStation.ready.length && this.state.ready;
    this.actions.add.enabled = Incubator.incubated.length;
};

Cage.prototype.updateAttributes = function() {
    // if there is no food decrease condition faster
    var decrease = this.attributes.condition.min_decrease;

    if(simulator.farm.foodStorage.state.empty) {
        decrease += this.attributes.condition.hungry_decrease;
    }

    if(this.pavilion.state.crowded) {
        decrease += this.attributes.condition.crowded_decrease;
    }

    // decrease condition lvl
    if(this.attributes.condition.current - decrease <= this.attributes.condition.min) {
        this.attributes.condition.current = this.attributes.condition.min;
    } else {
        this.attributes.condition.current -= decrease;
    }

    // if condition low add to miserable
    if(this.attributes.condition.current == this.attributes.condition.min) {
        if(Cage.miserable.indexOf(this) == -1) {
            Cage.miserable.push(this);
        }
    }
};

Cage.prototype.eatingFood = function() {
    // decrease food lvl in food store
    if(!simulator.farm.foodStorage.state.empty) {
        simulator.farm.foodStorage.consumeFood(this.eatingAmount);
    }
};

Cage.prototype.kill = function(cage) {
    if(KillingStation.ready.length) {
        // kill action
        KillingStation.ready[0].increaseKillStack();
        cage.emptyCage();

        // decrease owner cash
        simulator.farm.owner.cash -= cage.actions.kill.cost;
        simulator.gui.showCost(cage.actions.kill.cost, cage.actions.kill.income, cage.position);

        // play sound
        var sound = cage.getRandomInt(0,2);
        cage.actions.kill.sounds[sound].play();
    }
};

Cage.prototype.addAnimals = function(cage) {
    if(Incubator.incubated.length) {
        // release incubator from incubated array
        Incubator.dismissAnimals();

        // enable cage & set timer
        cage.state.enabled = true;

        // change texture
        cage.loadTexture('cage_double_full', 0, false);

        // play sound
        var sound = cage.getRandomInt(0,1);
        cage.actions.add.sounds[sound].play();

        // set attributes to max
        cage.attributes.condition.current = cage.attributes.condition.max;

        // update actions
        cage.actions.add.visible = false;
        cage.actions.kill.visible = true;

        // add cage to all full cages
        Cage.full.push(cage);

        // add cage to pavilion full cages
        cage.pavilion.fullCages.push(cage);

        // update pavilion state
        cage.pavilion.updateState();

        // create timer
        cage.createTimerEvent(cage.timer.duration.minutes, cage.timer.duration.seconds, true, cage.cageReady);
    }
};

Cage.prototype.emptyCage = function() {
    // destroy timer
    this.resetTimer();

    // change texture
    this.loadTexture('cage_double_empty', 0, false);

    // reset current cage
    this.state.enabled = false;

    // set attributes to min
    this.attributes.condition.current = this.attributes.condition.min;

    //update actions
    this.actions.add.visible = true;
    this.actions.kill.visible = false;

    // remove cage from all full cages
    if(Cage.full.indexOf(this) > -1) {
        Cage.full.splice(Cage.full.indexOf(this), 1);
    }

    // remove cage from pavilion full cages
    if(this.pavilion.fullCages.indexOf(this) > -1) {
        this.pavilion.fullCages.splice(this.pavilion.fullCages.indexOf(this), 1);
    }

    // remove if cage in miserable
    if(Cage.miserable.indexOf(this) > -1) {
        Cage.miserable.splice(Cage.miserable.indexOf(this), 1);
    }

    // update pavilion state
    this.pavilion.updateState();
};

Cage.prototype.escapeFromCage = function() {
    // destroy timer
    this.resetTimer();

    // change texture
    this.loadTexture('cage_double_broken', 0, false);

    // show warning
    this.warning = simulator.gui.showWarning(this.position, 'warning_broken');

    // reset current cage
    this.state.enabled = false;

    // set attributes to min
    this.attributes.condition.current = this.attributes.condition.min;

    //update actions
    this.actions.repair.visible = true;
    this.actions.kill.visible = false;

    // remove cage from all full cages
    if(Cage.full.indexOf(this) > -1) {
        Cage.full.splice(Cage.full.indexOf(this), 1);
    }

    // remove cage from pavilion full cages
    if(this.pavilion.fullCages.indexOf(this) > -1) {
        this.pavilion.fullCages.splice(this.pavilion.fullCages.indexOf(this), 1);
    }

    // remove if cage in miserable
    if(Cage.miserable.indexOf(this) > -1) {
        Cage.miserable.splice(Cage.miserable.indexOf(this), 1);
    }

    // update pavilion state
    this.pavilion.updateState();
};

Cage.prototype.repair = function(cage) {
    // play sound
    cage.actions.repair.sound.play();

    // decrease owner cash
    simulator.farm.owner.cash -= cage.actions.repair.cost;
    simulator.gui.showCost(cage.actions.repair.cost, cage.actions.repair.income, cage.position);

    // change texture
    cage.loadTexture('cage_double_empty', 0, false);

    // hide warning
    simulator.gui.hideWarning(cage.warning);
    cage.warning = null;

    //update actions
    cage.actions.add.visible = true;
    cage.actions.repair.visible = false;
};

Cage.prototype.sick = function() {
    // change texture
    this.loadTexture('cage_double_sick', 0, false);

    // show warning
    this.warning = simulator.gui.showWarning(this.position, 'warning_sick');

    // add to all sick cages
    if(Cage.sick.indexOf(this) == -1) {
        Cage.sick.push(this);
    }

    // add to pavilion sick cages
    if(this.pavilion.sickCages.indexOf(this) == -1) {
        this.pavilion.sickCages.push(this);
    }

    //update actions
    this.actions.heal.visible = true;
    this.actions.kill.visible = false;

    // update state
    this.state.sick = true;
};

Cage.prototype.heal = function(cage) {
    // play sound
    cage.actions.heal.sound.play();

    // decrease owner cash
    simulator.farm.owner.cash -= cage.actions.heal.cost;
    simulator.gui.showCost(cage.actions.heal.cost, cage.actions.heal.income, cage.position);

    // hide warning
    simulator.gui.hideWarning(cage.warning);
    cage.warning = null;

    // remove from all sick cages
    if(Cage.sick.indexOf(cage) > -1) {
        Cage.sick.splice(Cage.sick.indexOf(cage), 1);
    }

    // remove from pavilion sick cages
    if(cage.pavilion.sickCages.indexOf(cage) > -1) {
        cage.pavilion.sickCages.splice(cage.pavilion.sickCages.indexOf(cage), 1);
    }

    // if there is no sick cages remove pavilion from epidemic group and update its state
    if(!cage.pavilion.sickCages.length) {
        if(Pavilion.epidemic.indexOf(cage.pavilion) > -1) {
            Pavilion.epidemic.splice(Cage.sick.indexOf(Pavilion.epidemic.indexOf(cage.pavilion)), 1);
        }

        cage.pavilion.state.epidemic = false;
    }

    // change texture
    cage.loadTexture('cage_double_full', 0, false);

    //update actions
    cage.actions.kill.visible = true;
    cage.actions.heal.visible = false;

    // update state
    cage.state.sick = false;
};

Cage.prototype.dieFromSickness = function() {
    // play kill sound
    this.actions.kill.sounds[0].play();

    // hide warning
    simulator.gui.hideWarning(this.warning);
    this.warning = null;

    // remove from all sick cages
    if(Cage.sick.indexOf(this) > -1) {
        Cage.sick.splice(Cage.sick.indexOf(this), 1);
    }

    // if there is no sick cages remove pavilion from epidemic group and update its state
    if(!this.pavilion.sickCages.length) {
        if(Pavilion.epidemic.indexOf(this.pavilion) > -1) {
            Pavilion.epidemic.splice(Cage.sick.indexOf(Pavilion.epidemic.indexOf(this.pavilion)), 1);
        }

        this.pavilion.state.epidemic = false;
    }

    // update state
    this.state.sick = false;
    this.actions.heal.visible = false;

    // destroy timer
    this.resetTimer();

    // change texture
    this.loadTexture('cage_double_empty', 0, false);

    // reset current cage
    this.state.enabled = false;

    // set attributes to min
    this.attributes.condition.current = this.attributes.condition.min;

    //update actions
    this.actions.add.visible = true;
    this.actions.kill.visible = false;

    // remove cage from all full cages
    if(Cage.full.indexOf(this) > -1) {
        Cage.full.splice(Cage.full.indexOf(this), 1);
    }

    // remove cage from pavilion full cages
    if(this.pavilion.fullCages.indexOf(this) > -1) {
        this.pavilion.fullCages.splice(this.pavilion.fullCages.indexOf(this), 1);
    }

    // remove if cage in miserable
    if(Cage.miserable.indexOf(this) > -1) {
        Cage.miserable.splice(Cage.miserable.indexOf(this), 1);
    }
};

Cage.prototype.cageReady = function() {
    // cage ready to kill
    this.actions.kill.enabled = true;
    this.state.ready = true;
};

Cage.reset = function() {
    Cage.all = {};
    Cage.count = 0;
    Cage.full = [];
    Cage.sick = [];
    Cage.miserable = [];
};
