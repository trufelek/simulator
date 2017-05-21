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
        }
    };

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
