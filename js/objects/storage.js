function Storage(game, x, y, z, image, frame, group) {
    Prefab.call(this, game, x, y, z, image, frame, group);

    this.attributes = {
        fur: {
            max: 100,
            min: 0,
            current: 0,
            label: 'Futro',
            icon: 'fur_icon'
        },
        carcass: {
            max: 100,
            min: 0,
            current: 0,
            label: 'Tusze',
            icon: 'kill_stock_icon'
        }
    };

    this.actions = {
        sell: {
            label: 'Sprzedaż',
            icon: 'action_sell_icon',
            position: 'top',
            enabled: false,
            callback: this.sell,
            price: 10000
        },
        utilization: {
            label: 'Utylizacja',
            icon: 'action_waste_icon',
            position: 'left',
            enabled: false,
            callback: this.utilize,
            cost: 10000
        }
    };

    this.state = {
        full: false
    };

    this.stats = {
        fur: 0,
        carcass: 0
    };

    this.init();
}

Storage.prototype = Object.create(Prefab.prototype);
Storage.prototype.constructor = Storage;

Storage.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // add click event
    this.events.onInputDown.add(this.click, this);
};

Storage.prototype.update = function() {
    // show/hide tooltip
    this.updateTooltip();
};

Storage.prototype.updateTooltip = function() {
    if(this.input.pointerOver()) {
        // show info in tooltip
        var info = 'Ilość sprzedanych futer: ' + this.stats.fur + '\n';
        info += 'Całkowita ilość odpadów: ' + this.stats.carcass;
        game.settings.gui.showTooltip(this.position, null, this.attributes, info);
    }
};

Storage.prototype.click = function() {
    // show actions
    game.settings.gui.showActions(this.id, this.position, this.actions);
};

Storage.prototype.stack = function(stack) {
    // increase fur amount
    this.stackFur(stack);

    // increase carcass amount
    this.stackCarcass(stack);
};

Storage.prototype.stackFur = function(fur) {
    // increase amount of fur in storage
    if(this.attributes.fur.current + fur >= this.attributes.fur.max) {
        this.attributes.fur.current = this.attributes.fur.max;
        // change state to full
        this.state.full = true;

        // enable sell action
        this.actions.sell.enabled = true;
    } else {
        this.attributes.fur.current += fur;
    }
};

Storage.prototype.stackCarcass = function(carcass) {
    // increase amount of carcass in storage
    if(this.attributes.carcass.current + carcass >= this.attributes.carcass.max) {
        this.attributes.carcass.current = this.attributes.carcass.max;
        // change state to full
        this.state.full = true;

        // enable utilize action
        this.actions.utilization.enabled = true;
    } else {
        this.attributes.carcass.current += carcass;
    }
};

Storage.prototype.sell = function(o) {
    // increase amount of sold fur
    o.stats.fur += o.attributes.fur.current;

    // decrease amount of fur
    o.attributes.fur.current = o.attributes.fur.min;

    // disable action sell
    o.actions.sell.enabled = false;

    // decrease owner cash
    game.farm.owner.cash += o.actions.sell.price;

    // change state to empty
    if(o.attributes.fur.current ==  o.attributes.fur.min && o.attributes.carcass.current == o.attributes.carcass.min) {
        o.state.full = false;
    }
};

Storage.prototype.utilize = function(o) {
    // increase amount of utilized carcass
    o.stats.carcass += o.attributes.carcass.current;

    // decrease amount of carcass
    o.attributes.carcass.current = o.attributes.carcass.min;

    // disable action utilize
    o.actions.utilization.enabled = false;

    // decrease owner cash
    game.farm.owner.cash -= o.actions.utilization.cost;

    // change state to empty
    if(o.attributes.fur.current ==  o.attributes.fur.min && o.attributes.carcass.current == o.attributes.carcass.min) {
        o.state.full = false;
    }
};