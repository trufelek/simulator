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
            price: 10,
            income: true,
            sound: game.add.audio('selling')
        }
    };

    this.state = {
        full: false
    };

    this.stats = {
        fur: 0
    };

    this.alert = null;
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

        // show alert
        if(!this.alert) {
            this.alert = new Alert(game, this.position.x, this.position.y, this);
        }
    } else {
        this.attributes.fur.current += this.attributes.fur.increase;
    }

    // enable sell action
    this.actions.sell.enabled = true;
};

FurStorage.prototype.sell = function(o) {
    // increase amount of sold fur
    o.stats.fur += o.attributes.fur.current;

    // decrease owner cash
    var income = o.attributes.fur.current * o.actions.sell.price;
    simulator.farm.owner.cash += income;
    simulator.gui.showCost(income, o.actions.sell.income, o.position);

    // decrease amount of fur
    o.attributes.fur.current = o.attributes.fur.min;

    // disable action sell
    o.actions.sell.enabled = false;

    // play sound
    o.actions.sell.sound.play();

    // change state to empty
    o.state.full = false;

    // hide alert
    if(o.alert) {
        o.alert.hideAlert();
    }
};
