function GUI() {
    this.styles = {
        font: '14px Arial',
        fill: '#000000',
        wordWrap: false,
        align: 'left'
    };
    this.interfaceStyles = {
        font: '21px Arial',
        fill: '#f0f0f0',
        wordWrap: false,
        align: 'left'
    };

    this.progress = {
        tint: {
            full: '0x97d143',
            almost: '0xfff855',
            little: '0xffab55',
            none: '0xff5855'
        }
    };

    this.tint = {
        enabled: '0xB3B3B3',
        debt: '0xff5855'
    };

    this.properities = {
        padding: 30,
        state: 'idle'
    };

    this.tooltip = null;
    this.line = null;
    this.content = null;
    this.wrapper = null;
    this.actions = null;

    this.timer = null;
    this.cash = null;

    this.createInterface();
}

GUI.prototype.createInterface = function() {
    var interface = game.add.group();
    var wallet = game.add.sprite(25, 15, 'wallet');
    wallet.width = 50;
    wallet.height = 50;
    wallet.fixedToCamera = true;

    this.cash = game.add.text(85, 35, '0 zł', this.interfaceStyles);

    var clock = game.add.sprite(window.innerWidth - 65, 20, 'timer');
    clock.width = 40;
    clock.height = 40;
    clock.fixedToCamera = true;

    this.timer = game.add.text(window.innerWidth - clock.width - 90, 35, '00:00', this.interfaceStyles);

    interface.add(this.timer, this.cash);
    interface.add(this.cash);

    interface.fixedToCamera = true;
};


GUI.prototype.updateInterface = function() {
    var time = Math.round(game.time.now / 1000);
    this.timer.setText(this.formatTime(time));

    this.cash.setText(game.farm.owner.cash + ' zł');

    if(game.farm.owner.cash < 0) {
        this.cash.tint = this.tint.debt;
    }
};

GUI.prototype.showTooltip = function(position, timer, attrs, info) {
    // if actions visible, do nto show tooltip
    if(this.properities.state == 'actions') return false;

    // destroy previous tooltip
    this.destroyTooltip();

    // change state to tooltip
    this.properities.state = 'tooltip';

    // create new tooltip
    this.createTooltip(position, timer, attrs, info);

    // draw tooltip shapes
    this.drawTooltip(position);

    // adjust tooltip to camera view
    this.adjustTooltipToCamera();
};

GUI.prototype.createTooltip = function(position, timer, attrs, info) {
    // creates tooltip rectangle
    this.tooltip = game.add.sprite(position.x, position.y);

    // add line from tooltip to object
    this.line = this.tooltip.addChild(game.add.sprite(0, this.tooltip.height / 2, 'tooltip_line'));

    // add wrapper shape
    this.wrapper = this.tooltip.addChild(game.add.sprite(0, 0));

    // add tooltip content container
    this.content = this.tooltip.addChild(game.add.sprite(0, 0));

    var x = 15; var y = 15;

    // if timer, create one
    if(timer) {
        this.createTimeBar(x, y, timer);
        y += this.properities.padding;
    }

    // if attributes, create bars
    if(attrs) {
        this.createAttributeBars(x, y, attrs);
        y += this.properities.padding * Object.keys(attrs).length;
    }

    // if info, display info
    if(info) {
        this.displayInfo(x, y, info);
    }
};

GUI.prototype.drawTooltip = function(position) {
    var height = this.tooltipHeight() + 15;
    var width = 240;

    var bmd = game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    bmd.ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    bmd.ctx.lineWidth = 5;
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fill();
    bmd.ctx.stroke();

    this.wrapper.loadTexture(bmd);

    // set tooltip position
    this.line.x = - this.line.width;
    this.tooltip.x = position.x + this.line.width;
    this.tooltip.y = position.y - this.line.height - 30;
};

GUI.prototype.tooltipHeight = function() {
    var children_height = 0;

    this.content.children.forEach(function(item, index){
        children_height += item.height;
    });

    if(children_height < this.properities.padding) {
        children_height = this.properities.padding;
    }

    return children_height;
};

GUI.prototype.adjustTooltipToCamera = function() {
    // adjust tooltip to camera view x
    if(this.tooltip.x + this.wrapper.width > game.camera.view.x + game.camera.view.width) {
        this.tooltip.x -= this.wrapper.width / 2;
        this.tooltip.scale.x *= -1;

        this.content.scale.x *= -1;
        this.content.x += this.wrapper.width;
    }

    // adjust tooltip to camera view y
    if(this.tooltip.y < game.camera.view.y) {
        this.tooltip.y += this.wrapper.height + this.line.height / 2 + 15;
        this.line.scale.y *= -1;
    }
};

GUI.prototype.createBar = function(x, y, percentage) {
    // create bar sprite
    var progress = this.content.addChild(game.add.sprite(x, y, 'progress_bar'));
    var bar = this.content.addChild(game.add.sprite(x, y, 'bar'));
    var tint;

    // tint bar progress
    if(percentage >= 80) {
        tint = this.progress.tint.full;
    } else if(percentage < 80 && percentage >= 50) {
        tint = this.progress.tint.almost;
    } else if(percentage < 50 && percentage >= 25) {
        tint = this.progress.tint.little;
    } else if (percentage < 25) {
        tint = this.progress.tint.none;
    }

    // bar progress width
    progress.width = progress.width * percentage / 100;
    progress.tint = tint;

    return bar;
};

GUI.prototype.createTimeBar = function(x, y, timer) {
    // calculate time
    var time = {};

    time.all = Math.round((timer.event.delay) / 1000);
    time.left = Math.round((timer.event.delay - timer.clock.ms) / 1000);
    time.passed = time.all - time.left;

    // timer bar progress
    time.percentage = time.passed * 100 / time.all;

    // create timer bar
    time.bar = this.createBar(x, y, time.percentage);

    // add text
    time.text = time.bar.addChild(game.add.text(time.bar.width + 15, 2, this.formatTime(time.left), this.styles));
};

GUI.prototype.createAttributeBars = function(x, y, attrs) {
    // for every attribute create bar
    var i = 0;

    for(a in attrs) {
        var attr = attrs[a];

        // calculate attribute level
        var lvl = attr.current * 100 / attr.max;

        // create attr bar
        var bar = this.createBar(x, y + (this.properities.padding * i), lvl);

        // add icon
        var icon = bar.addChild(game.add.sprite(bar.width + 20, 0, attr.icon));

        icon.width = 20;
        icon.height = 20;

        i++;
    }
};

GUI.prototype.displayInfo = function(x, y, info) {
    // add info to tooltip
    this.content.addChild(game.add.text(x, y, info, this.styles));
};

GUI.prototype.destroyTooltip = function() {
    // if tooltip exists, destroy it
    if(this.tooltip) {
        this.tooltip.destroy();
        this.tooltip = null;
    }
};

GUI.prototype.showActions = function(id, position, actions) {
    // if tooltip is visible destroy it
    this.destroyTooltip();

    // if actions are visible, hide them, if not, create them
    if(this.properities.state == 'actions') {
        this.destroyActions();
    } else {
        this.properities.state = 'actions';
        this.createActions(id, position, actions);
    }
};

GUI.prototype.createActions = function(id, position, actions) {
    // create action pointer and adjust its position
    this.actions = game.add.sprite(position.x, position.y, 'action_line');
    this.content = this.actions.addChild(game.add.sprite(0, 0));
    this.actions.y -= this.actions.height + 15;

    // for every action, create action button
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

    // adjust actions to camera
    this.adjustActionsToCamera();
};

GUI.prototype.adjustActionsToCamera = function() {
    // adjust tooltip to camera view y
    if(this.actions.y - 50 < game.camera.view.y) {
        this.actions.y += this.actions.height * 2;
        this.actions.scale.y *= -1;

        // adjust actions content
        this.content.scale.y *= -1;
    }
};

GUI.prototype.destroyActions = function() {
    // if actions exist, destroy them
    if(this.actions) {
        this.actions.destroy();
        this.actions = null;
        this.properities.state = 'idle';
    }
};

GUI.prototype.actionOver = function() {
    // scale out action button
    this.cta.scale.setTo(0.6, 0.6);
};

GUI.prototype.actionOut = function() {
    // scale in action button
    this.cta.scale.setTo(0.5, 0.5);
};

GUI.prototype.actionDown = function() {
    // on click call action callback
    this.action.callback(this.object);
    this.gui.destroyActions();
};

GUI.prototype.formatTime = function(s) {
    // format time to 00:00
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
};
