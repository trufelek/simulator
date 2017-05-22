/*
 Events Class
*/
function Events() {
    this.events = [
        {name: 'escape', penalty: 0, icon: 'event_escape', title: 'Z jednej z twoich klatek uciekły lisy!', message: 'Jeżeli zapomnisz o karmieniu swoich lisów, to może się powtórzyć.'},
        {name:'disease', penalty: 0, icon: 'event_disease', title: 'W jednej z twoich klatek zachorowały lisy!', message: 'Pamiętaj, im więcej zwierząt w pawilonie tym łatwiej o choroby.'},
        {name:'intervention', penalty: 10000, icon: 'event_intervention', title: 'Interwencja Otwartych klatek!', message: 'W związku z ostatnimi wydarzeniami na fermie pojawiły się Otwarte Klatki!'},
        {name:'inspection', penalty: 1000, icon: 'event_inspection', title: 'Niespodziewana kontrola!', message: 'Płacisz karę za nielegalną utylizacje śmieci.'}
    ];

    this.probability = [0.0, 0.0, 0.0, 0.0];

    this.event = null;

    this.popup = null;
    this.sound = game.add.audio('event');

    this.message = {
        font: 'bold 16px Arial',
        fill: '#000000',
        wordWrap: true,
        wordWrapWidth: 400,
        align: 'center'
    };
    this.heading = {
        font: 'bold 18px Arial',
        fill: '#E95052',
        wordWrap: false,
        align: 'center'
    };

    // create timer loop
    game.time.events.loop(Phaser.Timer.SECOND * 30, this.randomEvents, this);
}

Events.prototype.randomEventsTest = function() {
    this.test = {escape: 0, disease: 0, intervention: 0, inspection: 0};

    for(var i = 0; i < 10000; i++) {
        var item = this.getRandomEvent();
        if(item) {
            ++ this.test[item.name];
        }
    }

    console.log(this.test);
};

Events.prototype.randomEvents = function() {
    var event = this.getRandomEvent();

    if(event) {
        this.event = event;

        switch(this.event.name) {
            case 'escape':
                break;
            case 'disease':

                break;
            case 'intervention':

                break;
            case 'inspection':

                break;
        }

        this.sound.play();
        this.showEventMessage();
    }
};

Events.prototype.showEventMessage = function() {
    // draw event message popup
    this.popup = game.add.graphics(window.innerWidth / 2 - 250, window.innerHeight / 2 - 125);
    this.popup.alpha = 0;
    this.popup.beginFill(0xFFFFFF, 0.9);
    this.popup.lineStyle(2, 0x000000, 1);
    this.popup.drawRect(0, 0, 500, 250);
    this.popup.endFill();
    this.popup.inputEnabled = true;
    this.popup.input.priorityID = 4;
    this.popup.fixedToCamera = true;

    // dra event icon
    var icon = this.popup.addChild(game.add.sprite(this.popup.width / 2, 75, this.event.icon, 0));
    icon.width = 120;
    icon.height = 100;
    icon.anchor.setTo(0.5);

    // display event title
    var heading = this.popup.addChild(game.add.text(this.popup.width / 2, 160, this.event.title, this.heading));
    heading.anchor.setTo(0.5);

    // display event message
    var text = this.popup.addChild(game.add.text(this.popup.width / 2, 200, this.event.message, this.message));
    text.anchor.setTo(0.5);


    // display close button
    var close = this.popup.addChild(game.add.sprite(this.popup.width - 55, 5, 'close', 0));
    close.width = 50;
    close.height = 50;
    close.inputEnabled = true;
    close.input.priorityID = 5;
    close.input.useHandCursor = true;
    close.events.onInputDown.add(this.hideEventMessage, this);

    game.input.onDown.add(function() {
        if(game.paused) {
            this.hideEventMessage();
        }
    }, this);

    // show message
    game.add.tween(this.popup).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);

    // on sound stop pause game
    this.sound.onStop.add(function() {
        game.paused = true;
    }, this);
};

Events.prototype.hideEventMessage = function() {
    // unpause game
    game.paused = false;

    var index = this.events.indexOf(this.event);
    this.probability[index] = 0.0;
    this.event = null;

    // hide message
    var tween = game.add.tween(this.popup).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
    tween.onComplete.add(function() {
        this.popup.destroy();
    }, this);
};

Events.prototype.getRandomEvent = function() {
    // get random number from 0 to 1
    var random = this.random(0, 1);
    var sum = 0;

    // for every event check probability
    for(var i = 0; i < this.events.length; i++) {
        sum += this.probability[i];
        sum = +sum.toFixed(2);

        if(random <= sum) {
            return this.events[i];
        }
    }
};

Events.prototype.random = function(min, max) {
    return Math.random() * (max - min) + min;
};
