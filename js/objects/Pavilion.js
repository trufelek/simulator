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

    this.timer = {
        clock: null,
        event: null,
        loops: []
    };

    this.fullCages = [];

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

                if(cage.state.enabled) {
                    this.fullCages.push(cage);
                }
            }
        }
    }

    game.time.events.add(Phaser.Timer.SECOND, this.hidePavilion, this);

    // create timer loop
    this.createTimerLoop(500, this.updatePavilion, this);
};

Pavilion.prototype.updatePavilion = function() {
    if (game.input.activePointer.isDown) {
        if(game.camera.x < 200) {
            this.hidePavilion();
        } else {
            this.showPavilion();
        }
    }
};

Pavilion.prototype.hidePavilion = function() {
    // hide on hover
    game.add.tween(this).to({alpha: 0}, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.hidden = true;

    this.showCagesStats();
};

Pavilion.prototype.showCagesStats = function() {
    this.cages.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        e.input.priorityID = 1;
    });
};

Pavilion.prototype.showPavilion = function() {
    game.add.tween(this).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.hidden = false;

    this.hideCagesStats();
};

Pavilion.prototype.hideCagesStats = function() {
    this.cages.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        e.input.priorityID = 0;
    });
};
