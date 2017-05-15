/*
 Slaughterhouse Class
 */
function Slaughterhouse(game, x, y, image, frame, group) {
    Prefab.call(this, game, x, y, image, frame, group);

    this.hidden = false;
    this.stations = [];

    this.init();
}

Slaughterhouse.prototype = Object.create(Prefab.prototype);
Slaughterhouse.prototype.constructor = Slaughterhouse;

Slaughterhouse.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // add stations
    for(var k in simulator.farm.killingStations) {
        if(simulator.farm.killingStations.hasOwnProperty(k)) {
            this.stations.push(simulator.farm.killingStations[k]);
        }
    }
};

Slaughterhouse.prototype.hideSlaughterhouse = function() {
    // hide on hover
    game.add.tween(this).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.hidden = true;

    this.showChildrenStats();
};

Slaughterhouse.prototype.showChildrenStats = function() {
    this.stations.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        e.input.priorityID = 1;
    });
};

Slaughterhouse.prototype.showSlaughterhouse = function() {
    game.add.tween(this).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.hidden = false;

    this.hideChildrenStats();
};

Slaughterhouse.prototype.hideChildrenStats = function() {
    this.stations.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        e.input.priorityID = 0;
    });
};

Slaughterhouse.prototype.update = function() {
    if (game.input.activePointer.isDown) {
        if(game.camera.x > 600) {
            this.hideSlaughterhouse();
        } else {
            this.showSlaughterhouse();
        }
    }
};
