/*
 Pavilion Class
*/
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

Pavilion.prototype.hidePavilion = function() {
    // hide on hover
    game.add.tween(this).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.hidden = true;

    this.showCagesStats();
};

Pavilion.prototype.showCagesStats = function() {
    this.cages.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
        e.input.priorityID = 1;
    });
};

Pavilion.prototype.showHiddenPavilions = function() {
    for(var p in Pavilion.all) {
        if(Pavilion.all.hasOwnProperty(p)) {
            if(Pavilion.all[p].alpha == 0) {
                game.add.tween(Pavilion.all[p]).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
                Pavilion.all[p].hidden = false;
                Pavilion.all[p].hideCagesStats();
            }
        }
    }
};

Pavilion.prototype.hideCagesStats = function() {
    this.cages.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
        e.input.priorityID = 0;
    });
};

Pavilion.prototype.update = function() {
    if (game.input.activePointer.isDown) {
        if(game.camera.x < 200) {
            this.hidePavilion();
        } else {
            this.showHiddenPavilions();
        }
    }
};
