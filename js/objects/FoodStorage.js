/*
 Food Storage Class
*/
function FoodStorage(game, x, y, image, frame, group) {
    Prefab.call(this, game, x, y, image, frame, group);

    this.attributes = {
        food: {
            max: 500,
            min: 0,
            current: 500,
            label: 'Karma',
            icon: 'food_icon'
        }
    };

    this.actions = {
        buyFood: {
            label: 'Kup karmę',
            icon: 'action_buy_icon',
            position: 'top',
            enabled: true,
            visible: true,
            callback: this.buyFood,
            price: 10,
            income: false,
            sound: game.add.audio('food')
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
            title: 'Trochę większa pojemność (10 000zł)',
            desc: 'Wyhoduj 100 zwierząt.',
            newMax: 750,
            enabled: false,
            active: false,
            price: 10000,
            condition: 100
        },
        {
            title: 'Średnio większa pojemność (50 000zł)',
            desc: 'Wyhoduj 250 zwierząt.',
            newMax: 1000,
            enabled: false,
            active: false,
            price: 50000,
            condition: 250
        },
        {
            title: 'Znacznie większa pojemność (75 000zł)',
            desc: 'Wyhoduj 500 zwierząt.',
            newMax: 1500,
            enabled: false,
            active: false,
            price: 75000,
            condition: 500
        }
    ];

    this.state = {
        empty: false
    };

    this.alert = null;
    this.init();
}

FoodStorage.prototype = Object.create(Prefab.prototype);
FoodStorage.prototype.constructor = FoodStorage;

FoodStorage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, false, true);
};

FoodStorage.prototype.consumeFood = function(food) {
    // decrease food lvl in a store
    if(this.attributes.food.current - food <= this.attributes.food.min) {
        this.attributes.food.current = this.attributes.food.min;
        this.state.empty = true;

        // show alert
        this.alert = new Alert(game, this.position.x, this.position.y, this);

    } else {
        this.attributes.food.current -= food;
    }

    this.actions.buyFood.enabled = true;
};

FoodStorage.prototype.buyFood = function(o) {
    // decrease owner money by food price
    var cost = (o.attributes.food.max - o.attributes.food.current) * o.actions.buyFood.price;
    simulator.farm.owner.cash -= cost;
    simulator.gui.showCost(cost, o.actions.buyFood.income, o.position);

    // increase food lvl in a store
    o.attributes.food.current = o.attributes.food.max;
    o.actions.buyFood.enabled = false;
    o.state.empty = false;

    // hide alert
    if(o.alert) {
        o.alert.hideAlert();
    }

    // play sound
    o.actions.buyFood.sound.play();
};


FoodStorage.prototype.addFood = function(amount) {
    // increase food lvl in a store
    if(this.attributes.food.current + (5 * amount) > this.attributes.food.max) {
        this.attributes.food.current = this.attributes.food.max;
    } else {
        this.attributes.food.current += 5 * amount;
    }

    this.actions.buyFood.enabled = false;
    this.state.empty = false;

    // hide alert
    if(this.alert) {
        this.alert.hideAlert();
    }
};

FoodStorage.prototype.chooseUpgrade = function(o) {
    // update upgrades
    for(var u in o.upgrades) {
        if(o.upgrades.hasOwnProperty(u)) {
            var upgrade = o.upgrades[u];
            upgrade.description = upgrade.desc + ' (' + simulator.farm.incubated + '/' + upgrade.condition  + ')';

            if(upgrade.condition <= simulator.farm.incubated && simulator.farm.owner.cash >= upgrade.price) {
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

FoodStorage.prototype.upgrade = function(u) {
    // update upgrade
    var upgrade = this.upgrades[u];
    upgrade.active = true;
    upgrade.enabled = false;

    // decrease owner cash by upgrade price
    simulator.farm.owner.cash -= upgrade.price;
    simulator.gui.showCost(upgrade.price, false, this.position);

    // upgrade food storage
    this.attributes.food.max = upgrade.newMax;
};
