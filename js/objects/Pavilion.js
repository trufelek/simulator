/*
 Pavilion Class
*/
Pavilion.all = [];
Pavilion.count = 0;
Pavilion.crowded = [];

function Pavilion(game, x, y, image, frame, group) {
    Prefab.call(this, game, x, y, image, frame, group);

    Pavilion.count ++;

    this.pavilionId = Pavilion.count;
    this.hidden = false;
    this.cages = [];
    this.fullCages = [];

    this.timer = {
        clock: null,
        event: null,
        loops: []
    };

    this.color = {
        default: '0xffffff',
        crowded: '0xEC6A6D'
    };

    this.state = {
        crowded: false,
        epidemic: false
    };

    this.init();

    Pavilion.all.push(this);
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

    // set pavilion state
    if(this.fullCages.length > 8) {
        this.state.crowded = true;
        Pavilion.crowded.push(this);
    }

    // hide pavilion on start
    game.time.events.add(Phaser.Timer.SECOND, this.hidePavilion, this);

    // create timer loop
    this.createTimerLoop(250, this.updatePavilion, this);
};

Pavilion.prototype.updatePavilion = function() {
    // update pavilion visibility
    if (game.input.activePointer.isDown) {
        if(game.camera.x < 200) {
            this.hidePavilion();
        } else {
            this.showPavilion();
        }
    }
};

Pavilion.prototype.updateState = function() {
    // update pavilion state
    if(this.fullCages.length > 8) {
        this.state.crowded = true;

        if(Pavilion.crowded.indexOf(this) == -1) {
            Pavilion.crowded.push(this);
        }
    } else {
        if(Pavilion.crowded.indexOf(this) > -1) {
            Pavilion.crowded.splice(Pavilion.crowded.indexOf(this), 1);
        }

        this.state.crowded = false;
    }
};

Pavilion.prototype.hidePavilion = function() {
    // hide on hover
    game.add.tween(this).to({alpha: 0}, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.hidden = true;

    // show cages stats
    this.showCagesStats();
};

Pavilion.prototype.showCagesStats = function() {
    this.cages.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);

        if(e.warning) {
            game.add.tween(e.warning).to( { alpha: 1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        }

        e.input.priorityID = 1;
    });
};

Pavilion.prototype.showPavilion = function() {
    game.add.tween(this).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
    this.hidden = false;

    // hide cages stats
    this.hideCagesStats();
};

Pavilion.prototype.hideCagesStats = function() {
    this.cages.forEach(function(e, i){
        game.add.tween(e.statsBar.timerBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(e.statsBar.attrsBar).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);

        if(e.warning) {
            game.add.tween(e.warning).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false);
        }

        e.input.priorityID = 0;
    });
};
