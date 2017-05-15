/*
 Stats Class
*/
function Stats(game, x, y, obj, timer, attrs) {
    Phaser.Sprite.call(this, game, x, y);

    this.object = obj;
    this.padding = 30;
    this.height = 10;
    this.width = 50;

    this.drawTimerBar = timer;
    this.drawAttrsBar = attrs;

    this.timerBar = null;
    this.attrsBar = null;

    this.progress = {
        tint: {
            full: '0x97d143',
            almost: '0xfff855',
            little: '0xffab55',
            none: '0xff5855'
        }
    };

    this.init();
}

Stats.prototype = Object.create(Phaser.Sprite.prototype);
Stats.prototype.constructor = Stats;

Stats.prototype.init = function() {
    // add object to game
    game.add.existing(this);

    // draw stats bars
    this.drawStatsBars();
};

Stats.prototype.drawStatsBars = function() {
    if(this.drawTimerBar) {
        var extra_padding = this.drawAttrsBar ? 8 : 0;
        var time_bar_x = this.object.position.x - this.width / 2;
        var time_bar_y = this.object.position.y - this.padding - extra_padding;

        this.timerBar = this.drawBar(time_bar_x, time_bar_y);
        this.timerBar.progress = this.timerBar.children[1];
    }

   if(this.drawAttrsBar) {
       var attrs_bar_x = this.object.position.x - this.width / 2;
       var attrs_bar_y = this.object.position.y - this.padding;

       this.attrsBar = this.drawBar(attrs_bar_x, attrs_bar_y);
       this.attrsBar.progress = this.attrsBar.children[1];
   }
};

Stats.prototype.drawBar = function(x, y) {
    var bar = game.add.sprite(x, y);
    bar.addChild(game.add.sprite(0, 0, 'bar_back'));
    bar.addChild(game.add.sprite(0, 0, 'progress_bar'));
    bar.addChild(game.add.sprite(0, 0, 'bar'));

    return bar;
};

Stats.prototype.update = function() {
    // update stats and progress bar
    this.updateStats();
};

Stats.prototype.updateStats = function() {
    if(this.drawTimerBar) {
        // update bar progress
        this.timerBar.progress.tint = this.calculateTint(this.object.timer.progress);
        this.timerBar.progress.width = this.width * this.object.timer.progress / 100;
    }

    if(this.drawAttrsBar) {
        // attrs bar progress
        var attr_key = Object.keys(this.object.attributes)[0];
        var attr = this.object.attributes[attr_key];
        var lvl = attr.current * 100 / attr.max;


        // update bar progress
        this.attrsBar.progress.tint = this.calculateTint(lvl);
        this.attrsBar.progress.width = this.width * lvl / 100;
    }
};

Stats.prototype.calculateTint = function(percentage) {
    // calculates tint of a progress bar
    var tint;

    if(percentage >= 80) {
        tint = this.progress.tint.full;
    } else if(percentage < 80 && percentage >= 50) {
        tint = this.progress.tint.almost;
    } else if(percentage < 50 && percentage >= 25) {
        tint = this.progress.tint.little;
    } else if (percentage < 25) {
        tint = this.progress.tint.none;
    }

    return tint;
};
