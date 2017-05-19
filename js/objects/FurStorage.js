/*
 Fur Storage Class
*/
function FurStorage(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.attributes = {
        fur: {
            max: 100,
            min: 0,
            current: 0,
            label: 'Futro',
            icon: 'fur_icon',
            increase: 2
        }
    };

    this.actions = {
        sell: {
            label: 'Sprzedaż',
            icon: 'action_sell_icon',
            position: 'top',
            enabled: false,
            callback: this.sell,
            visible: true,
            price: 10000
        }
    };

    this.state = {
        full: false
    };

    this.stats = {
        fur: 0
    };

    this.statsBar = null;

    this.init();
}

FurStorage.prototype = Object.create(Prefab.prototype);
FurStorage.prototype.constructor = FurStorage;

FurStorage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // create stats
    this.statsBar = new Stats(game, this.position.x, this.position.y, this, false, true);
};

FurStorage.prototype.stack = function(stack) {
    // increase fur amount
    this.stackFur(stack);
};

FurStorage.prototype.stackFur = function() {
    // increase amount of fur in storage
    if(this.attributes.fur.current + this.attributes.fur.increase >= this.attributes.fur.max) {
        this.attributes.fur.current = this.attributes.fur.max;
        // change state to full
        this.state.full = true;

        // enable sell action
        this.actions.sell.enabled = true;
    } else {
        this.attributes.fur.current += this.attributes.fur.increase;
    }
};

FurStorage.prototype.sell = function(o) {
    // increase amount of sold fur
    o.stats.fur += o.attributes.fur.current;

    // decrease amount of fur
    o.attributes.fur.current = o.attributes.fur.min;

    // disable action sell
    o.actions.sell.enabled = false;

    // decrease owner cash
    simulator.farm.owner.cash += o.actions.sell.price;

    // change state to empty
    o.state.full = false;
};
