function FoodStorage(state, x, y, z, image) {
    Prefab.call(this, state, x, y, z, image);

    this.attributes = {
        food: {
            max: 500,
            min: 0,
            current: 10,
            label: 'Karma',
            icon: 'food_icon',
            decrease: 10,
            increase: 100
        },
    };

    this.actions = {
        buyFood: {
            label: 'Kup karmę',
            icon: 'action_buy_food',
            position: 'top',
            enabled: true,
            callback: this.buyFood
        }
    };

    this.init();
}

FoodStorage.prototype = Object.create(Prefab.prototype);
FoodStorage.prototype.constructor = FoodStorage;

FoodStorage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    this.events.onInputDown.add(this.click, this);
};

FoodStorage.prototype.update = function() {
    if(this.input.pointerOver()) {
        // show info in tooltip
        var info = 'Ilość karmy: ' + this.attributes.food.current + ' / ' + this.attributes.food.max;
        game.settings.gui.showTooltip(this.position, null, this.attributes, info);
    }
};

FoodStorage.prototype.click = function() {
    // show actions
    game.settings.gui.showActions(this.id, this.position, this.actions);
};

FoodStorage.prototype.buyFood = function(o) {
    // decrease food lvl in a store
    if(o.attributes.food.current + o.attributes.food.increase >= o.attributes.food.max) {
        o.attributes.food.current = o.attributes.food.max;
        o.actions.buyFood.enabled = false;
    } else {
        o.attributes.food.current += o.attributes.food.increase;
    }

    // enable cage feed action
    Cage.changeActionStatus('feed', true);

};

FoodStorage.prototype.consumeFood = function(food) {
    // decrease food lvl in a store
    if(this.attributes.food.current - food <= this.attributes.food.min) {
        this.attributes.food.current = this.attributes.food.min;

        // disable cage feed action
        Cage.changeActionStatus('feed', false);
    } else {
        this.attributes.food.current -= food;
    }

    this.actions.buyFood.enabled = true;
};