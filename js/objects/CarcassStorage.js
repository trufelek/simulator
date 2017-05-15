/*
 Carcass Storage Class
*/
function CarcassStorage(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.attributes = {
        carcass: {
            max: 100,
            min: 0,
            current: 0,
            label: 'Tusze',
            icon: 'kill_stock_icon',
            increase: 1,
        }
    };

    this.actions = {
        utilization: {
            label: 'Utylizacja',
            icon: 'action_waste_icon',
            position: 'left',
            enabled: false,
            visible: true,
            callback: this.utilize,
            cost: 5000
        }
    };

    this.state = {
        full: false
    };

    this.stats = {
        carcass: 0
    };

    this.statsBar = null;

    this.init();
}

CarcassStorage.prototype = Object.create(Prefab.prototype);
CarcassStorage.prototype.constructor = CarcassStorage;

CarcassStorage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, false, true);
};

CarcassStorage.prototype.stackCarcass = function() {
    // increase amount of carcass in storage
    if(this.attributes.carcass.current + this.attributes.carcass.increase >= this.attributes.carcass.max) {
        this.attributes.carcass.current = this.attributes.carcass.max;
        // change state to full
        this.state.full = true;

        // enable utilize action
        this.actions.utilization.enabled = true;
    } else {
        this.attributes.carcass.current += this.attributes.carcass.increase;
    }
};


CarcassStorage.prototype.utilize = function(o) {
    // increase amount of utilized carcass
    o.stats.carcass += o.attributes.carcass.current;

    // decrease amount of carcass
    o.attributes.carcass.current = o.attributes.carcass.min;

    // disable action utilize
    o.actions.utilization.enabled = false;

    // decrease owner cash
    simulator.farm.owner.cash -= o.actions.utilization.cost;

    // change state to empty
    o.state.full = false;
};
