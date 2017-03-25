function GUI() {
    this.styles = {
        font: '14px Arial',
        fill: '#000000',
        wordWrap: false,
        align: 'left'
    };

    this.progress = {
        tint: {
            full: '0x669933',
            almost: '0xFFEE00',
            little: '0xFF9933',
            none: '0xD62B2B'
        }
    };

    this.tint = {
        enabled: '0xB3B3B3'
    };

    this.padding = 30;

    this.tooltip = null;
    this.content = null;
    this.actions = null;

    this.state = 'idle';
}

GUI.prototype.createTooltip = function(position) {
    // creates tooltip rectangle
    this.tooltip = game.add.sprite(position.x, position.y, 'tooltip');

    // add line from tooltip to object
    tooltip_line = this.tooltip.addChild(game.add.sprite(0, this.tooltip.height / 2, 'tooltip_line'));

    // set tooltip position
    tooltip_line.x = 0 - tooltip_line.width;
    this.tooltip.x = position.x + tooltip_line.width;
    this.tooltip.y = position.y - this.tooltip.height - tooltip_line.height / 2;

    // add tooltip content container
    this.content = this.tooltip.addChild(game.add.sprite(0, 0));

    this.adjustTooltipToCamera();

};

GUI.prototype.adjustTooltipToCamera = function() {
    // adjust tooltip to camera view x
    if(this.tooltip.x + this.tooltip.width > game.camera.view.x + game.camera.view.width) {
        this.tooltip.x -= this.tooltip.width / 2;
        this.tooltip.scale.x *= -1;

        this.content.scale.x *= -1;
        this.content.x -= this.tooltip.width;
    }

    // adjust tooltip to camera view y
    if(this.tooltip.y < game.camera.view.y) {
        this.tooltip.y += this.tooltip.height + tooltip_line.height / 2 + 15;
        tooltip_line.scale.y *= -1;
    }
};

GUI.prototype.createBar = function(x, y, percentage) {
    var progress = this.content.addChild(game.add.sprite(x, y, 'progress_bar'));
    var bar = this.content.addChild(game.add.sprite(x, y, 'bar'));
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

    progress.width = progress.width * percentage / 100;

    progress.tint = tint;

    return bar;
};

GUI.prototype.createTimeBar = function(x, y, timer) {
    var time = {};

    // calculate time
    time.all = Math.round((timer.event.delay) / 1000);
    time.left = Math.round((timer.event.delay - timer.clock.ms) / 1000)
    time.passed = time.all - time.left;

    // timer bar progress
    time.percentage = time.passed * 100 / time.all;

    // create timer bar
    time.bar = this.createBar(x, y, time.percentage);

    // add text
    time.text = time.bar.addChild(game.add.text(time.bar.width + 15, 2, this.formatTime(time.left), this.styles));
};

GUI.prototype.createAttributeBars = function(x, y, attrs) {
    var i = 0;

    for(a in attrs) {
        var attr = attrs[a];

        // calculate attribute level
        var lvl = attr.current * 100 / attr.max;

        // create attr bar
        var bar = this.createBar(x, y + (this.padding * i), lvl)

        // add icon
        var icon = bar.addChild(game.add.sprite(bar.width + 20, 0, attr.icon));

        icon.width = 20;
        icon.height = 20;

        i++;
    }
};

GUI.prototype.displayInfo = function(x, y, info) {
    this.content.addChild(game.add.text(x, y, info, this.styles));
};

GUI.prototype.showTooltip = function(position, timer, attrs, info) {
    if(this.state == 'actions') return false;

    this.destroyTooltip();

    this.state = 'tooltip';

    this.createTooltip(position);

    var x = 15;
    var y = 15;


    if(timer) {
        this.createTimeBar(x, y, timer);
        y += 30;
    }

    if(attrs) {
        this.createAttributeBars(x, y, attrs);
        y += 30 * Object.keys(attrs).length;
    }

    if(info) {
        this.displayInfo(x, y, info);
    }

};

GUI.prototype.destroyTooltip = function() {
    if(this.tooltip) {
        this.tooltip.destroy();
        this.tooltip = null;
    }
};

GUI.prototype.showActions = function(id, position, actions) {
    this.destroyTooltip();


    if(this.state == 'actions') {
        this.destroyActions();
    } else {
        this.state = 'actions';
        this.createActions(id, position, actions);
    }
};

GUI.prototype.createActions = function(id, position, actions) {
    this.actions = game.add.sprite(position.x, position.y, 'action_line');
    this.content = this.actions.addChild(game.add.sprite(0, 0));
    this.actions.y -= this.actions.height + 15;

    for(a in actions) {
        var action = actions[a];
        var x = 0;
        var y = 0;

        switch(action.position) {
            case 'left':
                x -= 0;
                y += 25;
                break;

            case 'right':
                x += 80;
                y += 50;
                break;

            case 'top':
                x += 45;
                y -= 25;
                break;
        }

        var cta =  this.content.addChild(game.add.sprite(x, y, action.icon));
        cta.anchor.set(0.5);
        cta.width = 50;
        cta.height = 50;

        if(action.enabled) {
            cta.inputEnabled = true;
            cta.input.useHandCursor = true;
            cta.events.onInputOver.add(this.actionOver, {cta: cta, action: action, gui: this});
            cta.events.onInputOut.add(this.actionOut, {cta: cta, action: action, gui: this});
            cta.events.onInputDown.add(this.actionDown, {cta: cta, action: action, gui: this, object: Prefab.all[id]});
        } else {
            cta.tint = this.tint.enabled;
        }
    }

    this.adjustActionsToCamera();
};

GUI.prototype.adjustActionsToCamera = function() {
    // adjust tooltip to camera view y
    if(this.actions.y - 50 < game.camera.view.y) {
        this.actions.y += this.actions.height * 2;
        this.actions.scale.y *= -1;

        this.content.scale.y *= -1;
    }
};

GUI.prototype.destroyActions = function() {
    if(this.actions) {
        this.actions.destroy();
        this.actions = null;
        this.state = 'idle';
    }
};

GUI.prototype.actionOver = function() {
    this.cta.scale.setTo(0.6, 0.6);
};

GUI.prototype.actionOut = function() {
    this.cta.scale.setTo(0.5, 0.5);
};

GUI.prototype.actionDown = function() {
    this.action.callback(this.object);
    this.gui.destroyActions();
};

GUI.prototype.formatTime = function(s) {
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
};
