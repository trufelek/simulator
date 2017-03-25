Prefab.all = {};
Prefab.count = 0;

function Prefab(game, x, y, z, image, group) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, image, group);

    this.id = Prefab.count;
    this.position = {x: x, y: y, z: z};
    this.image = image;
    this.highlight_tint = '0xfff401';
    this.default_tint = '0xffffff';

    this.inputEnabled = true;
    this.input.useHandCursor = true;

    this.events.onInputOver.add(this.inputOver, this);
    this.events.onInputOut.add(this.inputOut, this);

    Prefab.all[this.id] = this;
    Prefab.count ++;
}

Prefab.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Prefab.prototype.constructor = Prefab;

Prefab.prototype.inputOver = function() {
    this.tint = this.highlight_tint;
};

Prefab.prototype.inputOut = function() {
    this.tint = this.default_tint;
    game.settings.gui.destroyTooltip();
};