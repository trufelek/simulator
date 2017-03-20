Prefab.all = {};
Prefab.count = 0;

function Prefab(state, x, y, z, image) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, state.game, x, y, z, image);

    this.id = Prefab.count;
    this.position = {x: x, y: y};
    this.image = image;

    Prefab.count ++;
    Prefab.all[this.id] = this;
}

Prefab.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Prefab.prototype.constructor = Prefab;
