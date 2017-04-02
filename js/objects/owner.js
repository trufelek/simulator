function Owner () {
    this.cash = 100000;

    this.timer = {
        clock: null,
        event: null,
        loop: null
    };

    this.init();
};

Owner.prototype.init = function() {
    // create timer
    this.createTimer();
};

Owner.prototype.createTimer = function() {
    // create timer & timer event & timer loop
    this.timer.clock = game.time.create();
    this.timer.loop = game.time.events.loop(Phaser.Timer.SECOND, this.updateCash, this);

    //start timer
    this.timer.clock.start();
};

Owner.prototype.updateCash = function() {
    this.cash -= 1;
};