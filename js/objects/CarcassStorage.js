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
            increase: 2
        }
    };

    this.actions = {
        utilization: {
            label: 'Utylizacja',
            icon: 'action_waste_icon',
            position: 'top',
            enabled: false,
            visible: true,
            callback: this.utilize,
            price: 5,
            income: false,
            sound: game.add.audio('garbage')
        },
        recycle: {
            label: 'Przerobienie na karmę',
            icon: 'action_recycle_icon',
            position: 'left',
            enabled: false,
            visible: true,
            callback: this.recycle,
            price: 2,
            income: false,
            sound: game.add.audio('garbage')
        },
        upgrade: {
            label: 'Upgrade',
            icon: 'action_upgrade_icon',
            position: 'right',
            enabled: true,
            visible: true,
            callback: this.chooseUpgrade
        }
    };

    this.upgrades = [
        {
            title: 'Trochę większa pojemność (1000zł)',
            desc: 'Zabij 100 zwierząt.',
            newMax: 150,
            enabled: false,
            active: false,
            price: 1000,
            condition: 100
        },
        {
            title: 'Średnio większa pojemność (5000zł)',
            desc: 'Zabij 250 zwierząt.',
            newMax: 200,
            enabled: false,
            active: false,
            price: 5000,
            condition: 250
        },
        {
            title: 'Znacznie większa pojemność (7500zł)',
            desc: 'Zabij 500 zwierząt.',
            newMax: 300,
            enabled: false,
            active: false,
            price: 7500,
            condition: 500
        }
    ];

    this.state = {
        full: false
    };

    this.stats = {
        carcass: 0,
        recycled: 0
    };

    this.alert = null;
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

        // show alert
        if(!this.alert) {
            this.alert = new Alert(game, this.position.x, this.position.y, this);
        }
    } else {
        this.attributes.carcass.current += this.attributes.carcass.increase;
    }

    // enable utilize action
    this.actions.utilization.enabled = true;
    this.actions.recycle.enabled = true;
};


CarcassStorage.prototype.utilize = function(o) {
    // increase amount of utilized carcass
    o.stats.carcass += o.attributes.carcass.current;

    // decrease owner cash
    var cost = o.attributes.carcass.current * o.actions.utilization.price;
    simulator.farm.owner.cash -= cost;
    simulator.gui.showCost(cost, o.actions.utilization.income, o.position);

    // decrease amount of carcass
    o.attributes.carcass.current = o.attributes.carcass.min;

    // disable action utilize & recycle
    o.actions.utilization.enabled = false;
    o.actions.recycle.enabled = false;

    // play sound
    o.actions.utilization.sound.play();

    // change state to empty
    o.state.full = false;

    // hide alert
    if(o.alert) {
        o.alert.hideAlert();
    }
};

CarcassStorage.prototype.recycle = function(o) {
    // increase amount of utilized carcass & times it was recycled
    o.stats.carcass += o.attributes.carcass.current;
    o.stats.recycled ++;

    // decrease owner cash
    var cost = o.attributes.carcass.current * o.actions.recycle.price;
    simulator.farm.owner.cash -= cost;
    simulator.gui.showCost(cost, o.actions.recycle.income, o.position);

    // decrease food in food storage
    simulator.farm.foodStorage.addFood(o.attributes.carcass.current);

    // decrease amount of carcass
    o.attributes.carcass.current = o.attributes.carcass.min;

    // disable action utilize & recycle
    o.actions.utilization.enabled = false;
    o.actions.recycle.enabled = false;

    // play sound
    o.actions.recycle.sound.play();

    // change state to empty
    o.state.full = false;

    // hide alert
    if(o.alert) {
        o.alert.hideAlert();
    }
};

CarcassStorage.prototype.chooseUpgrade = function(o) {
    // update upgrades
    for(var u in o.upgrades) {
        if(o.upgrades.hasOwnProperty(u)) {
            var upgrade = o.upgrades[u];
            upgrade.description = upgrade.desc + ' (' + simulator.farm.killed + '/' + upgrade.condition  + ')';

            if(upgrade.condition <= simulator.farm.killed && simulator.farm.owner.cash >= upgrade.price) {
                if(u == 0 || o.upgrades[u - 1].active) {
                    upgrade.enabled = true;
                }
            } else {
                upgrade.enabled = false;
            }
        }
    }

    // show upgrade options
    simulator.gui.showUpgradeOptions(o);
};

CarcassStorage.prototype.upgrade = function(u) {
    // update upgrade
    var upgrade = this.upgrades[u];
    upgrade.active = true;
    upgrade.enabled = false;

    // decrease owner cash by upgrade price
    simulator.farm.owner.cash -= upgrade.price;
    simulator.gui.showCost(upgrade.price, false, this.position);

    // upgrade carcass storage
    this.attributes.carcass.max = upgrade.newMax;

    // hide alert
    if(this.alert) {
        this.alert.hideAlert();
    }
};