function FoodStorage(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.attributes = {
        food: {
            max: 500,
            min: 0,
            current: 200,
            label: 'Karma',
            icon: 'food_icon',
            decrease: 50,
            increase: 100
        }
    };

    this.actions = {
        buyFood: {
            label: 'Kup karmę',
            icon: 'action_buy_icon',
            position: 'top',
            enabled: true,
            callback: this.buyFood
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

    // add click event
    this.events.onInputDown.add(this.click, this);
};

FoodStorage.prototype.update = function() {
    // update tooltip
    this.updateTooltip();
};

FoodStorage.prototype.updateTooltip = function() {
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
    // increase food lvl in a store
    if(o.attributes.food.current + o.attributes.food.increase >= o.attributes.food.max) {
        o.attributes.food.current = o.attributes.food.max;
        o.actions.buyFood.enabled = false;
    } else {
        o.attributes.food.current += o.attributes.food.increase;
    }

    o.state.empty = false;

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