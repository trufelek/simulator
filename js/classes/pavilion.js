Pavilion.all = {};
Pavilion.count = 0;

function Pavilion(game, x, y, image, frame, group) {
    Prefab.call(this, game, x, y, image, frame, group);

    Pavilion.count ++;

    this.pavilionId = Pavilion.count;
    this.hidden = false;
    this.cages = [];

    this.init();

    Pavilion.all[this.pavilionId] = this;
}

Pavilion.prototype = Object.create(Prefab.prototype);
Pavilion.prototype.constructor = Pavilion;

Pavilion.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // match pavilions and cages
    for(var cage_index in Cage.all) {
        if(Cage.all.hasOwnProperty(cage_index)) {
            var cage = Cage.all[cage_index];

            if(cage.pavilionId == this.pavilionId) {
                cage.pavilion = this;
                this.cages.push(cage);
            }
        }
    }
};

Pavilion.prototype.inputOver = function() {
    // hide on hover
    this.alpha = 0;
};

Pavilion.prototype.inputOut = function() {
    // show on hover
    this.alpha = 1;
};

Pavilion.prototype.update = function() {
    // todo: update
};