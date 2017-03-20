function Cage(state, x, y, z, image) {
    Prefab.call(this, state, x, y, z, image);

    game.add.existing(this);

    this.time_to_grow = 1;
    this.hunger = 100;
    this.condition = 100;
    this.full = false;
    this.ill = false;
}

Cage.prototype = Object.create(Prefab.prototype);
Cage.prototype.constructor = Cage;
