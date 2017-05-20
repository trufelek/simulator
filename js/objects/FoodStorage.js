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
            cost: 10,
            sound: game.add.audio('food')
        }
    };

    this.state = {
        empty: false
    };

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

FoodStorage.prototype.buyFood = function(o) {
    // decrease owner money by food cost
    simulator.farm.owner.cash -= (o.attributes.food.max - o.attributes.food.current) * o.actions.buyFood.cost;

    // increase food lvl in a store
    o.attributes.food.current = o.attributes.food.max;
    o.actions.buyFood.enabled = false;
    o.state.empty = false;

    // play sound
    o.actions.buyFood.sound.play();
};

FoodStorage.prototype.consumeFood = function(food) {
    // decrease food lvl in a store
    if(this.attributes.food.current - food <= this.attributes.food.min) {
        this.attributes.food.current = this.attributes.food.min;
        this.state.empty = true;
    } else {
        this.attributes.food.current -= food;
    }

    this.actions.buyFood.enabled = true;
};
