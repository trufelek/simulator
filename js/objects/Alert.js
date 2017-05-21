/*
 Alert Class
*/
function Alert(game, x, y, obj) {
    Phaser.Sprite.call(this, game, x, y);

    this.object = obj;
    this.warning = null;
    this.sound = game.add.audio('alert_beep');

    this.init();
}

Alert.prototype = Object.create(Phaser.Sprite.prototype);
Alert.prototype.constructor = Alert;

Alert.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // draw alert
    this.drawAlert();

    // create timer loop
    game.time.events.loop(60, this.updateAlert, this);
};

Alert.prototype.drawAlert = function() {
    if(!this.object.alert) {
        this.warning = game.add.sprite(this.object.position.x, this.object.position.y - 25, 'alert');
        this.warning.anchor.setTo(0.5);

        this.sound.loopFull(0.5);

        game.add.tween(this.warning.scale).to( { x: 1.5, y: 1.5 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
};

Alert.prototype.hideAlert = function() {
    if(this.object.alert) {
        this.sound.destroy();
        this.warning.destroy();
        this.object.alert = null;
    }
};

Alert.prototype.updateAlert = function() {
    if(this.object.inCamera) {
        this.sound.volume = 0.7;
    } else {
        this.sound.volume = 0.3;
    }
};

